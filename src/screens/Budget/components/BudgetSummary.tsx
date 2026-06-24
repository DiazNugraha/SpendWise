import {formatDate} from '@/helpers';
import {Calendar, LucideIcon, Target} from 'lucide-react-native';
import {PropsWithChildren} from 'react';
import {Text, View} from 'react-native';

const BudgetSummary: React.FC = () => {
  const savedBudgets: {name: string; startDate: Date; endDate: Date; amount: number; icon: LucideIcon}[] = [
    {
      name: 'monthly',
      startDate: new Date(),
      endDate: new Date(),
      amount: 3000,
      icon: Calendar,
    },
    {
      name: 'weekly',
      startDate: new Date(),
      endDate: new Date(),
      amount: 1000,
      icon: Target,
    },
    {
      name: 'custom',
      startDate: new Date(),
      endDate: new Date(),
      amount: 3900,
      icon: Target,
    },
  ];

  return (
    <View className="flex flex-col gap-3">
      <Text>Budget Summary</Text>
      <View className="flex flex-col gap-2">
        {savedBudgets.map(e => {
          const Icon = e.icon;
          return (
            <ItemWrapper key={e.name}>
              <View className="flex flex-row gap-2 items-center">
                <Icon color={'#6D28D9'} />
                <View className="flex flex-col gap-2">
                  <Text className="capitalize font-medium text-sm">{e.name}</Text>
                  <Text className="text-[10px]">
                    {formatDate(e.startDate)} - {formatDate(e.endDate)}
                  </Text>
                </View>
              </View>
              <Text className="text-[#6D28D9] font-medium">{e.amount}</Text>
            </ItemWrapper>
          );
        })}
      </View>
    </View>
  );
};

const ItemWrapper: React.FC<PropsWithChildren> = ({children}) => {
  return <View className="rounded-xl flex flex-row justify-between items-center flex-1 p-3 bg-white">{children}</View>;
};

export default BudgetSummary;
