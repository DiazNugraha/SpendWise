import {ModalWrapper, SegmentsControlButton} from '@/components';
import {useCallback, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {ReportFilter} from './components/Filter';
import {BarChart} from 'react-native-gifted-charts';
import {useFocusEffect} from '@react-navigation/native';
import {useBudgetRepo} from '@/hooks';

type IChartData = {
  value: number;
  label: string;
  frontColor?: string;
};

export const Report: React.FC = () => {
  const budgetRepo = useBudgetRepo();
  const now = new Date();

  const [activeSegment, setActiveSegment] = useState<BudgetType>('weekly');
  const [chartData, setChartData] = useState<IChartData[]>();
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

    setChartData(results.map(res => ({...res, frontColor: '#177AD5'})));
  }, [budgetRepo, filter, activeSegment]);

  useFocusEffect(
    useCallback(() => {
      fetchBudgetStatistics();
    }, [fetchBudgetStatistics]),
  );

  return (
    <ModalWrapper title="Reports">
      <ScrollView className="p-4 flex flex-col flex-1 gap-y-6">
        <SegmentsControlButton
          onClick={val => setActiveSegment(val as BudgetType)}
          active={activeSegment}
          segments={[
            {
              value: 'weekly',
              label: 'Weekly',
            },
            {
              value: 'monthly',
              label: 'Monthly',
            },
            {
              value: 'custom',
              label: 'Custom',
            },
          ]}
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

        <View className="mt-6 flex-1 bg-white p-2 rounded-xl">
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
      </ScrollView>
    </ModalWrapper>
  );
};
