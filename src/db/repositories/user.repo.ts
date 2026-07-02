import {db} from '../client';
import {users} from '../schema';

export const userRepo = {
  async find() {
    return await db.select().from(users);
  },
};
