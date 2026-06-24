import {Pressable, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {JSX} from 'react';
import {ChartBar, Award as IconAward, Brain as IconBrain, Goal as IconGoal} from 'lucide-react-native';

const Navigator: React.FC = () => {
  const menus: {
    label: string;
    icon: JSX.Element;
    screenName?: string;
  }[] = [
    {
      label: 'Add Goal',
      icon: <IconGoal color={'#6D28D9'} />,
      screenName: 'Budget',
    },
    {
      label: 'Reports',
      icon: <ChartBar color={'#6D28D9'} />,
    },
    {
      label: 'Challenges',
      icon: <IconAward color={'#6D28D9'} />,
    },
    {
      label: 'Insights',
      icon: <IconBrain color={'#6D28D9'} />,
    },
  ];

  const navigation = useNavigation<StackNavigationProp<any>>();

  const handlePress = (index: number) => {
    const navTarget = menus[index].screenName;
    if (!navTarget) return;
    return navigation.navigate(navTarget);
  };

  return (
    <View className="flex flex-row rounded-2xl justify-evenly">
      {menus.map((menu, i) => (
        <View className="flex flex-col items-center justify-center" key={i}>
          <Pressable onPress={() => handlePress(i)} className="p-5 bg-white rounded-2xl">
            {menu.icon}
          </Pressable>
          <View className="flex items-center px-2 my-2">
            <Text className="text-xs text-center">{menu.label}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default Navigator;
