import {UserRepo} from '@/db/repositories';
import useProfile from '@/hooks/useProfile';
import {useMemo} from 'react';
import {useSyncQueueRepo} from '../syncQueue';

export function useUserRepo() {
  const {user} = useProfile();
  const syncQueueRepo = useSyncQueueRepo();

  return useMemo(() => {
    return new UserRepo(syncQueueRepo, user?.id);
  }, [user, syncQueueRepo]);
}
