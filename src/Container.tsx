import {NavigationContainer} from '@react-navigation/native';
import {RootNavigator} from '@/router';

export default function Container() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
