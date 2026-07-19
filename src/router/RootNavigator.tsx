import {createStackNavigator} from '@react-navigation/stack';
import {AccountSettings, AuthScreen, Budget, Expense, History, Report, ReportDetail, WalletSettings} from '@/screens';
import {TabNavigator} from '@/components';
import {RootNavigationProp, RootNavigatorParamList} from '@/types';
import BudgetForm from '@/screens/Budget/components/BudgetForm';
import {useProfile} from '@/hooks';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';

export function RootNavigator() {
  const Stack = createStackNavigator<RootNavigatorParamList>();
  const {isLoading: loadingProfileData, user} = useProfile();
  const navigation = useNavigation<RootNavigationProp>();

  useEffect(() => {
    if (!loadingProfileData && !user) {
      navigation.navigate('Auth');
    }
  }, [user, loadingProfileData, navigation]);

  if (loadingProfileData) {
    return (
      <View>
        <Text>Loading Profile Data</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      <Stack.Screen name="Auth" component={AuthScreen} />

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
