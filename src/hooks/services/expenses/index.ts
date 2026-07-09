import {ExpenseRepo} from '@/db/repositories';
import useProfile from '@/hooks/useProfile';
import {useMemo} from 'react';
import {useBudgetRepo} from '../budgets';

export function useExpenseRepo() {
  const {user} = useProfile();
  const budgetRepo = useBudgetRepo();

  return useMemo(() => {
    return new ExpenseRepo(budgetRepo, user?.id);
  }, [user, budgetRepo]);
}
