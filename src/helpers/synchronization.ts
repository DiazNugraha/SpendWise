import {SyncQueueRepo} from '@/db/repositories';
import {supabase} from '@/lib';

type IAllSchema = IBudgetSchema | IExpenseSchema | IExpenseProviderSchema | IUserSchema | IUserProviderSchema;

export const synchPendings = async () => {
  const syncQueueRepo = new SyncQueueRepo();

  const pendings = await syncQueueRepo.getSyncDatas({
    operation: 'CREATE',
    syncStatus: 'PENDING',
  });

  await insertSyncToSupabase(pendings);
};

const upsertToSupabase = async (key: string, datas: {key: string; values: IAllSchema[]}[]) => {
  const selectedData = datas.find(e => e.key === key);

  if (!selectedData) return;

  return await supabase.from(key).upsert(selectedData?.values).select();
};

const insertSyncToSupabase = async (datas: {key: string; values: IAllSchema[]}[]) => {
  const results = await Promise.all([
    await upsertToSupabase('user', datas),
    await upsertToSupabase('user_provider', datas),
    await upsertToSupabase('budget', datas),
    await upsertToSupabase('expense', datas),
    await upsertToSupabase('expense_provider', datas),
  ]);

  const error = results.filter(e => e !== undefined).find(result => result.error)?.error;

  if (error) {
    throw error;
  }

  return results;
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
