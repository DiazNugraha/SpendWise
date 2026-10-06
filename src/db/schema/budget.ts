import {text, integer} from 'drizzle-orm/sqlite-core';
import {sqliteTable} from 'drizzle-orm/sqlite-core';
import {users} from './user';

export const budgets = sqliteTable('budgets', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull(), // monthly, weekly, custom

  startDate: integer('start_date').notNull(),
  endDate: integer('end_date').notNull(),

  amount: integer('amount').notNull(),

  icon: text('icon'),
  iconColor: text('icon_color'),

  enableNotify: integer('enable_notify', {mode: 'boolean'}).notNull().default(false),
  autoRenew: integer('auto_renew', {mode: 'boolean'}).notNull().default(false),

  isActive: integer('is_active', {mode: 'boolean'}).notNull().default(false),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, {onDelete: 'cascade'}),

  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
