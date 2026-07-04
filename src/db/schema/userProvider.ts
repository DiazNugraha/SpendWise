import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';

export const userProviders = sqliteTable('user_providers', {
  id: text('id').primaryKey(),

  userId: text('user_id').notNull(),
  providerId: text('provider_id').notNull(),

  identifier: text('identifier').notNull(),

  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
