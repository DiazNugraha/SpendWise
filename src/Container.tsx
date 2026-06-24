import {NavigationContainer} from '@react-navigation/native';
import {RootNavigator} from '@/router';
import {AlertProvider} from './contexts';

export default function Container() {
  return (
    <NavigationContainer>
      <AlertProvider>
        <RootNavigator />
      </AlertProvider>
    </NavigationContainer>
  );
}
