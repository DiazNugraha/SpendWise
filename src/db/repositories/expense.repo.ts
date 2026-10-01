import {and, eq, gte, inArray, lte, sql} from 'drizzle-orm';
import {db} from '../client';
import {expenseProviders, expenses} from '../schema';
import uuid from 'react-native-uuid';
import {getDaysBetween} from '@/helpers';
import {BudgetRepo} from './budget.repo';
import {SyncQueueRepo} from './syncQueue.repo';

type IExpenseInsert = {
  title: string;
  categoryId: string;
  amount: number;
  description?: string;
  userProviderIds?: string[];
};

export class ExpenseRepo {
  constructor(
    private readonly syncQueueRepo: SyncQueueRepo,
    private readonly budgetRepo: BudgetRepo,
    private readonly userId?: string,
  ) {}

  async create(data: IExpenseInsert): Promise<IExpenseSchema | undefined> {
    const userId = this.userId;

    if (!userId) return;

    const now = Date.now();
    const newExpenseId = uuid.v4();

    return await db.transaction(async tx => {
      // insert expense
      const [newExpense] = await tx
        .insert(expenses)
        .values({
          id: newExpenseId,
          title: data.title,
          categoryId: data.categoryId,
          amount: data.amount,
          description: data.description,
          userId: userId,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      let newExpenseProviders: {id: string; expenseId: string; userProviderId: string}[] = [];
      // link providers (many to many)
      const formattedProviders = data.userProviderIds?.map(id => ({
        id: uuid.v4(),
        expenseId: newExpense.id,
        userProviderId: id,
      }));

      if (formattedProviders?.length) {
        const newProviders = await tx.insert(expenseProviders).values(formattedProviders).returning();
        newExpenseProviders = newProviders;
      }

      await this.syncQueueRepo.createSyncQueue(tx, {
        entityId: newExpense.id,
        entityType: 'EXPENSE',
        operation: 'CREATE',
        retryCount: 0,
        syncStatus: 'PENDING',
      });

      if (newExpenseProviders.length > 0) {
        await Promise.all(
          newExpenseProviders.map(async nep => {
            await this.syncQueueRepo.createSyncQueue(tx, {
              entityId: nep.id,
              entityType: 'EXPENSE_PROVIDER',
              operation: 'CREATE',
              retryCount: 0,
              syncStatus: 'PENDING',
            });
          }),
        );
      }

      return newExpense;
    });
  }

  async findAll(options?: {limit?: number; categories?: string[]; budgetType?: BudgetType}): Promise<{
    data: IExpenseSchema[];
    meta: {
      totalExpense: number;
    };
  }> {
    const conditions = [];

    if (options?.categories) {
      conditions.push(inArray(expenses.categoryId, options.categories));
    }

    if (this.userId) {
      conditions.push(eq(expenses.userId, this.userId));
    }

    let totalExpense = 0;

    if (options?.budgetType && options?.budgetType !== 'all') {
      const dateRange = await this.budgetRepo.findActiveByType(options.budgetType);
      const activeBudget = dateRange[0];

      if (activeBudget) {
        conditions.push(
          and(gte(expenses.createdAt, activeBudget.startDate), lte(expenses.createdAt, activeBudget.endDate)),
        );

        totalExpense = await this.sumExpensesWithinDate(activeBudget.startDate, activeBudget.endDate);
      }
    } else {
      const now = new Date();
      const last30Days = new Date(now);
      last30Days.setDate(last30Days.getDate() - 30);

      conditions.push(and(gte(expenses.createdAt, last30Days.getTime()), lte(expenses.createdAt, now.getTime())));

      totalExpense = await this.sumExpensesWithinDate(last30Days.getTime(), now.getTime());
    }

    const baseQuery = db
      .select()
      .from(expenses)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(sql`${expenses.createdAt} desc`);

    const data = await (options?.limit != null ? baseQuery.limit(options.limit) : baseQuery);

    return {
      data,
      meta: {
        totalExpense,
      },
    };
  }

  async deleteById(id: string) {
    return await db.transaction(async tx => {
      const [deletedItem] = await tx.delete(expenses).where(eq(expenses.id, id)).returning();

      if (deletedItem) {
        await this.syncQueueRepo.createSyncQueue(tx, {
          entityId: deletedItem.id,
          entityType: 'EXPENSE',
          operation: 'DELETE',
          retryCount: 0,
          syncStatus: 'PENDING',
        });
      }

      return deletedItem;
    });
  }

  async sumExpensesWithinDate(startDate: number, endDate: number): Promise<number> {
    if (!this.userId) return 0;

    const result = await db
      .select({
        total: sql<number>`COALESCE(sum(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .where(
        and(gte(expenses.createdAt, startDate), lte(expenses.createdAt, endDate), eq(expenses.userId, this.userId)),
      );

    return result[0]?.total ?? 0;
  }

  async checkIfThereIsBudgetGoalsToNotify(): Promise<IBudgetSchema[]> {
    const activeBudgetGoals = await this.budgetRepo.findActivesEachType({notify: true});
    const needToNotify = await Promise.all(
      activeBudgetGoals.map(async budget => {
        const expensesTotal = await this.sumExpensesWithinDate(budget.startDate, budget.endDate);
        if (Math.floor((expensesTotal / budget.amount) * 100) > 80) {
          return budget;
        }
        return null;
      }),
    );

    const filtered = needToNotify.filter(e => e !== null);
    return filtered;
  }

  async compareProgressWithLastBudgetGoal(budgetType: BudgetType): Promise<number> {
    const now = new Date();

    const currentActiveBudget = (await this.budgetRepo.findActiveByType(budgetType))[0];
    if (!currentActiveBudget) return 0;

    const lastInactiveBudget = await this.budgetRepo.getLastInactiveBudget(budgetType);

    if (!lastInactiveBudget) return 100;

    const daysPointDiff = getDaysBetween(new Date(currentActiveBudget.startDate), now);

    const samePointOfTimeInLastBudget = new Date(lastInactiveBudget.startDate);
    samePointOfTimeInLastBudget.setDate(samePointOfTimeInLastBudget.getDate() + daysPointDiff);
    const currentGoalsExpense = await this.sumExpensesWithinDate(currentActiveBudget.startDate, now.getTime());

    const lastGoalsExpense = await this.sumExpensesWithinDate(
      lastInactiveBudget.startDate,
      samePointOfTimeInLastBudget.getTime(),
    );

    const currentGoalRate = (currentGoalsExpense / currentActiveBudget.amount) * 100;
    const lastGoalRate = (lastGoalsExpense / lastInactiveBudget.amount) * 100;
    return Math.floor(((currentGoalRate - lastGoalRate) / lastGoalRate) * 100);
  }
}
