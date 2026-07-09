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
