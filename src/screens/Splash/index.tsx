import {Text, View} from 'react-native';

const SplashScreen: React.FC = () => {
  return (
    <View className="flex flex-col h-full px-5 justify-evenly relative overflow-hidden bg-white">
      <View className="flex flex-col gap-1 items-center">
        <View className="flex flex-row">
          <Text className="text-[50px] font-bold">Spend</Text>
          <Text className="text-[50px] font-bold text-purple-600">Wise</Text>
        </View>
        <Text className="text-base font-medium text-center">Plan Smarter. Spend Better. Reach your goals.</Text>
      </View>

      {/* Bottom Left */}
      <View className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-purple-500/20" />
      <View className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-purple-500/10" />

      {/* Top Right */}
      <View className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-purple-500/15" />
      <View className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-purple-500/8" />
    </View>
  );
};

export default SplashScreen;
