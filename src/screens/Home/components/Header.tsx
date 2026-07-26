import {BudgetCard, SegmentsControlButton} from '@/components';
import {useProfile} from '@/hooks';
import {RootNavigationProp} from '@/types';
import {useNavigation} from '@react-navigation/native';
import {ChevronRightIcon, CloudBackupIcon} from 'lucide-react-native';
import {useState} from 'react';
import {Image, Pressable, Text, View} from 'react-native';

const Header: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<BudgetType>('weekly');
  const {user} = useProfile();
  const navigation = useNavigation<RootNavigationProp>();

  return (
    <View className="flex flex-col rounded-2xl gap-5">
      <View className="flex flex-col gap-2">
        <View className="flex flex-row justify-between">
          <View className="flex flex-col gap-2">
            <Text className="font-medium">
              Good morning, {user?.firstName} {user?.lastName} 👋
            </Text>
            <Text className="font-medium">Let’s stay within your budget today</Text>
          </View>
          {user?.avatarUrl && (
            <Image
              source={{
                uri: user.avatarUrl,
              }}
              className="rounded-full"
              style={{
                height: 24,
                width: 24,
              }}
            />
          )}
        </View>
        {user?.isGuest && (
          <Pressable
            onPress={() => navigation.navigate('AccountSettings')}
            className="flex-row items-center justify-between rounded-2xl bg-purple-50 p-4">
            <View className="flex-row items-center flex-1">
              <CloudBackupIcon className="text-purple-600" />

              <View className="ml-3 flex-1">
                <Text className="font-semibold">Cloud Backup</Text>
                <Text className="text-sm text-gray-500">Sign in to sync your data.</Text>
              </View>
            </View>

            <ChevronRightIcon className="text-gray-400" />
          </Pressable>
        )}
      </View>

      <SegmentsControlButton
        onClick={val => setActiveSegment(val as BudgetType)}
        active={activeSegment}
        segments={[
          {
            value: 'weekly',
            label: 'Weekly',
          },
          {
            value: 'monthly',
            label: 'Monthly',
          },
          {
            value: 'custom',
            label: 'Custom',
          },
        ]}
      />
      <BudgetCard budgetType={activeSegment} />
    </View>
  );
};

export default Header;
