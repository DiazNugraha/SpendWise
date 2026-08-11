import {SyncQueueRepo} from '@/db/repositories';
import {useMemo} from 'react';

export function useSyncQueueRepo() {
  return useMemo(() => {
    return new SyncQueueRepo();
  }, []);
}
