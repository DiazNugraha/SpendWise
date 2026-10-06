import {Home, Settings} from '@/screens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, TouchableOpacity, TouchableOpacityProps, View} from 'react-native';
import {CircleUserIcon, HomeIcon, PlusIcon} from 'lucide-react-native';

const AddPlaceholderButton: React.FC<TouchableOpacityProps> = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="-top-5 flex-1 items-center justify-center">
      <View className="w-20 h-20 rounded-full bg-[#7C3AED] border-[6px] border-white items-center justify-center">
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
              borderTopWidth: 0,
            },
            tabBarActiveTintColor: '#7C3AED',
            tabBarInactiveTintColor: '#9CA3AF',
          };
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({color}) => (
              <View className="flex flex-col gap-1 h-full items-center">
                <HomeIcon color={color} size={24} />
                <Text className="text-xs" style={{color: color}}>
                  Home
                </Text>
              </View>
            ),
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
            tabBarIcon: ({color}) => (
              <View className="flex flex-col gap-1 h-full items-center w-[70px]">
                <CircleUserIcon color={color} size={24} />
                <Text className="text-xs whitespace-nowrap" style={{color: color}}>
                  Profile
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};
