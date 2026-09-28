import {text} from 'drizzle-orm/sqlite-core';
import {sqliteTable} from 'drizzle-orm/sqlite-core';

export const expenseProviders = sqliteTable('expense_providers', {
  id: text('id').primaryKey(),
  expenseId: text('expense_id').notNull(),
  userProviderId: text('user_provider_id').notNull(),
});
