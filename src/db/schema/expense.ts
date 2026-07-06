import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';

export const expenses = sqliteTable('expenses', {
  id: text('id').primaryKey(),

  title: text('title').notNull(),

  categoryId: text('category_id').notNull(),

  amount: integer('amount').notNull(),

  description: text('description'),

  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
