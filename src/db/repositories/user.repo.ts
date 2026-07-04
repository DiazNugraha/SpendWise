import {eq, sql} from 'drizzle-orm';
import {db} from '../client';
import {providers, userProviders, users} from '../schema';
import uuid from 'react-native-uuid';

type IUserProviderInsert = {
  providerId: string;
  identifier: string;
};

export const userRepo = {
  async find() {
    return await db.select().from(users);
  },

  async setPrimaryCurrencyCode(userId: string, code: string) {
    return await db
      .update(users)
      .set({
        primaryCurrencyCode: code,
      })
      .where(eq(users.id, userId));
  },

  async getUserProviders() {
    const user = (await userRepo.getUser())[0];
    if (!user) return;

    const result = await db
      .select()
      .from(userProviders)
      .where(eq(userProviders.userId, user.id))
      .leftJoin(providers, eq(userProviders.providerId, providers.id));
    return result;
  },

  async getUser() {
    return await db
      .select()
      .from(users)
      .limit(1)
      .orderBy(sql`${users.createdAt} desc`);
  },

  async createUserProvider(data: IUserProviderInsert) {
    const now = Date.now();
    const newUuid = uuid.v4();

    const user = (await userRepo.getUser())[0];
    if (!user) return;

    return await db.insert(userProviders).values({
      id: newUuid,
      ...data,
      createdAt: now,
      updatedAt: now,
      userId: user.id,
    });
  },

  async updateUserProvider(id: string, data: IUserProviderInsert) {
    const now = Date.now();

    const user = (await userRepo.getUser())[0];
    if (!user) return;

    return await db
      .update(userProviders)
      .set({
        ...data,
        updatedAt: now,
      })
      .where(eq(userProviders.id, id));
  },
};
