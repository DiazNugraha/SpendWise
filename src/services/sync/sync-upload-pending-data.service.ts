import {SyncQueueRepo} from '@/db/repositories';
import {supabase} from '@/lib';

export class SyncUploadPendingData {
  constructor(private readonly syncQueueRepo: SyncQueueRepo, private readonly userId: string) {}

  private readonly MAX_RETRIES = 5;

  async sync() {
    const createdPendingItems = await this.syncQueueRepo.getSyncDatas({
      operation: 'CREATE',
      syncStatus: 'PENDING',
    });

    const deletedPendingItems = await this.syncQueueRepo.getSyncDatas({
      operation: 'DELETE',
      syncStatus: 'PENDING',
    });

    const updatedPendingItems = await this.syncQueueRepo.getSyncDatas({
      operation: 'UPDATE',
      syncStatus: 'PENDING',
    });

    // insert pendings
    await this.upsertSyncToSupabase(createdPendingItems, 'CREATE');

    // update pendings
    await this.upsertSyncToSupabase(updatedPendingItems, 'UPDATE');

    // delete pendings
    await this.deleteSyncToSupabase(deletedPendingItems);
  }

  private async upsertSyncToSupabase(datas: {key: string; values: (IAllSchema | string)[]}[], operation: string) {
    await Promise.all([
      await this.upsertToSupabase('user', datas, operation),
      await this.upsertToSupabase('user_provider', datas, operation),
      await this.upsertToSupabase('budget', datas, operation),
      await this.upsertToSupabase('expense', datas, operation),
      await this.upsertToSupabase('expense_provider', datas, operation),
    ]);
  }

  private async deleteSyncToSupabase(datas: {key: string; values: (IAllSchema | string)[]}[]) {
    await Promise.all([
      await this.deleteToSupabase('expense_provider', datas),
      await this.deleteToSupabase('user_provider', datas),
      await this.deleteToSupabase('expense', datas),
      await this.deleteToSupabase('budget', datas),
      await this.deleteToSupabase('user', datas),
    ]);
  }

  private async upsertToSupabase(
    key: string,
    datas: {key: string; values: (IAllSchema | string)[]}[],
    operation: string,
  ) {
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

      return await this.syncQueueRepo.updateBatch({
        operation: operation,
        syncStatus: 'SYNCED',
        entityType,
        retryCount: 0,
        entityIds,
      });
    } catch (error) {
      const item = await this.syncQueueRepo.getOneByEntityId(entityIds[0]);

      const retryCount = item.retryCount + 1;

      await this.syncQueueRepo.updateBatch({
        operation: operation,
        syncStatus: retryCount >= this.MAX_RETRIES ? 'FAILED' : 'PENDING',
        retryCount,
        entityType,
        lastError: error instanceof Error ? error.message : String(error),
        entityIds,
      });
    }
  }

  private async deleteToSupabase(key: string, datas: {key: string; values: (IAllSchema | string)[]}[]) {
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

      return await this.syncQueueRepo.updateBatch({
        operation: 'DELETE',
        syncStatus: 'SYNCED',
        entityType,
        retryCount: 0,
        entityIds,
      });
    } catch (error) {
      const item = await this.syncQueueRepo.getOneByEntityId(entityIds[0]);

      const retryCount = item.retryCount + 1;

      await this.syncQueueRepo.updateBatch({
        operation: 'DELETE',
        syncStatus: retryCount >= this.MAX_RETRIES ? 'FAILED' : 'PENDING',
        retryCount,
        entityType,
        lastError: error instanceof Error ? error.message : String(error),
        entityIds,
      });
    }
  }
}
