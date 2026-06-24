import {dummySavedBudgets} from '@/constants';
import {getDaysLeft} from '@/helpers';
import {useMemo} from 'react';
import {Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  budgetType: BudgetType;
};

export const BudgetCard: React.FC<Props> = ({budgetType}) => {
  const spent = 200;
  const savedBudgets = dummySavedBudgets;

  const {title, limit, progress, daysLeft} = useMemo(() => {
    const find = savedBudgets.find(e => e.type === budgetType);
    const limit = find?.amount ?? 0;
    const progress = (spent / limit) * 100;
    const now = new Date();
    const daysLeft = getDaysLeft(find?.dateRange.endDate ?? new Date());

    return {title: find?.title ?? '', limit, progress, daysLeft};
  }, [budgetType, spent]);

  return (
    <LinearGradient
      colors={['#8B5CF6', '#6D28D9']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      className="w-full rounded-2xl p-4 overflow-hidden">
      {/* Decorative highlight */}
      <View className="absolute -top-2 -right-2 w-[40px] h-[40px] rounded-full bg-white/20" />

      <Text className="text-violet-100 text-sm mb-2">{title}</Text>

      <View className="flex-row items-end">
        <Text className="text-white text-3xl font-bold">{spent}</Text>
        <Text className="text-violet-200 text-base mb-1"> / {limit}</Text>
      </View>

      {/* Progress bar */}
      <View className="mt-4 h-1.5 rounded-full bg-white/30">
        <View className="h-1.5 rounded-full bg-white" style={{width: `${progress}%`}} />
      </View>
      <View className="flex flex-row justify-between mt-5">
        <Text className="text-white text-xs">Remaining: {limit - spent >= 0 ? limit - spent : 0}</Text>
        <View className="bg-white/20 rounded-2xl px-2 py-1">
          <Text className="text-[10px] text-white ">{daysLeft} days left</Text>
        </View>
      </View>
    </LinearGradient>
  );
};
