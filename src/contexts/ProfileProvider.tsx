import {SyncQueueRepo, UserRepo} from '@/db/repositories';
import {getCurrencySymbol} from '@/helpers';
import {supabase} from '@/lib';
import {createContext, PropsWithChildren, useCallback, useContext, useEffect, useState} from 'react';

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  primaryCurrencyCode?: string;
  avatarUrl?: string;
  isGuest: boolean;
}

export interface IProfileContext {
  user: IUser | null;
  onRefetch: () => void;
  primaryCurrencySymbol: string;
  isLoading: boolean;
}

const ProfileContext = createContext<IProfileContext | null>(null);

const ProfileProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [primaryCurrencySymbol, setPrimaryCurrencySymbol] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUserProfile = useCallback(async () => {
    const syncQueueRepo = new SyncQueueRepo();

    const {
      data: {session},
    } = await supabase.auth.getSession();

    if (!session?.user) return;

    let userId: string | undefined = session?.user.id;

    const userRepo = new UserRepo(syncQueueRepo, userId);

    if (!userId) {
      const guestUser = await userRepo.getOneGuestUser();
      userId = guestUser ? guestUser.id : undefined;
    }

    if (!userId) return;

    setIsLoading(true);

    const existingUser = await userRepo.getUser();

    if (!existingUser) {
      setIsLoading(false);
      return;
    }

    const primaryCurrencyCode = existingUser?.primaryCurrencyCode;

    if (existingUser) {
      setUser({
        id: existingUser.id,
        firstName: existingUser.firstName,
        lastName: existingUser?.lastName ?? '',
        email: existingUser.email ?? undefined,
        primaryCurrencyCode: primaryCurrencyCode ?? undefined,
        avatarUrl: existingUser.avatarUrl ?? undefined,
        isGuest: existingUser.isGuest ?? true,
      });

      if (primaryCurrencyCode) {
        const symbol = getCurrencySymbol(primaryCurrencyCode);
        setPrimaryCurrencySymbol(symbol ?? '');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return (
    <ProfileContext.Provider
      value={{
        user,
        onRefetch: async () => fetchUserProfile(),
        primaryCurrencySymbol,
        isLoading,
      }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;

export const useProfileProvider = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};
