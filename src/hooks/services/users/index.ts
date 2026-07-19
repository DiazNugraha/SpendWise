import {UserRepo} from '@/db/repositories';
import useProfile from '@/hooks/useProfile';
import {useMemo} from 'react';

export function useUserRepo() {
  const {user} = useProfile();

  return useMemo(() => {
    return new UserRepo(user?.id);
  }, [user]);
}
