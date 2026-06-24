import {BudgetCard} from '@/components';
import {PropsWithChildren} from 'react';
import {Text, View} from 'react-native';

const CardWrapper: React.FC<PropsWithChildren> = ({children}) => {
  return <View className="w-1/2 p-2">{children}</View>;
};

const Header: React.FC = () => {
  return (
    <View className="flex flex-col rounded-2xl p-3 gap-5">
      <View className="flex flex-row">
        <View className="flex flex-col gap-2">
          <Text className="font-medium">Good morning, User 👋</Text>
          <Text className="font-medium">Let’s stay within your budget today</Text>
        </View>
      </View>
      <View className="flex flex-row flex-wrap justify-between">
        <CardWrapper>
          <BudgetCard spent={200} limit={1000} title="Weekly Budget" />
        </CardWrapper>
        <CardWrapper>
          <BudgetCard spent={200} limit={3000} title="Monthly Budget" />
        </CardWrapper>
      </View>
    </View>
  );
};

export default Header;
