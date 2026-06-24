import {Home, Budget} from '@/screens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TouchableOpacity, TouchableOpacityProps, View} from 'react-native';
import {BarChart2, HomeIcon, Plus} from 'lucide-react-native';

const AddPlaceholderButton: React.FC<TouchableOpacityProps> = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="-top-6 flex-1 items-center justify-center">
      <View className="w-16 h-16 rounded-[32px] bg-purple-500 items-center justify-center elevation-md">
        <Plus color={'white'} size={24} />
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
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 72,
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            elevation: 12,
          },
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
              navigation.navigate('AddExpense');
            },
          })}
          options={{
            tabBarButton: props => <AddPlaceholderButton onPress={props.onPress} />,
          }}
        />
        <Tab.Screen
          name="Budget"
          component={Budget}
          options={{
            tabBarIcon: ({color}) => <BarChart2 color={color} size={24} />,
          }}
        />
      </Tab.Navigator>
    </View>
  );
};
