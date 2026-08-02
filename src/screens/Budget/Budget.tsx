import {Pressable, ScrollView, Text, View} from 'react-native';
import {ModalWrapper} from '@/components';
import BudgetTypeSelector from './components/BudgetTypeSelector';
import BudgetSummary from './components/BudgetSummary';
import {useCallback, useMemo, useState} from 'react';
import {NumberFormatter} from '@/helpers';
import {ActivityIcon, ChevronRight, TrashIcon} from 'lucide-react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {RootNavigationProp} from '@/types';
import {useAlert, useBudgetRepo, useProfile} from '@/hooks';
import Toast from 'react-native-toast-message';

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

export const Budget: React.FC = () => {
  const {alert} = useAlert();
  const {primaryCurrencySymbol} = useProfile();
  const navigation = useNavigation<RootNavigationProp>();

  const budgetRepo = useBudgetRepo();

  const [type, setType] = useState<string>();
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const selectedBudget = useMemo(() => {
    return budgets.find(e => e.type === type);
  }, [type, budgets]);

  const handleDeleteBudgetGoal = () => {
    alert({
      title: 'Delete Budget Goal',
      description: 'Are you sure you want to delete this budget goal? This action cannot be undone.',
      onConfirm: async () => {
        if (!selectedBudget?.id) return;
        const result = await budgetRepo.deleteBudgetById(selectedBudget.id);
        if (result) {
          Toast.show({
            type: 'success',
            text1: 'Success!',
            text2: 'Budget goal deleted successfully.',
          });

          fetchBudgets();
          return;
        }

        Toast.show({
          type: 'error',
          text1: 'Error!',
          text2: 'Failed to delete Budget Goal. Please try again.',
        });
      },
      onCancel: () => {
        return;
      },
    });
  };

  const fetchBudgets = useCallback(async () => {
    const savedBudgets = await budgetRepo.findActivesEachType();
    setBudgets(
      savedBudgets.map(budget => ({
        id: budget.id,
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
  }, [budgetRepo]);

  useFocusEffect(
    useCallback(() => {
      fetchBudgets();
    }, [fetchBudgets]),
  );

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
              <Text className="text-[30px] font-bold">
                {primaryCurrencySymbol} {formatter.format(selectedBudget.amount)}
              </Text>
            ) : (
              <Text className="text-[30px] font-bold">Not Set Yet</Text>
            )}
            <Text className="capitalize">{type} spending limit</Text>
          </View>
        )}

        {!!type && selectedBudget && (
          <Pressable
            className="rounded-xl flex flex-row  p-3 justify-between items-center border border-[#6D28D9]/20 bg-purple-100/20"
            onPress={() =>
              navigation.navigate('BudgetForm', {
                budgetType: type,
                id: selectedBudget.id,
              })
            }>
            <View className="flex flex-row gap-2 items-center">
              <ActivityIcon color={'#6D28D9'} />
              <View className="flex flex-col gap-2">
                <Text className="font-medium">Edit Saved Budget Goal</Text>
                <Text className="font-light text-[10px]">Change current saved {type} budget goal</Text>
              </View>
            </View>
            <ChevronRight color={'#6D28D9'} />
          </Pressable>
        )}

        {!!type && !selectedBudget && (
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

        {selectedBudget && (
          <Pressable
            className="rounded-xl flex flex-row  p-3 justify-between items-center border border-[#fc0303]/20 bg-red-100/20"
            onPress={() => handleDeleteBudgetGoal()}>
            <View className="flex flex-row gap-2 items-center">
              <TrashIcon color={'#fc0303'} />
              <View className="flex flex-col gap-2">
                <Text className="font-medium">Remove Budget Goal</Text>
                <Text className="font-light text-[10px]">Remove your current {type} saved budget goal</Text>
              </View>
            </View>
            <ChevronRight color={'#fc0303'} />
          </Pressable>
        )}

        <BudgetSummary budgets={budgets} />
      </ScrollView>
    </ModalWrapper>
  );
};
