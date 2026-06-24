import {Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  spent: number;
  limit: number;
  title: string;
};

export const BudgetCard: React.FC<Props> = ({spent, limit, title}) => {
  const progress = (spent / limit) * 100;
  return (
    <LinearGradient
      colors={['#8B5CF6', '#6D28D9']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      className="w-full rounded-2xl p-4 overflow-hidden">
      {/* Decorative highlight */}
      <View className="absolute -top-2 -right-2 w-[40px] h-[40px] rounded-full bg-white/20" />

      <Text className="text-violet-100 text-sm mb-2">{title}</Text>

      <View className="flex-row items-end">
        <Text className="text-white text-3xl font-bold">${spent}</Text>
        <Text className="text-violet-200 text-base mb-1"> / ${limit}</Text>
      </View>

      {/* Progress bar */}
      <View className="mt-4 h-1.5 rounded-full bg-white/30">
        <View className="h-1.5 rounded-full bg-white" style={{width: `${progress}%`}} />
      </View>
    </LinearGradient>
  );
};
