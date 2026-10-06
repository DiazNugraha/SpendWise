import {text} from 'drizzle-orm/sqlite-core';
import {sqliteTable} from 'drizzle-orm/sqlite-core';
import {userProviders} from './userProvider';
import {expenses} from './expense';

export const expenseProviders = sqliteTable('expense_providers', {
  id: text('id').primaryKey(),
  expenseId: text('expense_id')
    .notNull()
    .references(() => expenses.id, {onDelete: 'cascade'}),
  userProviderId: text('user_provider_id')
    .notNull()
    .references(() => userProviders.id, {onDelete: 'cascade'}),
});
