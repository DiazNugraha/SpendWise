import {ProviderRepo} from '@/db/repositories';
import {useMemo} from 'react';

export function useProviderRepo() {
  return useMemo(() => {
    return new ProviderRepo();
  }, []);
}
