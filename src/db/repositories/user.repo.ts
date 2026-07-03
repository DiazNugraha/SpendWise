import {eq} from 'drizzle-orm';
import {db} from '../client';
import {users} from '../schema';

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
};
