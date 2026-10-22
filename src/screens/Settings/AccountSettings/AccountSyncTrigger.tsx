import {extractUserFromCallbackUrl} from '@/helpers';
import {useProfile, useSyncQueueRepo, useUserRepo} from '@/hooks';
import {supabase} from '@/lib';
import {SyncService} from '@/services';
import {RootNavigationProp} from '@/types';
import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect} from 'react';
import {Alert, Image, Linking, Pressable, Text} from 'react-native';
import Toast from 'react-native-toast-message';

const AccountSyncTrigger: React.FC = () => {
  const {user, onRefetch: refetchUserProfile} = useProfile();

  const syncQueueRepo = useSyncQueueRepo();
  const userRepo = useUserRepo();

  const navigation = useNavigation<RootNavigationProp>();

  const handleGoogleSignIn = async () => {
    const redirectTo = 'spendwise://login-callback';

    const {data, error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'An unknown error occurred');
      return;
    }

    if (data.url) {
      await Linking.openURL(data.url);
    }
  };

  const handleProceedGoogleCallbackUrl = useCallback(
    async (callbackUrl: string) => {
      if (!user?.id) return;
      const extractedUserSession = await extractUserFromCallbackUrl(callbackUrl);
      const userSession = extractedUserSession.session.user;

      if (userSession && user?.id && extractedUserSession.supabaseUserId) {
        const syncService = new SyncService(syncQueueRepo, userRepo, user.id);
        const mergedUserData = await syncService.merge(extractedUserSession.supabaseUserId);

        if (mergedUserData && mergedUserData.email) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: `${mergedUserData.email} successfully synced.`,
          });

          refetchUserProfile(mergedUserData.email);
          return navigation.navigate('MainTabs');
        }

        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to sync user. Please try again.',
        });
      }
    },
    [navigation, refetchUserProfile, userRepo, syncQueueRepo, user],
  );

  // retrieve callback from google sign in
  useEffect(() => {
    const sub = Linking.addEventListener('url', async ({url: callbackUrl}) => {
      handleProceedGoogleCallbackUrl(callbackUrl);
    });

    return () => sub.remove();
  }, [handleProceedGoogleCallbackUrl]);

  return (
    <Pressable
      className="py-5 px-6 rounded-2xl flex flex-row items-center justify-center shadow shadow-slate-500 gap-2 main-button-container mt-4"
      onPress={handleGoogleSignIn}>
      <Image source={require('../../../../assets/icons/common/google.png')} style={{width: 30, height: 30}} />
      <Text className="font-medium text-white text-center">Sync with Google account</Text>
    </Pressable>
  );
};

export default AccountSyncTrigger;
