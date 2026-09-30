import React, {PropsWithChildren, useCallback, useEffect} from 'react';
import {Button, DevSettings, ScrollView, Text, View} from 'react-native';
import Header from './components/Header';
import History from './components/History';
import Navigator from './components/Navigator';
import {
  formatDate,
  NumberFormatter,
  resetDatabase,
  seedWeeklyAndExpenses,
  syncPendingData,
  updateExpiredBudgets,
} from '@/helpers';
import {useAlert, useProfile} from '@/hooks';
import * as Icons from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export const Home: React.FC = () => {
  const {alert} = useAlert();
  const {user} = useProfile();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const resetDatabaseAction = async () => {
    alert({
      title: 'Reset Database',
      description: 'Are you sure?',
      onConfirm: async () => {
        await resetDatabase().then(() => {
          DevSettings.reload();
        });
      },
      onCancel: () => {
        return;
      },
    });
  };

  const seedDummyAction = async () => {
    alert({
      title: 'Seed dummy budget',
      description: 'Are you sure?',
      onConfirm: async () => {
        await seedWeeklyAndExpenses().then(() => {
          DevSettings.reload();
        });
      },
    });
  };

  const handleUpdateExpiredBudgets = useCallback(async () => {
    if (!user?.id) return;
    const updatedBudgets = await updateExpiredBudgets(user?.id);
    await syncPendingData(user.id);

    if (updatedBudgets.length > 0) {
      alert({
        title: 'Your budgets have ended',
        description: 'These budget periods have finished.',
        onConfirm: async () => navigation.navigate('Report'),
        hideCancelButton: true,
        content: <UpdatedBudgets budgets={updatedBudgets} />,
        confirmButtonLabel: 'Go to Report',
      });
    }
  }, [alert, navigation, user]);

  useEffect(() => {
    handleUpdateExpiredBudgets();
  }, [alert, handleUpdateExpiredBudgets]);

  return (
    <ScrollView className="bg-gray-100 rounded-t-3xl flex-1 p-4">
      <View className=" flex flex-col gap-6">
        <Header />
        <Navigator />
        <View className="my-4 flex flex-col gap-2">
          <Button title="reset database" onPress={resetDatabaseAction} />
          <Button title="seed dummy budget" onPress={seedDummyAction} />
        </View>
        <History />
      </View>
    </ScrollView>
  );
};

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

function UpdatedBudgets({budgets}: {budgets: (IBudgetSchema & {totalSpent: number})[]}) {
  const {primaryCurrencySymbol} = useProfile();

  const displayDate = (date: number) => {
    const convertToDate = new Date(date);

    return formatDate(convertToDate, {
      locales: 'en-GB',
      dateTimeOption: {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      },
    });
  };

  return (
    <View className="flex flex-col gap-2 w-full">
      {budgets.map(e => {
        const Icon = Icons[e.icon as keyof typeof Icons] as Icons.LucideIcon;
        const percentage = Math.floor((e.totalSpent / e.amount) * 100);
        return (
          <ItemWrapper key={e.type} bgColor={e.iconColor ?? '#FFFFFF'}>
            <View className="flex flex-row gap-2 items-center justify-between w-full">
              <View className="flex flex-col gap-2">
                <Text className="capitalize font-medium text-base">{e.title}</Text>
                <Text className="text-[10px]">
                  {displayDate(e.startDate)} - {displayDate(e.endDate)} ({e.type})
                </Text>
              </View>
              {e.icon && Icon && <Icon color={e.iconColor ?? ''} />}
            </View>
            <View className="flex flex-row justify-between items-end w-full">
              <View className="flex flex-col gap-1">
                <Text className="text-[#6D28D9] font-medium text-sm">
                  {primaryCurrencySymbol} {formatter.format(e.amount)} Budget
                </Text>
                <Text className="text-[#374151] font-medium text-sm">
                  {primaryCurrencySymbol} {formatter.format(e.totalSpent)} Spent
                </Text>
              </View>
              <Text
                className="font-medium text-base"
                style={{
                  color: percentage > 100 ? '#EF4444' : '#16A34A',
                }}>
                {percentage}%
              </Text>
            </View>
          </ItemWrapper>
        );
      })}
    </View>
  );
}

const ItemWrapper: React.FC<PropsWithChildren & {bgColor?: string}> = ({children, bgColor}) => {
  return (
    <View
      className="rounded-xl flex flex-col justify-between items-start gap-2 p-2"
      style={{
        backgroundColor: `${bgColor}1A`,
      }}>
      {children}
    </View>
  );
};
