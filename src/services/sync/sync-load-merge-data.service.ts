import {db} from '@/db/client';
import {budgets, expenseProviders, expenses, userProviders, users} from '@/db/schema';
import {supabase} from '@/lib';
import {PostgrestSingleResponse} from '@supabase/supabase-js';
import {eq} from 'drizzle-orm';

export class SyncLoadMergeData {
  constructor(private readonly userId: string) {}

  async merge(suapabaseUserId: string): Promise<IUserSchema | undefined> {
    const existingUserId = this.userId;
    if (!existingUserId) return;

    const now = Date.now();

    const supabaseUserResponse: PostgrestSingleResponse<IUserSchema[]> = await supabase
      .from('user')
      .select()
      .eq('id', suapabaseUserId);

    if (!supabaseUserResponse || !supabaseUserResponse.data || supabaseUserResponse.data.length < 1) return;

    const supabaseUser = supabaseUserResponse.data[0];

    const supabaseUserProviders: PostgrestSingleResponse<IUserProviderSchema[]> = await supabase
      .from('user_provider')
      .select()
      .eq('userId', supabaseUser.id);

    // create new user
    return await db.transaction(async tx => {
      // create new user
      const [newUser] = await tx
        .insert(users)
        .values({
          ...supabaseUser,
          initialSyncCompleted: false,
          isGuest: false,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      // update all related to existing user to new user
      const queries = {
        BUDGET: (targetUserId: string, newUserId: string) =>
          tx.update(budgets).set({userId: newUserId}).where(eq(budgets.userId, targetUserId)).returning(),
        EXPENSE: (targetUserId: string, newUserId: string) =>
          tx.update(expenses).set({userId: newUserId}).where(eq(expenses.userId, targetUserId)).returning(),
      };

      await Promise.all(
        Array.from(Object.entries(queries)).map(async ([_, query]) => {
          await query(existingUserId, newUser.id);
        }),
      );

      // update user providers
      if (supabaseUserProviders && supabaseUserProviders.data && supabaseUserProviders.data.length > 0) {
        // create new user providers
        const newUserProviders = await tx
          .insert(userProviders)
          .values(
            supabaseUserProviders.data?.map(sup => ({
              id: sup.id,
              identifier: sup.identifier,
              description: sup.description,
              userId: sup.userId,
              createdAt: sup.createdAt,
              updatedAt: sup.updatedAt,
            })),
          )
          .returning();

        const existingUserProviders = await tx
          .select()
          .from(userProviders)
          .where(eq(userProviders.userId, existingUserId));

        await Promise.all(
          existingUserProviders.map(async eup => {
            const findDuplicate = newUserProviders.find(e => e.identifier === eup.identifier);

            if (!findDuplicate) return;

            // migrate children
            await tx
              .update(expenseProviders)
              .set({userProviderId: findDuplicate.id})
              .where(eq(expenseProviders.userProviderId, eup.id))
              .returning();

            // delete existingUserprProvider
            await tx.delete(userProviders).where(eq(userProviders.id, eup.id)).returning();
          }),
        );
      }

      // remove unlinked user
      await tx.delete(users).where(eq(users.id, existingUserId)).returning();
      return newUser;
    });
  }
}
