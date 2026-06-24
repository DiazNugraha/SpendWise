import {ConstructionIcon} from 'lucide-react-native';
import {Text, View} from 'react-native';

export const UnderConstruction = () => {
  return (
    <View className="flex-1 flex items-center justify-center flex-col gap-6 px-9">
      <IconWrapper />
      <Text className="font-bold text-2xl text-center">Under Construction</Text>
      <Text className="font-medium text-lg text-center">
        We're working hard to bring you something amazing. This page will be available soon!
      </Text>
      <Text className="font-medium text-slate-400 text-sm text-center">Estimated Completion: Coming Soon</Text>
    </View>
  );
};

const IconWrapper = () => {
  return (
    <View className="p-8 rounded-2xl bg-[#EDE9FE] flex items-center justify-center">
      <ConstructionIcon size={50} color={'#8B5CF6'} />
    </View>
  );
};
