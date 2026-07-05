import {text, integer} from 'drizzle-orm/sqlite-core';
import {sqliteTable} from 'drizzle-orm/sqlite-core';

export const providers = sqliteTable('providers', {
  id: text('id').primaryKey(),

  name: text('name').notNull().unique(), // Cash, Gopay, Dana, ShopeePay, OVO
  identifier: text('identifier').notNull().unique(),

  logo: text('logo'),

  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
