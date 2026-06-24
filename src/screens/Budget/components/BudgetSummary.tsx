import {formatDate, NumberFormatter} from '@/helpers';
import {PropsWithChildren, useCallback, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import * as Icons from 'lucide-react-native';
import {budgetRepo} from '@/db/repositories';

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

const BudgetSummary: React.FC = () => {
  const [budgets, setBudgets] = useState<IBudget[]>([]);

  const fetchBudgets = useCallback(async () => {
    const savedBudgets = await budgetRepo.findActivesEachType();
    console.log('budgets', savedBudgets);
    setBudgets(
      savedBudgets.map(budget => ({
        amount: budget.amount,
        dateRange: {
          startDate: new Date(budget.startDate),
          endDate: new Date(budget.endDate),
        },
        enableNotify: budget.enableNotify,
        icon: budget?.icon ?? '',
        iconColor: budget?.iconColor ?? '',
        title: budget.title,
        type: budget.type as BudgetType,
      })),
    );
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

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
