import {db} from '@/db/client';
import {budgets, expenseProviders, expenses, userProviders, users} from '@/db/schema';
import {supabase} from '@/lib';
import {PostgrestSingleResponse} from '@supabase/supabase-js';
import {eq} from 'drizzle-orm';
import {DevSettings} from 'react-native';

type IAllSchema = IBudgetSchema | IExpenseSchema | IExpenseProviderSchema | IUserSchema | IUserProviderSchema;

const NonPrimaryTables = ['EXPENSE_PROVIDER'];

export const loadSavedData = async (userId: string, userSupabase: IUserSchema) => {
  const results = await populateExistingDatas(userSupabase.id);

  const primaryTables = Array.from(results).filter(([key]) => !NonPrimaryTables.includes(key));
  const secondaryTables = Array.from(results).filter(([key]) => NonPrimaryTables.includes(key));

  const supabaseUserProviders = results.get('USER_PROVIDER');

  // remove existing user providers
  if (supabaseUserProviders !== undefined && Array.isArray(supabaseUserProviders) && supabaseUserProviders.length > 0) {
    await db.delete(userProviders).where(eq(userProviders.userId, userId)).returning();
  }

  // update user data
  await db
    .update(users)
    .set({
      id: userSupabase.id,
      email: userSupabase.email,
      firstName: userSupabase.firstName,
      lastName: userSupabase.lastName,
      createdAt: userSupabase.createdAt,
      primaryCurrencyCode: userSupabase.primaryCurrencyCode,
      avatarUrl: userSupabase.avatarUrl,
    })
    .where(eq(users.id, userId))
    .returning();

  await Promise.all(
    Array.from(primaryTables).map(async ([key, values]) => {
      if (values.length < 1) return;
      const schema = getSchema(key);
      if (!schema) return;

      const inserted = await db.insert(schema).values(values).returning();
      return inserted;
    }),
  );

  await Promise.all(
    Array.from(secondaryTables).map(async ([key, values]) => {
      const schema = getSchema(key);
      if (!schema) return;

      const inserted = await db.insert(schema).values(values).returning();
      return inserted;
    }),
  );

  DevSettings.reload();
};

const populateExistingDatas = async (userSupabaseId: string) => {
  const primaryTableQueries = {
    USER_PROVIDER: (userId: string) => supabase.from('user_provider').select().eq('userId', userId),
    EXPENSE: (userId: string) => supabase.from('expense').select().eq('userId', userId),
    BUDGET: (userId: string) => supabase.from('budget').select().eq('userId', userId),
  };

  const resultMap = new Map<string, IAllSchema[]>();

  await Promise.all(
    Object.entries(primaryTableQueries).map(async ([key, query]) => {
      const dataResponse = await query(userSupabaseId);

      resultMap.set(key, dataResponse.data ?? []);
    }),
  );

  const existingExpenses = resultMap.get('EXPENSE') ?? [];

  if (existingExpenses.length > 0) {
    const populatedExpenseProviders: IAllSchema[] = [];

    await Promise.all(
      existingExpenses.map(async expense => {
        const res: PostgrestSingleResponse<IAllSchema[]> = await supabase
          .from('expense_provider')
          .select()
          .eq('expenseId', expense.id);
        if (res.data) {
          populatedExpenseProviders.push(...res.data);
        }
      }),
    );

    resultMap.set('EXPENSE_PROVIDER', populatedExpenseProviders);
  }

  return resultMap;
};

const getSchema = (key: string) => {
  switch (key) {
    case 'BUDGET':
      return budgets;
    case 'EXPENSE':
      return expenses;
    case 'EXPENSE_PROVIDER':
      return expenseProviders;
    case 'USER':
      return users;
    case 'USER_PROVIDER':
      return userProviders;
    default:
      return;
  }
};
