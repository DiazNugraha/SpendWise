import {db} from '@/db/client';
import {SyncQueueRepo, UserRepo} from '@/db/repositories';
import {users} from '@/db/schema';
import {supabase} from '@/lib';
import {PostgrestSingleResponse} from '@supabase/supabase-js';
import {eq} from 'drizzle-orm';
import {SyncLoadSavedData} from './sync-load-saved-data.service';
import {SyncUploadPendingData} from './sync-upload-pending-data.service';
import {DevSettings} from 'react-native';
import {SyncLoadMergeData} from './sync-load-merge-data.service';

export class SyncService {
  constructor(
    private readonly syncQueueRepo: SyncQueueRepo,
    private readonly userRepo: UserRepo,
    private readonly userId: string,
  ) {}

  async sync() {
    const userId = this.userId;
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return;

    const existingUserResponse: PostgrestSingleResponse<IUserSchema[]> = await supabase
      .from('user')
      .select()
      .eq('id', user.id);

    const existingUser = existingUserResponse.data ? existingUserResponse.data[0] : undefined;

    if (existingUser && !user.initialSyncCompleted) {
      const syncLoadSavedData = new SyncLoadSavedData(userId);

      await syncLoadSavedData.load(existingUser);

      // Mark completed only after loading succeeds.
      await this.userRepo.completeInitialSync();
      DevSettings.reload();

      return;
    }

    const syncUploadPendingData = new SyncUploadPendingData(this.syncQueueRepo, userId);
    return await syncUploadPendingData.sync();
  }

  async merge(suapabaseUserId: string): Promise<IUserSchema | undefined> {
    const userId = this.userId;
    if (!userId) return;

    const syncLoadMergeDataService = new SyncLoadMergeData(userId);

    return await syncLoadMergeDataService.merge(suapabaseUserId);
  }
}
