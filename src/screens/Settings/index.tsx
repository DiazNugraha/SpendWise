import {RootNavigationProp} from '@/types';
import {useNavigation} from '@react-navigation/native';
import {ChevronRight, CircleUser, LucideIcon, WalletCardsIcon} from 'lucide-react-native';
import {Pressable, ScrollView, Text, View} from 'react-native';

interface ISettingRoute {
  label: string;
  icon: LucideIcon;
  route: string;
}

const settingRoutes: ISettingRoute[] = [
  {
    label: 'Wallet',
    icon: WalletCardsIcon,
    route: 'WalletSettings',
  },
  {
    label: 'Account',
    icon: CircleUser,
    route: 'AccountSettings',
  },
];

export const Settings: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();

  return (
    <ScrollView className="bg-gray-100 flex-1 flex flex-col p-4">
      <View className="flex-1 justify-center mb-3">
        <Text className="font-medium text-xl text-center">Preferences</Text>
      </View>
      <View className="flex flex-col gap-2">
        {settingRoutes.map(setting => (
          <Item item={setting} navigation={navigation} key={setting.route} />
        ))}
      </View>
    </ScrollView>
  );
};

interface IItemProps {
  item: ISettingRoute;
  navigation: RootNavigationProp;
}

const Item: React.FC<IItemProps> = ({item, navigation}) => {
  const {icon, label, route} = item;
  const Icon = icon;
  return (
    <Pressable
      className="flex flex-row px-3 py-5 justify-between items-center bg-white rounded-xl"
      onPress={() => navigation.navigate(route)}>
      <View className="flex flex-row gap-2 items-center">
        <Icon color={'black'} />
        <Text className="font-medium text-base">{label}</Text>
      </View>
      <ChevronRight color={'black'} size={24} />
    </Pressable>
  );
};
