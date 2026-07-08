import {ScrollView, Text, View} from 'react-native';
import {AccountForm} from './Form';

export const AccountSettings: React.FC = () => {
  return (
    <ScrollView className="flex flex-col gap-5 flex-1 p-4">
      <View className="flex-1 justify-center mb-3">
        <Text className="font-medium text-xl text-center">Account Preferences</Text>
      </View>
      <View className="flex flex-col gap-3">
        <AccountForm />
      </View>
    </ScrollView>
  );
};
