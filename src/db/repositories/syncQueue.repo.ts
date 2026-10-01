import uuid from 'react-native-uuid';
import {budgets, expenseProviders, expenses, syncQueues, userProviders, users} from '../schema';
import {SQLiteTransaction} from 'drizzle-orm/sqlite-core';
import {db} from '../client';
import {and, eq, inArray} from 'drizzle-orm';
import {filterSyncQueueIdsByEntityType} from '@/helpers';

type ICreateSyncQueueInsert = {
  entityType: entityType;
  entityId: string;
  syncStatus: syncStatusType;
  operation: operationType;
  retryCount: number;
  lastError?: string;
};

type IAllSchema = IBudgetSchema | IExpenseSchema | IExpenseProviderSchema | IUserSchema | IUserProviderSchema;

export class SyncQueueRepo {
  constructor(private readonly userId?: string) {}

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

  async getSyncDatas({syncStatus, operation}: {syncStatus?: string; operation?: string}): Promise<
    {
      key: string;
      values: (IAllSchema | string)[];
    }[]
  > {
    const userId = this.userId;
    if (!userId) return [];

    const filters: any[] = [];

    if (syncStatus) {
      filters.push(eq(syncQueues.syncStatus, syncStatus));
    }

    if (operation) {
      filters.push(eq(syncQueues.operation, operation));
    }

    const pendings: ISyncQueueSchema[] = await db
      .select()
      .from(syncQueues)
      .where(and(...filters));

    const results = await filterSyncQueueIdsByEntityType(pendings);

    const resultMap = new Map<string, (IAllSchema | string)[]>();

    function addToMap(key: string, datas: (IAllSchema | string)[]) {
      let current = resultMap.get(key) ?? [];
      current = [...current, ...datas];
      resultMap.set(key, current);
    }

    const queries = {
      BUDGET: (ids: string[]) =>
        db
          .select({
            id: budgets.id,
            createdAt: budgets.createdAt,
            updatedAt: budgets.updatedAt,
            title: budgets.title,
            type: budgets.type,
            amount: budgets.amount,
            icon: budgets.icon,
            iconColor: budgets.iconColor,
            enableNotify: budgets.enableNotify,
            autoRenew: budgets.autoRenew,
            isActive: budgets.isActive,
            startDate: budgets.startDate,
            endDate: budgets.endDate,
            userId: budgets.userId,
          })
          .from(budgets)
          .where(and(inArray(budgets.id, ids), eq(budgets.userId, userId))),
      EXPENSE: (ids: string[]) =>
        db
          .select({
            id: expenses.id,
            createdAt: expenses.createdAt,
            updatedAt: expenses.updatedAt,
            title: expenses.title,
            categoryId: expenses.categoryId,
            amount: expenses.amount,
            description: expenses.description,
            userId: expenses.userId,
          })
          .from(expenses)
          .where(and(inArray(expenses.id, ids), eq(expenses.userId, userId))),
      EXPENSE_PROVIDER: (ids: string[]) =>
        db
          .select({
            id: expenseProviders.id,
            expenseId: expenseProviders.expenseId,
            userProviderId: expenseProviders.userProviderId,
          })
          .from(expenseProviders)
          .where(inArray(expenseProviders.id, ids)),
      USER: (ids: string[]) =>
        db
          .select({
            id: users.id,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            primaryCurrencyCode: users.primaryCurrencyCode,
            avatarUrl: users.avatarUrl,
          })
          .from(users)
          .where(and(inArray(users.id, ids), eq(users.id, userId))),
      USER_PROVIDER: (ids: string[]) =>
        db
          .select({
            id: userProviders.id,
            createdAt: userProviders.createdAt,
            updatedAt: userProviders.updatedAt,
            identifier: userProviders.identifier,
            description: userProviders.description,
            userId: userProviders.userId,
          })
          .from(userProviders)
          .where(and(inArray(userProviders.id, ids), eq(userProviders.userId, userId))),
    };

    if (operation === 'CREATE' || operation === 'UPDATE') {
      await Promise.all(
        results.map(async res => {
          const query = queries[res.key as keyof typeof queries];

          if (!query) return;

          const data = await query(res.values);
          addToMap(res.key.toLowerCase(), data);
        }),
      );
    }

    if (operation === 'DELETE') {
      await Promise.all(
        results.map(async res => {
          addToMap(res.key.toLowerCase(), res.values);
        }),
      );
    }

    return Array.from(resultMap).map(([key, values]) => ({key, values}));
  }

  async updateBatch({
    operation,
    syncStatus,
    entityType,
    retryCount,
    lastError,
    entityIds,
  }: {
    operation: string;
    syncStatus: string;
    entityType: string;
    retryCount: number;
    lastError?: string;
    entityIds: string[];
  }) {
    return await db
      .update(syncQueues)
      .set({
        operation,
        syncStatus,
        retryCount,
        entityType,
        lastError,
      })
      .where(
        and(
          inArray(syncQueues.entityId, entityIds),
          eq(syncQueues.operation, operation),
          eq(syncQueues.entityType, entityType),
        ),
      )
      .returning();
  }

  async getOneByEntityId(entityId: string) {
    return (await db.select().from(syncQueues).where(eq(syncQueues.entityId, entityId)))[0];
  }
}
