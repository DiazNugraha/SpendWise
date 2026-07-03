import {eq, sql} from 'drizzle-orm';
import {db} from '../client';
import {providers, userProviders, users} from '../schema';

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
};
