import {SyncQueueRepo, UserRepo} from '@/db/repositories';
import {getCurrencySymbol} from '@/helpers';
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
  onRefetch: (email?: string) => void;
  primaryCurrencySymbol: string;
  isLoading: boolean;
}

const ProfileContext = createContext<IProfileContext | null>(null);

const ProfileProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [primaryCurrencySymbol, setPrimaryCurrencySymbol] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUserProfile = useCallback(async (email?: string) => {
    const syncQueueRepo = new SyncQueueRepo();

    setIsLoading(true);

    const userRepo = new UserRepo(syncQueueRepo);

    let existingUser = null;
    if (email) {
      existingUser = await userRepo.getUserByEmail(email);
    } else {
      existingUser = (await userRepo.getUser())[0];
    }

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
        onRefetch: async email => fetchUserProfile(email),
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
