import {eq, sql} from 'drizzle-orm';
import {db} from '../client';
import {expenseProviders, expenses, providers} from '../schema';
import uuid from 'react-native-uuid';
import {applyLimit, applyWhere} from '@/helpers';

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

  async findAll(options?: {limit?: number; categoryId?: string}) {
    let query = db
      .select()
      .from(expenses)
      .orderBy(sql`${expenses.createdAt} desc`);

    query = options?.categoryId
      ? applyWhere(query, eq(expenses.categoryId, options?.categoryId), options?.categoryId)
      : query;
    query = applyLimit(query, options?.limit);

    return await query;
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
};
