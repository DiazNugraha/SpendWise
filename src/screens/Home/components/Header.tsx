import {JSX, PropsWithChildren} from 'react';
import {Text, View} from 'react-native';

const Header: React.FC = () => {
  const Card: React.FC<PropsWithChildren> = ({children}) => {
    return (
      <View className="w-1/2 p-2 shadow-md">
        <View className="bg-purple-500 p-4 shadow rounded-xl">{children}</View>
      </View>
    );
  };

  const CardContent: React.FC<{
    title: string;
    usedAmount: number;
    totalAmount: number;
    icon?: JSX.Element;
  }> = ({title, usedAmount, totalAmount, icon}) => {
    return (
      <View className="flex flex-row gap-2">
        <View className="flex flex-col gap-3">
          <Text className="font-bold text-lg text-white">{title}</Text>
          <View className="flex flex-col gap-1">
            <Text className="font-medium text-sm text-white">Spend Amount</Text>
            <Text className="font-medium text-xs text-white">{usedAmount}</Text>
          </View>
          <View className="flex flex-col gap-1">
            <Text className="font-medium text-sm text-white">Spend Limit</Text>
            <Text className="font-medium text-xs text-white">{totalAmount}</Text>
          </View>
        </View>
        {icon}
      </View>
    );
  };

  return (
    <View className="bg-white flex flex-col rounded-2xl p-3 gap-5">
      <View className="flex flex-row">
        <View className="flex flex-col gap-2">
          <Text className="font-medium">Good morning, User 👋</Text>
          <Text className="font-medium">Let’s stay within your budget today</Text>
        </View>
      </View>
      <View className="flex flex-row flex-wrap justify-between">
        <Card>
          <CardContent title="Weekly" usedAmount={20} totalAmount={30} />
        </Card>
        <Card>
          <CardContent title="Monthly" usedAmount={20} totalAmount={300} />
        </Card>
      </View>
    </View>
  );
};

export default Header;
