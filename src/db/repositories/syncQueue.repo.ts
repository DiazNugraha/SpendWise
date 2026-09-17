import uuid from 'react-native-uuid';
import {syncQueues} from '../schema';
import {SQLiteTransaction} from 'drizzle-orm/sqlite-core';

type ICreateSyncQueueInsert = {
  entityType: entityType;
  entityId: string;
  syncStatus: syncStatusType;
  operation: operationType;
  retryCount: number;
  lastError?: string;
};

export class SyncQueueRepo {
  async createSyncQueue(
    tx: SQLiteTransaction<'async', any, any, any>,
    data: ICreateSyncQueueInsert,
  ): Promise<ISyncQueueSchema> {
    const now = Date.now();
    const newUuid = uuid.v4();

    const [newQueue] = await tx
      .insert(syncQueues)
      .values({
        id: newUuid,
        createdAt: now,
        updatedAt: now,
        ...data,
      })
      .returning();

    return newQueue;
  }
}
