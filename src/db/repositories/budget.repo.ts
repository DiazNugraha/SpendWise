import {and, eq, gte, lte} from 'drizzle-orm';
import {db} from '../client';
import {budgets, expenses} from '../schema';
import uuid from 'react-native-uuid';

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

export const budgetRepo = {
  async findAll() {
    return await db.select().from(budgets);
  },

  async findById(id: string) {
    return await db.select().from(budgets).where(eq(budgets.id, id));
  },

  async findActiveByType(type: BudgetType) {
    return await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.type, type), eq(budgets.isActive, true)));
  },

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
  },

  async setToInactive(id: string) {
    return await db
      .update(budgets)
      .set({
        isActive: false,
      })
      .where(and(eq(budgets.id, id), eq(budgets.isActive, true)));
  },

  async getExpensesByBudget(id: string) {
    const budget = await db.select().from(budgets).where(eq(budgets.id, id)).limit(1);

    const {startDate, endDate} = budget[0];

    const existingExpenses = await db
      .select()
      .from(expenses)
      .where(and(gte(expenses.createdAt, startDate), lte(expenses.createdAt, endDate)));

    return existingExpenses;
  },
};
