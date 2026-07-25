import {eq, sql} from 'drizzle-orm';
import {db} from '../client';
import {providers, userProviders, users} from '../schema';
import uuid from 'react-native-uuid';

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
  constructor(private readonly userId?: string) {}

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

    const newUser = {
      id: newUserUuid,
      firstName: 'Guest',
      lastName: 'User',
      createdAt: now,
      updatedAt: now,
      isGuest: true,
    };

    await db.insert(users).values(newUser);
    await this.insertInitialUserProvider(newUserUuid);

    return newUser;
  }

  async createUser(data: ICreateUser) {
    const now = Date.now();
    const newUserUuid = uuid.v4();

    const isGuest = !data.email;

    const newUser = {
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

    await db.insert(users).values(newUser);
    await this.insertInitialUserProvider(newUserUuid);

    return newUser;
  }

  async insertInitialUserProvider(userId: string) {
    const cashProvider = (await db.select().from(providers).where(eq(providers.identifier, 'cash')).limit(1))[0];
    if (cashProvider) {
      const now = Date.now();

      const userInitProviderUuid = uuid.v4();
      const newUserProviders = await db.insert(userProviders).values({
        id: userInitProviderUuid,
        providerId: cashProvider.id,
        identifier: cashProvider.identifier,
        userId: userId,
        createdAt: now,
        updatedAt: now,
      });

      return newUserProviders;
    }

    return null;
  }

  async createUserProvider(data: IUserProviderInsert) {
    if (!this.userId) return;

    const now = Date.now();
    const newUuid = uuid.v4();

    return await db.insert(userProviders).values({
      id: newUuid,
      ...data,
      createdAt: now,
      updatedAt: now,
      userId: this.userId,
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
