import {and, eq, gte, lte, sql} from 'drizzle-orm';
import {db} from '../client';
import {budgets, expenses} from '../schema';
import uuid from 'react-native-uuid';
import {applyWhere} from '@/helpers';

type IBudgetInsert = {
  title: string;
  type: BudgetType;
  startDate: Date;
  endDate: Date;
  amount: number;
  icon: string;
  iconColor: string;
  enableNotify: boolean;
};

export class BudgetRepo {
  constructor(private readonly userId?: string) {}

  async findAll() {
    return await db.select().from(budgets);
  }

  async findById(id: string) {
    return await db.select().from(budgets).where(eq(budgets.id, id));
  }

  async findActivesEachType(options?: {notify?: boolean}) {
    let weeklyQuery = db
      .select()
      .from(budgets)
      .where(and(eq(budgets.type, 'weekly'), eq(budgets.isActive, true)));
    let monthlyQuery = db
      .select()
      .from(budgets)
      .where(and(eq(budgets.type, 'monthly'), eq(budgets.isActive, true)));
    let customQuery = db
      .select()
      .from(budgets)
      .where(and(eq(budgets.type, 'custom'), eq(budgets.isActive, true)));

    if (options?.notify) {
      weeklyQuery = applyWhere(weeklyQuery, eq(budgets.enableNotify, true));
      monthlyQuery = applyWhere(monthlyQuery, eq(budgets.enableNotify, true));
      customQuery = applyWhere(customQuery, eq(budgets.enableNotify, true));
    }

    const weekly = await weeklyQuery;
    const monthly = await monthlyQuery;
    const custom = await customQuery;

    return [weekly[0], monthly[0], custom[0]].filter(e => e !== undefined);
  }

  async findActiveByType(type: BudgetType, options?: {notify?: boolean}) {
    let query = db
      .select()
      .from(budgets)
      .where(and(eq(budgets.type, type), eq(budgets.isActive, true)));

    query = options?.notify ? applyWhere(query, eq(budgets.enableNotify, true)) : query;

    return await query;
  }

  async create(data: IBudgetInsert) {
    const now = Date.now();
    const newBudgetId = uuid.v4();

    return await db.insert(budgets).values({
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
      createdAt: now,
      updatedAt: now,
    });
  }

  async update(id: string, data: IBudgetInsert) {
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
        updatedAt: now,
      })
      .where(eq(budgets.id, id));
  }

  async setToInactive(id: string) {
    return await db
      .update(budgets)
      .set({
        isActive: false,
      })
      .where(and(eq(budgets.id, id), eq(budgets.isActive, true)));
  }

  async getExpensesByBudget(id: string) {
    const budget = await db.select().from(budgets).where(eq(budgets.id, id)).limit(1);

    const {startDate, endDate} = budget[0];

    const existingExpenses = await db
      .select()
      .from(expenses)
      .where(and(gte(expenses.createdAt, startDate), lte(expenses.createdAt, endDate)));

    return existingExpenses;
  }

  async getLastInactiveBudget(budgetType: BudgetType) {
    const budget = await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.isActive, false), eq(budgets.type, budgetType)))
      .orderBy(sql`${budgets.createdAt} desc`)
      .limit(1);

    return budget[0];
  }

  async deleteBudgetById(id: string) {
    return await db.delete(budgets).where(eq(budgets.id, id));
  }
}
