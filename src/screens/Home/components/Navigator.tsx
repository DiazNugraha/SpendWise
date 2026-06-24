import {Pressable, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

const Navigator: React.FC = () => {
  const menus: string[] = ['Add Weekly Goals', 'Add Monthly Goals', 'Challenges', 'Insights'];
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handlePress = () => {
    return navigation.navigate('Target');
  };

  return (
    <View className="flex flex-row gap-1 bg-white px-3 py-5 rounded-2xl justify-evenly">
      {menus.map((menu, i) => (
        <Pressable
          onPress={handlePress}
          key={i}
          className="flex flex-col items-center w-20 text-justify rounded-xl bg-white shadow shadow-slate-400">
          <View className="w-10 h-10 bg-purple-500 rounded-full mt-4" />
          <View className="flex items-center px-2 my-1">
            <Text className="text-xs text-center">{menu}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default Navigator;
