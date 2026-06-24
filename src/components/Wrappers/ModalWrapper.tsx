import {useNavigation} from '@react-navigation/native';
import {ChevronLeft as ChevronLeftIcon} from 'lucide-react-native';
import {PropsWithChildren} from 'react';
import {Pressable, Text, View} from 'react-native';

type Props = {
  title: string;
} & PropsWithChildren;

const ModalWrapper: React.FC<Props> = ({children, title}) => {
  const navigation = useNavigation();

  return (
    <View className="bg-[#F8F9FD] flex-1 flex flex-col gap-4">
      <View className="w-full flex flex-row justify-between mt-5 px-4 items-center">
        <Pressable
          onPress={() => navigation.goBack()}
          className="p-3 rounded-full bg-white items-center justify-center">
          <ChevronLeftIcon />
        </Pressable>
        <Text className="font-medium text-xl">{title}</Text>
      </View>
      {children}
    </View>
  );
};

export default ModalWrapper;
