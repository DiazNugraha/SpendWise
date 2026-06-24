import {createStackNavigator} from '@react-navigation/stack';
import {Budget, Expense} from '@/screens';
import {TabNavigator} from '@/components';

export function RootNavigator() {
  const Stack = createStackNavigator();

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
        name="Budget"
        component={Budget}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}
