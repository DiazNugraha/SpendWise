import {createStackNavigator} from '@react-navigation/stack';
import {Budget, Expense, History} from '@/screens';
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
    </Stack.Navigator>
  );
}
