import {db} from '../client';
import {providers} from '../schema';
import uuid from 'react-native-uuid';

type IProviderInsert = {
  name: string;
  identifier: string;
  logo: string;
  createdAt: number;
  updatedAt: number;
};

export class ProviderRepo {
  async findAll() {
    return await db.select().from(providers);
  }

  async create(data: IProviderInsert): Promise<IProviderSchema[]> {
    const newProviderId = uuid.v4();

    return await db
      .insert(providers)
      .values({
        id: newProviderId,
        ...data,
      })
      .returning();
  }

  async createProviders(datas: IProviderInsert[]): Promise<IProviderSchema[]> {
    const formattedDatas = await Promise.all(
      datas.map(async data => {
        const newUuid = uuid.v4();
        return {id: newUuid, ...data};
      }),
    );

    return await db.insert(providers).values(formattedDatas).returning();
  }
}
