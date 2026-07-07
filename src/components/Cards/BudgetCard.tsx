import {budgetRepo, expenseRepo} from '@/db/repositories';
import {getDaysLeft, NumberFormatter} from '@/helpers';
import {useProfile} from '@/hooks';
import {RootNavigationProp} from '@/types';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Calendar, CircleQuestionMark} from 'lucide-react-native';
import {useCallback, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  budgetType: BudgetType;
};

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

export const BudgetCard: React.FC<Props> = ({budgetType}) => {
  const [selectedBudget, setSelectedBudget] = useState<
    | {
        title: string;
        limit: number;
        progress: number;
        daysLeft: number;
      }
    | undefined
  >(undefined);

  const [spent, setSpent] = useState<number>(0);

  const fetchSpend = async (startDate: number, endDate: number) => {
    const expenseTotal = await expenseRepo.sumExpensesWithinDate(startDate, endDate);
    setSpent(expenseTotal);
    return expenseTotal;
  };

  const fetchBudget = useCallback(async () => {
    const findBudget = await budgetRepo.findActiveByType(budgetType);

    if (findBudget.length < 1) {
      setSelectedBudget(undefined);
      return;
    }

    const find = findBudget[0];
    const limit = find?.amount ?? 0;

    const expenseTotal = await fetchSpend(find.startDate, find.endDate);

    const progress = limit > 0 ? (expenseTotal / limit) * 100 : 0;

    const daysLeft = getDaysLeft(find?.endDate ? new Date(find.endDate) : new Date());

    setSelectedBudget({
      title: find?.title ?? '',
      limit,
      progress,
      daysLeft,
    });
  }, [budgetType]);

  useFocusEffect(
    useCallback(() => {
      fetchBudget();
    }, [fetchBudget]),
  );

  return (
    <LinearGradient
      colors={['#8B5CF6', '#6D28D9']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      className="w-full rounded-2xl p-4 overflow-hidden">
      {/* Decorative highlight */}
      <View className="absolute -top-2 -right-2 w-[40px] h-[40px] rounded-full bg-white/20" />

      {selectedBudget ? (
        <FoundSavedBudget budget={selectedBudget} spent={spent} />
      ) : (
        <NotFoundSavedBudget type={budgetType} />
      )}
    </LinearGradient>
  );
};

type FoundSavedBudgetProps = {
  budget: {
    title: string;
    limit: number;
    progress: number;
    daysLeft: number;
  };
  spent: number;
};

const FoundSavedBudget = ({budget, spent}: FoundSavedBudgetProps) => {
  const {title, limit, progress, daysLeft} = budget;
  const {primaryCurrencySymbol} = useProfile();

  return (
    <>
      <Text className="text-violet-100 text-sm mb-2">{title}</Text>

      <View className="flex-row items-end">
        <Text className="text-white text-3xl font-bold">
          {primaryCurrencySymbol} {formatter.format(spent)}
        </Text>
        <Text className="text-violet-200 text-base mb-1">
          / {primaryCurrencySymbol} {formatter.format(limit)}
        </Text>
      </View>

      {/* Progress bar */}
      <View className="mt-4 h-1.5 rounded-full bg-white/30">
        <View className="h-1.5 rounded-full bg-white" style={{width: `${spent > limit ? 100 : progress}%`}} />
      </View>
      <View className="flex flex-row justify-between mt-5">
        <Text className="text-white text-xs">
          Remaining: {primaryCurrencySymbol} {formatter.format(limit - spent >= 0 ? limit - spent : 0)}
        </Text>
        <View className="bg-white/20 rounded-2xl px-2 py-1">
          <Text className="text-[10px] text-white ">{daysLeft} days left</Text>
        </View>
      </View>
    </>
  );
};

type NotFoundSavedBudgetProps = {
  type: BudgetType;
};

const NotFoundSavedBudget = ({type}: NotFoundSavedBudgetProps) => {
  const navigation = useNavigation<RootNavigationProp>();

  return (
    <View className="flex flex-col gap-5 px-4 py-5 justify-center items-center">
      <View className="flex flex-row items-center justify-center p-5 rounded-full bg-violet-400/30 relative">
        <Calendar size={48} color={'#FFFFFF'} />
        <View className="flex flex-row items-center justify-center p-2 rounded-full bg-violet-400/35 absolute -bottom-0.5 -right-1.5">
          <CircleQuestionMark color={'white'} size={16} />
        </View>
      </View>
      <Text className="text-white text-lg capitalize font-medium">No {type} budget Set</Text>
      <Text className="text-white/50 text-sm text-center">
        Create personalized budget period to track your spending goals with flexibility
      </Text>

      <Pressable
        className="flex flex-row justify-start items-center px-7 py-3 rounded-3xl bg-white"
        onPress={() =>
          navigation.navigate('BudgetForm', {
            budgetType: type,
          })
        }>
        <Text className="text-violet-700 text-sm font-medium capitalize">Create {type} Budget</Text>
      </Pressable>
    </View>
  );
};
