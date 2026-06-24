import {formatDate, NumberFormatter} from '@/helpers';
import {PropsWithChildren} from 'react';
import {Text, View} from 'react-native';
import * as Icons from 'lucide-react-native';

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

interface IBudgetSummaryProps {
  budgets: IBudget[];
}

const BudgetSummary: React.FC<IBudgetSummaryProps> = ({budgets}) => {
  return (
    <View className="flex flex-col gap-3">
      <Text>Budget Summary</Text>
      <View className="flex flex-col gap-2">
        {budgets.map(e => {
          const Icon = Icons[e.icon as keyof typeof Icons] as Icons.LucideIcon;
          return (
            <ItemWrapper key={e.type}>
              <View className="flex flex-row gap-2 items-center">
                {Icon && <Icon color={e.iconColor} />}
                <View className="flex flex-col gap-2">
                  <Text className="capitalize font-medium text-sm">{e.type}</Text>
                  <Text className="text-[10px]">
                    {formatDate(e.dateRange.startDate)} - {formatDate(e.dateRange.endDate)}
                  </Text>
                </View>
              </View>
              <Text className="text-[#6D28D9] font-medium">{formatter.format(e.amount)}</Text>
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
