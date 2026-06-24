import {text, integer} from 'drizzle-orm/sqlite-core';
import {sqliteTable} from 'drizzle-orm/sqlite-core';

export const budgets = sqliteTable('budgets', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull(), // monthly, weekly, etc

  startDate: integer('start_date').notNull(),
  endDate: integer('end_date').notNull(),

  amount: integer('amount').notNull(),

  icon: text('icon'),
  iconColor: text('icon_color'),

  enableNotify: integer('enable_notify', {mode: 'boolean'}).notNull(),
  isActive: integer('is_active', {mode: 'boolean'}).notNull().default(false),

  createdAt: integer('created_at'),
  updatedAt: integer('updated_at'),
});
