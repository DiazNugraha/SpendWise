import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';

export const syncQueues = sqliteTable('sync_queues', {
  id: text('id').primaryKey(),

  entityType: text('entity_type').notNull(), // BUDGET | EXPENSE | EXPENSE_PROVIDER | PROVIDER | USER | USER_PROVIDER
  entityId: text('entity_id').notNull(),

  syncStatus: text('sync_status').notNull(), // PENDING | SYNCED | FAILED
  operation: text('operation').notNull(), // CREATE | UPDATE | DELETE

  retryCount: integer('retry_count').default(0).notNull(),
  lastError: text('last_error'),

  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
