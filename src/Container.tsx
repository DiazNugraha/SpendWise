import {NavigationContainer} from '@react-navigation/native';
import {RootNavigator} from '@/routers';
import {AlertProvider, ProfileProvider} from './contexts';

export default function Container() {
  return (
    <NavigationContainer>
      <ProfileProvider>
        <AlertProvider>
          <RootNavigator />
        </AlertProvider>
      </ProfileProvider>
    </NavigationContainer>
  );
}
