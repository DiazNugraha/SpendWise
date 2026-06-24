import {db} from '@/db/client';
import {budgets, expenses} from '@/db/schema';

export async function resetDatabase() {
  await db.delete(expenses);
  await db.delete(budgets);
}
