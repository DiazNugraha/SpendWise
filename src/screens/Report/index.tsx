import {ModalWrapper, SegmentsControlButton} from '@/components';
import {useCallback, useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {ReportFilter} from './components/Filter';
import {BarChart} from 'react-native-gifted-charts';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useBudgetRepo, useProfile} from '@/hooks';
import * as Icons from 'lucide-react-native';
import {formatDate, NumberFormatter} from '@/helpers';
import {RootNavigationProp} from '@/types';
import {budgetSegments} from '@/constants/options';

type IChartData = {
  value: number;
  label: string;
  frontColor?: string;
};

type IBudgetData = {
  spentAmount: number;
} & IBudget;

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

export const Report: React.FC = () => {
  const budgetRepo = useBudgetRepo();
  const now = new Date();

  const {primaryCurrencySymbol} = useProfile();
  const navigation = useNavigation<RootNavigationProp>();

  const [activeSegment, setActiveSegment] = useState<BudgetType>('weekly');
  const [chartData, setChartData] = useState<IChartData[]>();
  const [savedBudgets, setSavedBudgets] = useState<IBudgetData[]>([]);
  const [filter, setFilter] = useState<{
    dateRange: {startDate: Date; endDate: Date};
  }>({
    dateRange: {
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: now,
    },
  });

  const fetchBudgetStatistics = useCallback(async () => {
    const results = await budgetRepo.getPercentageOfEachBudget({
      type: activeSegment,
      dateRange: filter?.dateRange,
    });

    setChartData(results.map(res => ({...res, frontColor: '#6D28D9'})));
    setSavedBudgets(
      results.map(res => {
        return {
          ...res,
          icon: res.icon ?? '',
          iconColor: res.iconColor ?? '',
          dateRange: {
            startDate: new Date(res.startDate),
            endDate: new Date(res.endDate),
          },
          type: res.type as BudgetType,
        };
      }),
    );
  }, [budgetRepo, filter, activeSegment]);

  useFocusEffect(
    useCallback(() => {
      fetchBudgetStatistics();
    }, [fetchBudgetStatistics]),
  );

  return (
    <ModalWrapper title="Reports">
      <ScrollView className="p-4">
        <View className="flex flex-col gap-y-5">
          <SegmentsControlButton
            onClick={val => setActiveSegment(val as BudgetType)}
            active={activeSegment}
            segments={budgetSegments}
          />

          <ReportFilter
            value={{
              dateRange: filter.dateRange,
            }}
            setDateRange={val => {
              setFilter({
                dateRange: {
                  startDate: new Date(val.startDate?.toString() ?? ''),
                  endDate: new Date(val.endDate?.toString() ?? ''),
                },
              });
            }}
          />

          <View className="flex-1 bg-white p-2 rounded-xl overflow-hidden">
            <BarChart
              barWidth={22}
              noOfSections={4}
              barBorderRadius={4}
              frontColor="lightgray"
              data={chartData}
              yAxisThickness={0}
              xAxisThickness={0}
              spacing={30}
              maxValue={100}
            />
          </View>

          <View className="flex flex-col gap-2 py-5">
            {savedBudgets.map(budget => {
              const Icon = Icons[budget.icon as keyof typeof Icons] as Icons.LucideIcon;
              return (
                <Pressable
                  key={budget.id}
                  onPress={() => navigation.navigate('ReportDetail', {id: budget.id ?? ''})}
                  className="flex flex-row justify-between px-3 py-2 rounded-lg w-full bg-white ">
                  <View className="flex flex-row items-center gap-2">
                    {Icon && <Icon color={budget.iconColor} />}
                    <View className="flex flex-col gap-2">
                      <Text className="capitalize font-medium text-sm">{budget.title}</Text>
                      <Text className="text-[10px]">
                        {formatDate(budget.dateRange.startDate)} - {formatDate(budget.dateRange.endDate)}
                      </Text>
                    </View>
                  </View>
                  <View className="flex flex-row items-center gap-1">
                    <View className="flex flex-row items-end">
                      <Text className="text-[#6D28D9] font-medium text-sm">
                        {primaryCurrencySymbol} {formatter.format(budget.spentAmount)}
                      </Text>
                      <Text className="text-xs">/{formatter.format(budget.amount)}</Text>
                    </View>
                    <Icons.ChevronRight color={'#c4c4c4'} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ModalWrapper>
  );
};
