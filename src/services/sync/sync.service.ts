import {db} from '@/db/client';
import {SyncQueueRepo} from '@/db/repositories';
import {users} from '@/db/schema';
import {supabase} from '@/lib';
import {PostgrestSingleResponse} from '@supabase/supabase-js';
import {eq} from 'drizzle-orm';
import {SyncLoadSavedData} from './sync-load-saved-data.service';
import {SyncUploadPendingData} from './sync-upload-pending-data.service';

export class SyncService {
  constructor(private readonly syncQueueRepo: SyncQueueRepo, private readonly userId: string) {}

  async sync() {
    const userId = this.userId;
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return;

    const existingUserResponse: PostgrestSingleResponse<IUserSchema[]> = await supabase
      .from('user')
      .select()
      .eq('email', user.email);

    const existingUser = existingUserResponse.data ? existingUserResponse.data[0] : undefined;

    if (existingUser && user.id !== existingUser.id) {
      const syncLoadSavedData = new SyncLoadSavedData(userId);
      return await syncLoadSavedData.load(existingUser);
    }

    const syncUploadPendingData = new SyncUploadPendingData(this.syncQueueRepo, userId);
    return await syncUploadPendingData.sync();
  }
}
