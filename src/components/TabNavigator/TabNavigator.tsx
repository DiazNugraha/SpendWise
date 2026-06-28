import {Home, Settings} from '@/screens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TouchableOpacity, TouchableOpacityProps, View} from 'react-native';
import {HomeIcon as HomeIcon, Plus as PlusIcon, Settings as SettingsIcon} from 'lucide-react-native';

const AddPlaceholderButton: React.FC<TouchableOpacityProps> = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="-top-5 flex-1 items-center justify-center">
      <View className="w-16 h-16 rounded-full bg-purple-700 border-4 border-white  items-center justify-center elevation-md">
        <PlusIcon color={'white'} size={24} />
      </View>
    </TouchableOpacity>
  );
};

export const TabNavigator: React.FC = () => {
  const Tab = createBottomTabNavigator();

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={() => {
          return {
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              height: 72,
              backgroundColor: '#FFFFFF',
              elevation: 12,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            tabBarActiveTintColor: '#7C3AED',
            tabBarInactiveTintColor: '#9CA3AF',
          };
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({color}) => <HomeIcon color={color} size={24} />,
          }}
        />
        <Tab.Screen
          name="AddPlaceholder"
          component={() => null}
          listeners={({navigation}) => ({
            tabPress: e => {
              e.preventDefault();
              navigation.navigate('Expense');
            },
          })}
          options={{
            tabBarButton: props => <AddPlaceholderButton onPress={props.onPress} />,
          }}
        />
        <Tab.Screen
          name="Setting"
          component={Settings}
          options={{
            tabBarIcon: ({color}) => <SettingsIcon color={color} size={24} />,
          }}
        />
      </Tab.Navigator>
    </View>
  );
};
