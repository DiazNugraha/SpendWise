import {and, eq, gte, inArray, lte, sql} from 'drizzle-orm';
import {db} from '../client';
import {expenseProviders, expenses, providers} from '../schema';
import uuid from 'react-native-uuid';
import {applyLimit, applyWhere, getDaysBetween} from '@/helpers';
import {budgetRepo} from './budget.repo';

type IExpenseInsert = {
  title: string;
  categoryId: string;
  amount: number;
  description?: string;
  medium?: string;
  providerIds?: string[];
};

export const expenseRepo = {
  async create(data: IExpenseInsert) {
    const now = Date.now();
    const newExpenseId = uuid.v4();

    // insert expense
    const newExpense = await db.insert(expenses).values({
      id: newExpenseId,
      title: data.title,
      categoryId: data.categoryId,
      amount: data.amount,
      description: data.description,
      medium: data.medium,
      createdAt: now,
      updatedAt: now,
    });

    // link providers (many to many)
    if (data.providerIds && data.providerIds?.length > 0) {
      await db.insert(expenseProviders).values(
        data.providerIds?.map(id => ({
          expenseId: newExpenseId,
          providerId: id,
        })),
      );
    }

    return newExpense;
  },

  async findAll(options?: {limit?: number; categories?: string[]; budgetType?: BudgetType}) {
    let query = db
      .select()
      .from(expenses)
      .orderBy(sql`${expenses.createdAt} desc`);

    query = options?.categories
      ? applyWhere(query, inArray(expenses.categoryId, options.categories), options?.categories)
      : query;
    query = applyLimit(query, options?.limit);

    let totalExpense = 0;

    if (options?.budgetType && options?.budgetType !== 'all') {
      const dateRange = await budgetRepo.findActiveByType(options.budgetType);
      const activeBudget = dateRange[0];

      if (activeBudget) {
        query = applyWhere(
          query,
          and(gte(expenses.createdAt, activeBudget.startDate), lte(expenses.createdAt, activeBudget.endDate)),
        );
        totalExpense = await expenseRepo.sumExpensesWithinDate(activeBudget.startDate, activeBudget.endDate);
      }
    } else {
      const now = new Date();
      const last30Days = new Date(now);
      last30Days.setDate(last30Days.getDate() - 30);

      query = applyWhere(
        query,
        and(gte(expenses.createdAt, last30Days.getTime()), lte(expenses.createdAt, now.getTime())),
      );
      totalExpense = await expenseRepo.sumExpensesWithinDate(last30Days.getTime(), now.getTime());
    }

    const data = await query;

    return {
      data,
      meta: {
        totalExpense,
      },
    };
  },

  async findById(id: string) {
    return await db.select().from(expenses).where(eq(expenses.id, id)).limit(1);
  },

  async deleteById(id: string) {
    return await db.delete(expenses).where(eq(expenses.id, id)).limit(1);
  },

  async findAllDetailed() {
    //  base expenses + category
    const rows = await db
      .select({
        id: expenses.id,
        title: expenses.title,
        amount: expenses.amount,
        categoryId: expenses.categoryId,
      })
      .from(expenses);

    // attach providers
    const expensesWithProviders = rows.map(async row => {
      const findExpenseProviders = await db
        .select()
        .from(expenseProviders)
        .where(eq(expenseProviders.expenseId, row.id));
      const listProviders = findExpenseProviders.map(
        async findExpenseProvider =>
          await db.select().from(providers).where(eq(providers.id, findExpenseProvider.providerId)),
      );

      return {
        ...row,
        providers: listProviders,
      };
    });

    return expensesWithProviders;
  },

  async sumExpensesWithinDate(startDate: number, endDate: number) {
    const result = await db
      .select({
        total: sql<number>`COALESCE(sum(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .where(and(gte(expenses.createdAt, startDate), lte(expenses.createdAt, endDate)));

    return result[0]?.total ?? 0;
  },

  async compareProgressWithLastBudgetGoal(budgetType: BudgetType): Promise<number> {
    const now = new Date();

    const currentActiveBudget = (await budgetRepo.findActiveByType(budgetType))[0];
    if (!currentActiveBudget) return 0;

    const lastInactiveBudget = await budgetRepo.getLastInactiveBudget(budgetType);

    if (!lastInactiveBudget) return 100;

    const daysPointDiff = getDaysBetween(new Date(currentActiveBudget.startDate), now);

    const samePointOfTimeInLastBudget = new Date(lastInactiveBudget.startDate);
    samePointOfTimeInLastBudget.setDate(samePointOfTimeInLastBudget.getDate() + daysPointDiff);
    const currentGoalsExpense = await expenseRepo.sumExpensesWithinDate(currentActiveBudget.startDate, now.getTime());

    const lastGoalsExpense = await expenseRepo.sumExpensesWithinDate(
      lastInactiveBudget.startDate,
      samePointOfTimeInLastBudget.getTime(),
    );

    const currentGoalRate = (currentGoalsExpense / currentActiveBudget.amount) * 100;
    const lastGoalRate = (lastGoalsExpense / lastInactiveBudget.amount) * 100;
    return Math.floor(((currentGoalRate - lastGoalRate) / lastGoalRate) * 100);
  },
};
