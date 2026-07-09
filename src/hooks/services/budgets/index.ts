import {BudgetRepo} from '@/db/repositories';
import useProfile from '@/hooks/useProfile';
import {useMemo} from 'react';

export function useBudgetRepo() {
  const {user} = useProfile();

  return useMemo(() => {
    return new BudgetRepo(user?.id);
  }, [user]);
}
