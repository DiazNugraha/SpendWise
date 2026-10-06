import {SyncQueueRepo} from '@/db/repositories';
import {supabase} from '@/lib';

type IAllSchema = IBudgetSchema | IExpenseSchema | IExpenseProviderSchema | IUserSchema | IUserProviderSchema;

const MAX_RETRIES = 5;

export const syncPendingData = async (userId: string) => {
  const syncQueueRepo = new SyncQueueRepo(userId);

  const createdPendingItems = await syncQueueRepo.getSyncDatas({
    operation: 'CREATE',
    syncStatus: 'PENDING',
  });

  const deletedPendingItems = await syncQueueRepo.getSyncDatas({
    operation: 'DELETE',
    syncStatus: 'PENDING',
  });

  const updatedPendingItems = await syncQueueRepo.getSyncDatas({
    operation: 'UPDATE',
    syncStatus: 'PENDING',
  });

  // insert pendings
  await upsertSyncToSupabase(createdPendingItems, 'CREATE');

  // update pendings
  await upsertSyncToSupabase(updatedPendingItems, 'UPDATE');

  // delete pendings
  await deleteSyncToSupabase(deletedPendingItems);
};

const upsertSyncToSupabase = async (datas: {key: string; values: (IAllSchema | string)[]}[], operation: string) => {
  await Promise.all([
    await upsertToSupabase('user', datas, operation),
    await upsertToSupabase('user_provider', datas, operation),
    await upsertToSupabase('budget', datas, operation),
    await upsertToSupabase('expense', datas, operation),
    await upsertToSupabase('expense_provider', datas, operation),
  ]);
};

const upsertToSupabase = async (
  key: string,
  datas: {key: string; values: (IAllSchema | string)[]}[],
  operation: string,
) => {
  const syncQueueRepo = new SyncQueueRepo();

  const findData = datas.find(e => e.key === key);
  if (
    !findData ||
    findData.values.length === 0 ||
    !Array.isArray(findData.values) ||
    !findData.values.every(value => typeof value === 'object')
  ) {
    return;
  }

  const selectedData = findData as {key: string; values: IAllSchema[]};

  const entityIds = selectedData.values.map(e => e.id);
  const entityType = key.toUpperCase();

  try {
    const {error} = await supabase.from(key).upsert(selectedData?.values).select();

    if (error) throw error;

    return await syncQueueRepo.updateBatch({
      operation: operation,
      syncStatus: 'SYNCED',
      entityType,
      retryCount: 0,
      entityIds,
    });
  } catch (error) {
    const item = await syncQueueRepo.getOneByEntityId(entityIds[0]);

    const retryCount = item.retryCount + 1;

    await syncQueueRepo.updateBatch({
      operation: operation,
      syncStatus: retryCount >= MAX_RETRIES ? 'FAILED' : 'PENDING',
      retryCount,
      entityType,
      lastError: error instanceof Error ? error.message : String(error),
      entityIds,
    });
  }
};

const deleteSyncToSupabase = async (datas: {key: string; values: (IAllSchema | string)[]}[]) => {
  await Promise.all([
    await deleteToSupabase('expense_provider', datas),
    await deleteToSupabase('user_provider', datas),
    await deleteToSupabase('expense', datas),
    await deleteToSupabase('budget', datas),
    await deleteToSupabase('user', datas),
  ]);
};

const deleteToSupabase = async (key: string, datas: {key: string; values: (IAllSchema | string)[]}[]) => {
  const syncQueueRepo = new SyncQueueRepo();

  const findData = datas.find(e => e.key === key);

  if (
    !findData ||
    findData.values.length === 0 ||
    !Array.isArray(findData.values) ||
    !findData.values.every(value => typeof value === 'string')
  ) {
    return;
  }

  const selectedData = findData as {key: string; values: string[]};

  const entityIds = selectedData.values.map(e => e);
  const entityType = key.toUpperCase();

  try {
    const {error} = await supabase.from(key).delete().in('id', entityIds);

    if (error) throw error;

    return await syncQueueRepo.updateBatch({
      operation: 'DELETE',
      syncStatus: 'SYNCED',
      entityType,
      retryCount: 0,
      entityIds,
    });
  } catch (error) {
    const item = await syncQueueRepo.getOneByEntityId(entityIds[0]);

    const retryCount = item.retryCount + 1;

    await syncQueueRepo.updateBatch({
      operation: 'DELETE',
      syncStatus: retryCount >= MAX_RETRIES ? 'FAILED' : 'PENDING',
      retryCount,
      entityType,
      lastError: error instanceof Error ? error.message : String(error),
      entityIds,
    });
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
