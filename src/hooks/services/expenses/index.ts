import {ExpenseRepo} from '@/db/repositories';
import useProfile from '@/hooks/useProfile';
import {useMemo} from 'react';
import {useBudgetRepo} from '../budgets';
import {useSyncQueueRepo} from '../syncQueue';

export function useExpenseRepo() {
  const {user} = useProfile();
  const budgetRepo = useBudgetRepo();
  const syncQueueRepo = useSyncQueueRepo();

  return useMemo(() => {
    return new ExpenseRepo(syncQueueRepo, budgetRepo, user?.id);
  }, [user, budgetRepo, syncQueueRepo]);
}
