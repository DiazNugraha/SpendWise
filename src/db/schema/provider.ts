import {text} from 'drizzle-orm/sqlite-core';
import {sqliteTable} from 'drizzle-orm/sqlite-core';

export const providers = sqliteTable('providers', {
  id: text('id').primaryKey(),

  name: text('name').notNull(), // Cash, Gopay, Dana, ShopeePay, OVO
});
