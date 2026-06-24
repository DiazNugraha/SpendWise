import {providerOptions} from '@/constants/options';
import {db} from '../client';
import {providers} from '../schema';
import uuid from 'react-native-uuid';

export const addProvidersSeeder = async () => {
  const now = Date.now();
  const seedDatas: {id: string; name: string; createdAt: number; updatedAt: number}[] = providerOptions.map(
    provider => {
      const newUuid = uuid.v4();
      return {
        id: newUuid,
        name: provider.label,
        createdAt: now,
        updatedAt: now,
      };
    },
  );

  return await db.insert(providers).values(seedDatas);
};
