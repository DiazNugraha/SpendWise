import {Pressable, ScrollView, Text, View} from 'react-native';
import {ModalWrapper} from '@/components';
import BudgetTypeSelector from './components/BudgetTypeSelector';
import BudgetSummary from './components/BudgetSummary';
import {useCallback, useState} from 'react';
import {NumberFormatter} from '@/helpers';
import {ActivityIcon, ChevronRight} from 'lucide-react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {RootNavigationProp} from '@/types';
import {budgetRepo} from '@/db/repositories';

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

export const Budget: React.FC = () => {
  const [type, setType] = useState<string>();
  const [selectedBudget, setSelectedBudget] = useState<{amount: number; title: string}>();

  const fetchSelectedBudget = useCallback(async () => {
    if (!type) return undefined;

    const findBudget = await budgetRepo.findActiveByType(type as BudgetType);
    if (findBudget.length < 1) return setSelectedBudget(undefined);
    setSelectedBudget({
      amount: findBudget[0].amount,
      title: findBudget[0].title,
    });
  }, [type]);

  useFocusEffect(
    useCallback(() => {
      fetchSelectedBudget();
    }, [fetchSelectedBudget]),
  );

  const navigation = useNavigation<RootNavigationProp>();

  return (
    <ModalWrapper title="Add Budget">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 20,
          flexGrow: 1,
        }}
        className="flex flex-col">
        <BudgetTypeSelector
          onChange={value => {
            setType(value.label);
          }}
        />
        {!!type && (
          <View className="w-full flex flex-col justify-center items-center px-5 gap-3">
            <Text>Your Current Target</Text>
            {selectedBudget ? (
              <Text className="text-[30px] font-bold">{formatter.format(selectedBudget.amount)}</Text>
            ) : (
              <Text className="text-[30px] font-bold">Not Set Yet</Text>
            )}
            <Text className="capitalize">{type} spending limit</Text>
          </View>
        )}

        <BudgetSummary />

        {!!type && (
          <Pressable
            className="rounded-xl flex flex-row  p-3 justify-between items-center border border-[#6D28D9]/20 bg-purple-100/20"
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
