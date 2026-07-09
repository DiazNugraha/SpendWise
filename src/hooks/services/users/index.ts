import {UserRepo} from '@/db/repositories';
import useProfile from '@/hooks/useProfile';
import {useMemo} from 'react';

export function useUserRepo() {
  const {user} = useProfile();

  if (!user) {
    throw new Error('There are no active session');
  }

  return useMemo(() => {
    return new UserRepo(user?.id);
  }, [user]);
}
