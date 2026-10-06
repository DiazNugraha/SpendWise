import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {users} from './user';

export const userProviders = sqliteTable('user_providers', {
  id: text('id').primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, {onDelete: 'cascade'}),

  identifier: text('identifier').notNull(),
  description: text('description'),

  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
