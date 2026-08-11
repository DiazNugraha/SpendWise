import uuid from 'react-native-uuid';
import {db} from '../client';
import {syncQueues} from '../schema';

type ICreateSyncQueueInsert = {
  entityType: entityType;
  entityId: string;
  syncStatus: syncStatusType;
  operation: operationType;
  retryCount: number;
  lastError?: string;
};

export class SyncQueueRepo {
  async createSyncQueue(data: ICreateSyncQueueInsert) {
    const now = Date.now();
    const newUuid = uuid.v4();

    const newQueue = await db.insert(syncQueues).values({
      id: newUuid,
      createdAt: now,
      updatedAt: now,
      ...data,
    });

    return newQueue;
  }
}
