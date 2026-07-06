import {text} from 'drizzle-orm/sqlite-core';
import {sqliteTable} from 'drizzle-orm/sqlite-core';

export const expenseProviders = sqliteTable('expense_providers', {
  id: text('id').primaryKey(),
  expenseId: text('expense_id').notNull(),
  providerId: text('provider_id').notNull(),
});
