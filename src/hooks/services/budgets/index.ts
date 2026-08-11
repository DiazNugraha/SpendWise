import {BudgetRepo} from '@/db/repositories';
import useProfile from '@/hooks/useProfile';
import {useMemo} from 'react';
import {useSyncQueueRepo} from '../syncQueue';

export function useBudgetRepo() {
  const {user} = useProfile();
  const syncQueueRepo = useSyncQueueRepo();

  return useMemo(() => {
    return new BudgetRepo(syncQueueRepo, user?.id);
  }, [user, syncQueueRepo]);
}
