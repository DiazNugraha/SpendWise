import {SyncQueueRepo} from '@/db/repositories';
import {supabase} from '@/lib';

type IAllSchema = IBudgetSchema | IExpenseSchema | IExpenseProviderSchema | IUserSchema | IUserProviderSchema;

export const syncPendingData = async (userId: string) => {
  const syncQueueRepo = new SyncQueueRepo(userId);

  const pendings = await syncQueueRepo.getSyncDatas({
    operation: 'CREATE',
    syncStatus: 'PENDING',
  });

  await insertSyncToSupabase(pendings);
};

const MAX_RETRIES = 5;

const upsertToSupabase = async (key: string, datas: {key: string; values: IAllSchema[]}[]) => {
  const syncQueueRepo = new SyncQueueRepo();

  const selectedData = datas.find(e => e.key === key);

  if (!selectedData || selectedData.values.length === 0) return;

  const entityIds = selectedData.values.map(e => e.id);
  const entityType = key.toUpperCase();

  try {
    const {error} = await supabase.from(key).upsert(selectedData?.values).select();

    if (error) throw error;

    return await syncQueueRepo.updateBatch({
      operation: 'CREATE',
      syncStatus: 'SYNCED',
      entityType,
      retryCount: 0,
      entityIds,
    });
  } catch (error) {
    const item = await syncQueueRepo.getOneByEntityId(entityIds[0]);

    const retryCount = item.retryCount + 1;

    await syncQueueRepo.updateBatch({
      operation: 'CREATE',
      syncStatus: retryCount >= MAX_RETRIES ? 'FAILED' : 'PENDING',
      retryCount,
      entityType,
      lastError: error instanceof Error ? error.message : String(error),
      entityIds,
    });
  }
};

const insertSyncToSupabase = async (datas: {key: string; values: IAllSchema[]}[]) => {
  await Promise.all([
    await upsertToSupabase('user', datas),
    await upsertToSupabase('user_provider', datas),
    await upsertToSupabase('budget', datas),
    await upsertToSupabase('expense', datas),
    await upsertToSupabase('expense_provider', datas),
  ]);
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
