import {sqliteTable, text} from 'drizzle-orm/sqlite-core';

export const userProviders = sqliteTable('user_providers', {
  userId: text('user_id').notNull(),
  providerId: text('provider_id').notNull(),
});
