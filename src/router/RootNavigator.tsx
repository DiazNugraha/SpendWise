import {createStackNavigator} from '@react-navigation/stack';
import {AccountSettings, Budget, Expense, History, Report, ReportDetail, WalletSettings} from '@/screens';
import {TabNavigator} from '@/components';
import {RootNavigatorParamList} from '@/types';
import BudgetForm from '@/screens/Budget/components/BudgetForm';

export function RootNavigator() {
  const Stack = createStackNavigator<RootNavigatorParamList>();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      <Stack.Screen
        name="Expense"
        component={Expense}
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="History"
        component={History}
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="Budget"
        component={Budget}
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="BudgetForm"
        component={BudgetForm}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="WalletSettings"
        component={WalletSettings}
        options={{
          title: 'My Wallets',
        }}
      />

      <Stack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{
          title: 'My Account',
        }}
      />

      <Stack.Screen
        name={'Report'}
        component={Report}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={'ReportDetail'}
        component={ReportDetail}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
