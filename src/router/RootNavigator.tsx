import {createStackNavigator} from '@react-navigation/stack';
import {AddExpense} from '@/screens';
import {TabNavigator} from '@/components';

export function RootNavigator() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      <Stack.Screen
        name="AddExpense"
        component={AddExpense}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}
