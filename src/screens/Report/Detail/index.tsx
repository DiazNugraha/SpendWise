import {ModalWrapper} from '@/components';
import {categoryOptions} from '@/constants/options';
import {NumberFormatter, randomColor} from '@/helpers';
import {useBudgetRepo, useProfile} from '@/hooks';
import {RootNavigatorParamList} from '@/types';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';
import {LucideIcon} from 'lucide-react-native';
import {useCallback, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';

type ReportDetailRouteProps = RouteProp<RootNavigatorParamList, 'ReportDetail'>;

type IPieData = {
  value: number;
  color: string;
  text: string;
};

type IBudgetExpenseAnalytic = {
  name: string;
  icon?: LucideIcon;
  total: number;
  spentTimes: number;
};

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

export const ReportDetail: React.FC = () => {
  const route = useRoute<ReportDetailRouteProps>();
  const {id: budgetId} = route.params;

  const budgetRepo = useBudgetRepo();
  const {primaryCurrencySymbol} = useProfile();

  const [analytics, setAnalytics] = useState<IBudgetExpenseAnalytic[]>([]);
  const [chartData, setChartData] = useState<IPieData[]>([]);
  const [budgetAmount, setBudgetAmount] = useState<number>(0);

  const fetchBudgetExpensesAnalytic = useCallback(async () => {
    const foundAnalytics = await budgetRepo.getBudgetExpensesAnalytic(budgetId);
    if (foundAnalytics) {
      setAnalytics(foundAnalytics.categoryCollections);
      setChartData(
        foundAnalytics.categoryCollections.map(cat => ({
          value: cat.total,
          color: randomColor(),
          text: cat.name,
        })),
      );
      setBudgetAmount(foundAnalytics.budgetAmount);
    }
  }, [budgetId, budgetRepo]);

  useFocusEffect(
    useCallback(() => {
      fetchBudgetExpensesAnalytic();
    }, [fetchBudgetExpensesAnalytic]),
  );

  return (
    <ModalWrapper title="Report Detail">
      <ScrollView className="p-4">
        <View className="flex flex-col gap-y-6">
          <View className="flex flex-row gap-1 justify-center items-end">
            <Text className="text-[#6D28D9] font-medium text-lg">
              {primaryCurrencySymbol} {formatter.format(analytics.reduce((acc, curr) => acc + curr.total, 0))}
            </Text>
            <Text className="text-base">/ {formatter.format(budgetAmount)}</Text>
          </View>
          <View className="flex flex-row flex-1 justify-center">
            <PieChart radius={100} textSize={20} showTextBackground textBackgroundRadius={26} data={chartData} />
          </View>

          <View className="flex flex-col gap-2">
            {analytics.map(analytic => {
              const findCategory = categoryOptions.find(e => e.label === analytic.name);
              const Icon = findCategory?.icon;
              const color = chartData.find(e => e.text === analytic.name)?.color;

              return (
                <View
                  className="flex flex-row justify-between items-center px-3 py-2 rounded-lg w-full bg-white"
                  key={analytic.name}>
                  <View className="flex flex-row items-center gap-2">
                    {Icon && <Icon color={color} />}
                    <View className="flex flex-col gap-2">
                      <Text className="capitalize font-medium text-sm">{analytic.name}</Text>
                      <Text className="text-[10px]">{analytic.spentTimes}x Spent</Text>
                    </View>
                  </View>
                  <Text
                    className="font-medium text-sm"
                    style={{
                      color: color,
                    }}>
                    {primaryCurrencySymbol} {formatter.format(analytic.total)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ModalWrapper>
  );
};
