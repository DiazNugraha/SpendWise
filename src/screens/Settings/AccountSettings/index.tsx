import {ScrollView, Text, View} from 'react-native';
import {AccountForm} from './Form';
import AccountSyncTrigger from './AccountSyncTrigger';
import {useProfile} from '@/hooks';

export const AccountSettings: React.FC = () => {
  const {user} = useProfile();

  return (
    <ScrollView className="flex flex-col gap-5 flex-1 p-4">
      <View className="flex-1 justify-center mb-3">
        <Text className="font-medium text-xl text-center">Account Preferences</Text>
      </View>
      <View className="flex flex-col gap-3">
        <AccountForm />
        {user?.isGuest && <AccountSyncTrigger />}
      </View>
    </ScrollView>
  );
};
