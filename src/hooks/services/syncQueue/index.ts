import {SyncQueueRepo} from '@/db/repositories';
import useProfile from '@/hooks/useProfile';
import {useMemo} from 'react';

export function useSyncQueueRepo() {
  const {user} = useProfile();

  return useMemo(() => {
    return new SyncQueueRepo(user?.id);
  }, [user]);
}
