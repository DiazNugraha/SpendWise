import {budgets, expenseProviders, expenses, userProviders, users} from '@/db/schema';

export const getSchema = (key: string) => {
  switch (key) {
    case 'BUDGET':
      return budgets;
    case 'EXPENSE':
      return expenses;
    case 'EXPENSE_PROVIDER':
      return expenseProviders;
    case 'USER':
      return users;
    case 'USER_PROVIDER':
      return userProviders;
    default:
      return;
  }
};

export const filterSyncQueueIdsByEntityType = async (collections: ISyncQueueSchema[]) => {
  const resultMap = new Map<string, string[]>();

  function addToMap(key: string, value: string) {
    const items = resultMap.get(key) ?? [];
    items.push(value);
    resultMap.set(key, items);
  }

  await Promise.all(
    collections.map(async p => {
      const id = p.entityId;
      switch (p.entityType) {
        case 'BUDGET':
          addToMap('BUDGET', id);
          break;
        case 'EXPENSE':
          addToMap('EXPENSE', id);
          break;
        case 'EXPENSE_PROVIDER':
          addToMap('EXPENSE_PROVIDER', id);
          break;
        case 'USER':
          addToMap('USER', id);
          break;
        case 'USER_PROVIDER':
          addToMap('USER_PROVIDER', id);
          break;
        default:
          break;
      }
    }),
  );

  const results = Array.from(resultMap).map(([key, values]) => ({
    key,
    values,
  }));

  return results;
};
