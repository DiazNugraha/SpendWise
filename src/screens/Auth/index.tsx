import {useProfile, useUserRepo} from '@/hooks';
import {RootNavigationProp} from '@/types';
import {useNavigation} from '@react-navigation/native';
import {CircleUserRoundIcon} from 'lucide-react-native';
import React from 'react';
import {Pressable, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';

export const AuthScreen: React.FC = () => {
  const {onRefetch: refetchUserProfile} = useProfile();
  const userRepo = useUserRepo();
  const navigation = useNavigation<RootNavigationProp>();

  const handleGuestSignIn = async () => {
    const user = await userRepo.createGuestUser();

    if (user) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Guest user successfully created.',
      });

      refetchUserProfile();

      return navigation.navigate('MainTabs');
    }

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Failed to create guest user. Please try again.',
    });
  };

  return (
    <View className="flex flex-col h-full  px-5 justify-evenly">
      <View className="flex flex-col gap-1 items-center">
        <View className="flex flex-row">
          <Text className="text-[50px] font-bold">Spend</Text>
          <Text className="text-[50px] font-bold text-purple-600">Wise</Text>
        </View>
        <Text className="text-base font-medium text-center">Plan Smarter. Spend Better. Reach your goals.</Text>
      </View>

      <View className="flex flex-col gap-3">
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
