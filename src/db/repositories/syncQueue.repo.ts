import uuid from 'react-native-uuid';
import {budgets, expenseProviders, expenses, providers, syncQueues, userProviders, users} from '../schema';
import {SQLiteTransaction} from 'drizzle-orm/sqlite-core';
import {db} from '../client';
import {and, eq, inArray} from 'drizzle-orm';

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

  async getPendings() {
    const pendings = await db
      .select()
      .from(syncQueues)
      .where(and(eq(syncQueues.syncStatus, 'PENDING'), eq(syncQueues.operation, 'CREATE')));

    const resultMap = new Map<string, string[]>();

    function addToMap(key: string, value: string) {
      const items = resultMap.get(key) ?? [];
      items.push(value);
      resultMap.set(key, items);
    }

    await Promise.all(
      pendings.map(async p => {
        const id = p.entityId;
        switch (p.entityType) {
          case 'BUDGET':
            addToMap('BUDGET', id);
            break;
          case 'EXPENSE':
            addToMap('EXPENSE', id);
            break;
          case 'EXPENSE_PROVIDER':
            addToMap('EXPENSE_PROVIDER', id);
            break;
          case 'PROVIDER':
            addToMap('PROVIDER', id);
            break;
          case 'USER':
            addToMap('USER', id);

            break;
          case 'USER_PROVIDER':
            addToMap('USER_PROVIDER', id);
            break;
          default:
            break;
        }
      }),
    );

    const results = Array.from(resultMap).map(([key, values]) => ({
      key,
      values,
    }));

    const pendingItems = await Promise.all(
      results.map(async r => {
        switch (r.key) {
          case 'BUDGET':
            return await db.select().from(budgets).where(inArray(budgets.id, r.values));
          case 'EXPENSE':
            return await db.select().from(expenses).where(inArray(expenses.id, r.values));
          case 'EXPENSE_PROVIDER':
            return await db.select().from(expenseProviders).where(inArray(expenseProviders.id, r.values));
          case 'PROVIDER':
            return await db.select().from(providers).where(inArray(providers.id, r.values));
          case 'USER':
            return await db.select().from(users).where(inArray(users.id, r.values));
          case 'USER_PROVIDER':
            return await db.select().from(userProviders).where(inArray(userProviders.id, r.values));
          default:
        }
      }),
    );

    const filtered = pendingItems.filter(e => e !== undefined && e.length > 0);

    return filtered.flat();
  }
}
