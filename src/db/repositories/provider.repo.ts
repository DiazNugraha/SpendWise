import {db} from '../client';
import {providers} from '../schema';
import uuid from 'react-native-uuid';

type IProviderInsert = {
  name: string;
};

export const providerRepo = {
  async findAll() {
    return await db.select().from(providers);
  },

  async create(data: IProviderInsert) {
    const now = Date.now();
    const newProviderId = uuid.v4();

    return await db.insert(providers).values({
      id: newProviderId,
      name: data.name,
      createdAt: now,
      updatedAt: now,
    });
  },
};
