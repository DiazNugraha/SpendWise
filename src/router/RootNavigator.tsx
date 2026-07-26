import {createStackNavigator} from '@react-navigation/stack';
import {AccountSettings, AuthScreen, Budget, Expense, History, Report, ReportDetail, WalletSettings} from '@/screens';
import {TabNavigator} from '@/components';
import {RootNavigationProp, RootNavigatorParamList} from '@/types';
import BudgetForm from '@/screens/Budget/components/BudgetForm';
import {useProfile} from '@/hooks';
import {useNavigation} from '@react-navigation/native';
import {Fragment, useEffect, useRef, useState} from 'react';
import SplashScreen from '@/screens/Splash';

export function RootNavigator() {
  const Stack = createStackNavigator<RootNavigatorParamList>();
  const {isLoading: loadingProfileData, user} = useProfile();
  const navigation = useNavigation<RootNavigationProp>();

  const splashStarted = useRef(Date.now());
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (loadingProfileData) return;

    const elapsed = Date.now() - splashStarted.current;

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, Math.max(0, 1000 - elapsed));

    return () => clearTimeout(timer);
  }, [loadingProfileData, navigation]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {user ? (
        <Fragment>
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
        </Fragment>
      ) : (
        <Fragment>
          <Stack.Screen name="Auth" component={AuthScreen} />
        </Fragment>
      )}
    </Stack.Navigator>
  );
}
