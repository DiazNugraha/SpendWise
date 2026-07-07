import {userRepo} from '@/db/repositories';
import {getCurrencySymbol} from '@/helpers';
import {useFocusEffect} from '@react-navigation/native';
import {createContext, PropsWithChildren, useCallback, useContext, useState} from 'react';

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  primaryCurrencyCode?: string;
}

export interface IProfileContext {
  user: IUser | null;
  onRefetch: () => void;
  primaryCurrencySymbol: string;
}

const ProfileContext = createContext<IProfileContext | null>(null);

const ProfileProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [primaryCurrencySymbol, setPrimaryCurrencySymbol] = useState<string>('');

  const fetchUserProfile = useCallback(async () => {
    const existingUser = (await userRepo.getUser())[0];
    const primaryCurrencyCode = existingUser.primaryCurrencyCode;

    if (existingUser) {
      setUser({
        id: existingUser.id,
        firstName: existingUser.firstName,
        lastName: existingUser?.lastName ?? '',
        email: existingUser.email,
        primaryCurrencyCode: primaryCurrencyCode ?? undefined,
      });

      if (primaryCurrencyCode) {
        const symbol = getCurrencySymbol(primaryCurrencyCode);
        setPrimaryCurrencySymbol(symbol ?? '');
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile]),
  );

  return (
    <ProfileContext.Provider
      value={{
        user,
        onRefetch: async () => fetchUserProfile(),
        primaryCurrencySymbol,
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
