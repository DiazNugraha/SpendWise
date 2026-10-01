import {and, eq, gte, lte, sql} from 'drizzle-orm';
import {db} from '../client';
import {budgets, expenses} from '../schema';
import uuid from 'react-native-uuid';
import {formatDate} from '@/helpers';
import {categoryOptions} from '@/constants/options';
import {LucideIcon} from 'lucide-react-native';
import {SyncQueueRepo} from './syncQueue.repo';

interface IBudgetInsert {
  title: string;
  type: BudgetType;
  startDate: Date;
  endDate: Date;
  amount: number;
  icon?: string;
  iconColor?: string;
  enableNotify: boolean;
  autoRenew: boolean;
  userId?: string;
}

interface IBudgetExpenseAnalytic {
  budgetAmount: number;
  budgetTitle: string;
  categoryCollections: {
    name: string;
    icon?: LucideIcon;
    total: number;
    spentTimes: number;
  }[];
}

export class BudgetRepo {
  constructor(private readonly syncQueueRepo: SyncQueueRepo, private readonly userId?: string) {}

  async findActivesEachType(options?: {notify?: boolean}): Promise<IBudgetSchema[]> {
    let conditions = [eq(budgets.isActive, true)];

    if (options?.notify) {
      conditions.push(eq(budgets.enableNotify, true));
    }

    if (this.userId) {
      conditions.push(eq(budgets.userId, this.userId));
    }

    const weekly = await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.type, 'weekly'), ...conditions));
    const monthly = await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.type, 'monthly'), ...conditions));
    const custom = await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.type, 'custom'), ...conditions));

    return [weekly[0], monthly[0], custom[0]].filter(e => e !== undefined);
  }

  async findActiveByType(type: BudgetType, options?: {notify?: boolean}): Promise<IBudgetSchema[]> {
    const conditions = [eq(budgets.type, type), eq(budgets.isActive, true)];

    if (options?.notify) {
      conditions.push(eq(budgets.enableNotify, true));
    }

    if (this.userId) {
      conditions.push(eq(budgets.userId, this.userId));
    }

    return await db
      .select()
      .from(budgets)
      .where(and(...conditions));
  }

  async create(data: IBudgetInsert): Promise<IBudgetSchema | undefined> {
    if (!this.userId) return;

    const now = Date.now();
    const newBudgetId = uuid.v4();
    const userId = data.userId ?? this.userId;

    return await db.transaction(async tx => {
      const [newBudget] = await tx
        .insert(budgets)
        .values({
          id: newBudgetId,
          title: data.title,
          type: data.type,
          amount: data.amount,
          icon: data.icon,
          iconColor: data.iconColor,
          enableNotify: data.enableNotify,
          startDate: data.startDate.getTime(),
          endDate: data.endDate.getTime(),
          isActive: true,
          autoRenew: data.autoRenew,
          userId: userId,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      await this.syncQueueRepo.createSyncQueue(tx, {
        entityId: newBudget.id,
        entityType: 'BUDGET',
        operation: 'CREATE',
        retryCount: 0,
        syncStatus: 'PENDING',
      });

      return newBudget;
    });
  }

  async update(id: string, data: IBudgetInsert): Promise<IBudgetSchema[] | undefined> {
    if (!this.userId) return;

    const now = Date.now();

    return await db
      .update(budgets)
      .set({
        title: data.title,
        type: data.type,
        amount: data.amount,
        icon: data.icon,
        iconColor: data.iconColor,
        enableNotify: data.enableNotify,
        startDate: data.startDate.getTime(),
        endDate: data.endDate.getTime(),
        autoRenew: data.autoRenew,
        updatedAt: now,
      })
      .where(and(eq(budgets.id, id), eq(budgets.userId, this.userId)))
      .returning();
  }

  async setToInactive(id: string): Promise<IBudgetSchema[]> {
    return await db
      .update(budgets)
      .set({
        isActive: false,
      })
      .where(and(eq(budgets.id, id), eq(budgets.isActive, true)))
      .returning();
  }

  async getExpensesByBudget(id: string): Promise<IExpenseSchema[]> {
    const budget = await db.select().from(budgets).where(eq(budgets.id, id)).limit(1);

    const {startDate, endDate} = budget[0];

    const existingExpenses = await db
      .select()
      .from(expenses)
      .where(and(gte(expenses.createdAt, startDate), lte(expenses.createdAt, endDate)));

    return existingExpenses;
  }

  async getLastInactiveBudget(budgetType: BudgetType): Promise<IBudgetSchema | undefined> {
    if (!this.userId) return;
    const budget = await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.isActive, false), eq(budgets.type, budgetType), eq(budgets.userId, this.userId)))
      .orderBy(sql`${budgets.createdAt} desc`)
      .limit(1);

    return budget[0];
  }

  async getPercentageOfEachBudget(props?: {
    type?: BudgetType;
    dateRange?: {startDate: Date; endDate: Date};
  }): Promise<IBudgetSchema[]> {
    const conditions = [];

    if (props?.type) {
      conditions.push(eq(budgets.type, props.type));
    }

    if (props?.dateRange) {
      conditions.push(
        gte(budgets.startDate, props.dateRange.startDate.getTime()),
        lte(budgets.startDate, props.dateRange.endDate.getTime()),
      );
    }

    if (this.userId) {
      conditions.push(eq(budgets.userId, this.userId));
    }

    const existingBudgets = await db
      .select()
      .from(budgets)
      .where(conditions.length ? and(...conditions) : undefined);

    const result = await Promise.all(
      existingBudgets.map(async budget => {
        const countExpenseAmount = await this.sumExpensesWithinDate(budget.startDate, budget.endDate);

        return {
          label: formatDate(new Date(budget.startDate), {
            locales: 'en-GB',
            dateTimeOption: {
              day: 'numeric',
              month: 'short',
            },
          }),
          value: Math.floor((countExpenseAmount / budget.amount) * 100),
          spentAmount: countExpenseAmount,
          ...budget,
        };
      }),
    );
    return result;
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

  async getBudgetExpensesAnalytic(id: string): Promise<IBudgetExpenseAnalytic | undefined> {
    const selectBudget = (await db.select().from(budgets).where(eq(budgets.id, id)))[0];

    if (!selectBudget) return;

    const budgetExpenses = await this.getExpensesByBudget(id);

    const categoryCollections: {
      name: string;
      icon?: LucideIcon;
      total: number;
      spentTimes: number;
    }[] = [];

    categoryOptions.forEach(category => {
      const filteredExpenses = budgetExpenses.filter(e => e.categoryId === category.value);
      const total = filteredExpenses.reduce((acc, curr) => {
        return acc + curr.amount;
      }, 0);
      if (filteredExpenses.length > 0) {
        categoryCollections.push({
          name: category.label,
          icon: category.icon,
          total: total,
          spentTimes: filteredExpenses.length,
        });
      }
    });

    return {
      budgetAmount: selectBudget.amount,
      budgetTitle: selectBudget.title,
      categoryCollections,
    };
  }

  async deleteBudgetById(id: string): Promise<IBudgetSchema> {
    return await db.transaction(async tx => {
      const [deletedItem] = await tx.delete(budgets).where(eq(budgets.id, id)).returning();

      if (deletedItem) {
        await this.syncQueueRepo.createSyncQueue(tx, {
          entityId: deletedItem.id,
          entityType: 'BUDGET',
          operation: 'DELETE',
          retryCount: 0,
          syncStatus: 'PENDING',
        });
      }

      return deletedItem;
    });
  }
}
