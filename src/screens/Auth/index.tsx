import {useProfile, useUserRepo} from '@/hooks';
import {CircleUserRoundIcon} from 'lucide-react-native';
import React, {useCallback, useEffect} from 'react';
import {Alert, Image, Linking, Pressable, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {supabase} from '@/lib';
import 'react-native-url-polyfill/auto';
import {extractUserFromCallbackUrl} from '@/helpers';

export const AuthScreen: React.FC = () => {
  const {onRefetch: refetchUserProfile} = useProfile();
  const userRepo = useUserRepo();

  const handleGuestSignIn = async () => {
    const user = await userRepo.createGuestUser();

    if (user) {
      Toast.show({
        type: 'success',
        text1: 'Guest account created',
        text2: 'You can start tracking your expenses now.',
      });

      refetchUserProfile();
      return;
    }

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Failed to create guest user. Please try again.',
    });
  };

  const handleGooglSignIn = async () => {
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

  // google sign in callback url handler
  const handleProceedGoogleCallbackUrl = useCallback(
    async (callbackUrl: string) => {
      const extractedUserSession = await extractUserFromCallbackUrl(callbackUrl);
      const userSession = extractedUserSession.session.user;

      if (userSession) {
        const fullName: string = userSession.user_metadata.full_name ?? '';
        const firstName = fullName.split(' ')[0];
        const lastName = fullName.split(' ')?.[1] ?? undefined;
        const email = userSession.user_metadata.email;

        const newUser = await userRepo.createUser({
          id: extractedUserSession.supabaseUserId,
          email,
          firstName,
          lastName,
          avatarUrl: userSession.user_metadata.avatar_url,
        });

        if (newUser) {
          Toast.show({
            type: 'success',
            text1: 'Sign-in successful',
            text2: 'Your account is ready.',
          });

          refetchUserProfile();
          return;
        }

        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to create user. Please try again.',
        });
      }
    },
    [refetchUserProfile, userRepo],
  );

  // retrieve callback from google sign in
  useEffect(() => {
    const sub = Linking.addEventListener('url', async ({url: callbackUrl}) => {
      handleProceedGoogleCallbackUrl(callbackUrl);
    });

    return () => sub.remove();
  }, [handleProceedGoogleCallbackUrl]);

  return (
    <View className="flex flex-col h-full  px-5 justify-evenly">
      {/* Top left */}
      <View className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-purple-500/20" />

      {/* Bottom right */}
      <View className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-purple-500/10" />

      <View className="flex flex-col gap-1 items-center">
        <View className="flex flex-row">
          <Text className="text-[50px] font-bold">Spend</Text>
          <Text className="text-[50px] font-bold text-purple-600">Wise</Text>
        </View>
        <Text className="text-base font-medium text-center">Plan Smarter. Spend Better. Reach your goals.</Text>
      </View>

      <View className="flex flex-col gap-3">
        <Pressable
          className="py-5 px-6 rounded-2xl flex flex-row items-center justify-center shadow shadow-slate-500 gap-2 main-button-container"
          onPress={handleGooglSignIn}>
          <Image source={require('../../../assets/icons/common/google.png')} style={{width: 30, height: 30}} />
          <Text className="font-medium text-white text-center">Sign In with Google</Text>
        </Pressable>

        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500 text-sm font-medium">OR</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        <Pressable
          className="py-5 px-6 rounded-2xl bg-white flex flex-row items-center justify-center shadow shadow-slate-500 gap-2"
          onPress={handleGuestSignIn}>
          <CircleUserRoundIcon size={24} />
          <Text className="text-black font-medium text-center">Sign In as Guest</Text>
        </Pressable>
      </View>
    </View>
  );
};
