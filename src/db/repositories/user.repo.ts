import {eq, sql} from 'drizzle-orm';
import {db} from '../client';
import {providers, userProviders, users} from '../schema';
import uuid from 'react-native-uuid';
import {SyncQueueRepo} from './syncQueue.repo';
import {SQLiteTransaction} from 'drizzle-orm/sqlite-core';

type IUserProviderInsert = {
  providerId: string;
  identifier: string;
};

type IUserInput = {
  firstName: string;
  lastName: string;
};

type ICreateUser = {
  firstName: string;
  lastName?: string;
  email: string;
  avatarUrl?: string;
  primaryCurrencyCode?: string;
};

type IUpdateUserSyncEmail = {
  firstName: string;
  lastName?: string;
  email: string;
  avatarUrl: string;
};

export class UserRepo {
  constructor(private readonly syncQueueRepo: SyncQueueRepo, private readonly userId?: string) {}

  async find() {
    return await db.select().from(users);
  }

  async setPrimaryCurrencyCode(userId: string, code: string) {
    return await db
      .update(users)
      .set({
        primaryCurrencyCode: code,
      })
      .where(eq(users.id, userId));
  }

  async getUserProviders() {
    if (!this.userId) return;

    const result = await db
      .select()
      .from(userProviders)
      .where(eq(userProviders.userId, this.userId))
      .leftJoin(providers, eq(userProviders.providerId, providers.id));
    return result;
  }

  async getUser() {
    return await db
      .select()
      .from(users)
      .limit(1)
      .orderBy(sql`${users.createdAt} desc`);
  }

  async updateUser(userId: string, data: IUserInput) {
    return await db
      .update(users)
      .set({
        ...data,
      })
      .where(eq(users.id, userId));
  }

  async updateUserSyncEmail(userId: string, data: IUpdateUserSyncEmail) {
    const now = Date.now();
    return await db
      .update(users)
      .set({
        ...data,
        isGuest: false,
        updatedAt: now,
      })
      .where(eq(users.id, userId));
  }

  async createGuestUser() {
    const now = Date.now();
    const newUserUuid = uuid.v4();

    const newUserPayload = {
      id: newUserUuid,
      firstName: 'Guest',
      lastName: 'User',
      createdAt: now,
      updatedAt: now,
      isGuest: true,
    };

    return await db.transaction(async tx => {
      const [newUser] = await tx.insert(users).values(newUserPayload).returning();
      await this.insertInitialUserProvider(tx, newUser.id, newUser.isGuest);

      return newUser;
    });
  }

  async createUser(data: ICreateUser) {
    const now = Date.now();
    const newUserUuid = uuid.v4();

    const isGuest = !data.email;

    const newUserPayload = {
      id: newUserUuid,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      avatarUrl: data.avatarUrl,
      createdAt: now,
      updatedAt: now,
      isGuest: isGuest,
      primaryCurrencyCode: data.primaryCurrencyCode,
    };

    return await db.transaction(async tx => {
      const [newUser] = await tx.insert(users).values(newUserPayload).returning();
      await this.insertInitialUserProvider(tx, newUserUuid, newUser.isGuest);

      await this.syncQueueRepo.createSyncQueue(tx, {
        entityId: newUser.id,
        entityType: 'USER',
        operation: 'CREATE',
        retryCount: 0,
        syncStatus: 'PENDING',
      });

      return newUser;
    });
  }

  async insertInitialUserProvider(tx: SQLiteTransaction<'async', any, any, any>, userId: string, isGuest: boolean) {
    const cashProvider = (await tx.select().from(providers).where(eq(providers.identifier, 'cash')).limit(1))[0];
    if (cashProvider) {
      const now = Date.now();

      const userInitProviderUuid = uuid.v4();
      const [newUserProvider] = await tx
        .insert(userProviders)
        .values({
          id: userInitProviderUuid,
          providerId: cashProvider.id,
          identifier: cashProvider.identifier,
          userId: userId,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      if (!isGuest) {
        await this.syncQueueRepo.createSyncQueue(tx, {
          entityId: newUserProvider.id,
          entityType: 'USER_PROVIDER',
          operation: 'CREATE',
          retryCount: 0,
          syncStatus: 'PENDING',
        });
      }

      return newUserProvider;
    }

    return null;
  }

  async createUserProvider(data: IUserProviderInsert) {
    const userId = this.userId;
    if (!userId) return;

    const now = Date.now();
    const newUuid = uuid.v4();

    return await db.transaction(async tx => {
      const [newUserProvider] = await tx
        .insert(userProviders)
        .values({
          id: newUuid,
          ...data,
          createdAt: now,
          updatedAt: now,
          userId: userId,
        })
        .returning();

      await this.syncQueueRepo.createSyncQueue(tx, {
        entityId: newUserProvider.id,
        entityType: 'USER_PROVIDER',
        operation: 'CREATE',
        retryCount: 0,
        syncStatus: 'PENDING',
      });

      return newUserProvider;
    });
  }

  async updateUserProvider(id: string, data: IUserProviderInsert) {
    const now = Date.now();

    return await db
      .update(userProviders)
      .set({
        ...data,
        updatedAt: now,
      })
      .where(eq(userProviders.id, id));
  }

  async removeUserProvider(id: string) {
    return await db.delete(userProviders).where(eq(userProviders.id, id));
  }
}
