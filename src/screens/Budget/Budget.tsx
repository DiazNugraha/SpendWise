import {Pressable, ScrollView, Text, View} from 'react-native';
import {ModalWrapper} from '@/components';
import BudgetTypeSelector from './components/BudgetTypeSelector';
import BudgetSummary from './components/BudgetSummary';
import {useMemo, useState} from 'react';
import {NumberFormatter} from '@/helpers';
import {ActivityIcon, ChevronRight} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProp} from '@/types';

type IOption<T extends string | number> = {
  label: string;
  value: T;
  amount: number;
};

const budgetTypeOptions: IOption<string>[] = [
  {label: 'Weekly', value: 'weekly', amount: 1000},
  {label: 'Monthly', value: 'monthly', amount: 3000},
  {label: 'Custom', value: 'custom', amount: 3400},
];

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

export const Budget: React.FC = () => {
  const [type, setType] = useState<string>();

  const getBudgetInfo = useMemo(() => {
    return budgetTypeOptions.find(e => e.value === type);
  }, [type]);

  const navigation = useNavigation<RootNavigationProp>();

  return (
    <ModalWrapper title="Add Budget">
      <ScrollView contentContainerClassName="gap-5 px-4">
        <BudgetTypeSelector
          onChange={value => {
            setType(value.label);
          }}
        />
        {!!type && (
          <View className="w-full flex flex-col justify-center items-center px-5 gap-3">
            <Text>Your Current Target</Text>
            {getBudgetInfo?.amount ? (
              <Text className="text-[30px] font-bold">{formatter.format(getBudgetInfo.amount)}</Text>
            ) : (
              <Text className="text-[30px] font-bold">Not Set Yet</Text>
            )}
            <Text className="capitalize">{getBudgetInfo?.label} spending limit</Text>
          </View>
        )}
        <BudgetSummary />

        {!!type && (
          <Pressable
            className="rounded-xl flex flex-row flex-1 p-3 justify-between items-center border border-[#6D28D9]/20 bg-purple-100/20"
            onPress={() =>
              navigation.navigate('BudgetForm', {
                budgetType: type,
              })
            }>
            <View className="flex flex-row gap-2 items-center">
              <ActivityIcon color={'#6D28D9'} />
              <View className="flex flex-col gap-2">
                <Text className="font-medium">Set Saving Goals</Text>
                <Text className="font-light text-[10px]">Save the difference</Text>
              </View>
            </View>
            <ChevronRight color={'#6D28D9'} />
          </Pressable>
        )}
      </ScrollView>
    </ModalWrapper>
  );
};
