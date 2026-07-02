import {db} from '../client';
import {users} from '../schema';
import uuid from 'react-native-uuid';

export const addUserSeeder = async () => {
  const now = Date.now();
  const newUuid = uuid.v4();

  const dummyUser = {
    id: newUuid,
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    createdAt: now,
    updatedAt: now,
  };

  return await db.insert(users).values(dummyUser);
};
