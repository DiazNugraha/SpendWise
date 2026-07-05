import uuid from 'react-native-uuid';
import {db} from '../client';
import {providers, userProviders} from '../schema';
import {eq} from 'drizzle-orm';
import {userRepo} from '../repositories';

export const addUserProvider = async () => {
  const now = Date.now();
  const newUuid = uuid.v4();

  const cashProvider = (await db.select().from(providers).where(eq(providers.identifier, 'cash')).limit(1))[0];
  const existingUser = (await userRepo.getUser())[0];

  if (!cashProvider || !existingUser) return;

  return await db.insert(userProviders).values({
    id: newUuid,
    providerId: cashProvider.id,
    identifier: cashProvider.identifier,
    userId: existingUser.id,
    createdAt: now,
    updatedAt: now,
  });
};
