import {PropsWithChildren} from 'react';
import {Pressable, Text, View} from 'react-native';

type Props = {
  onSubmit: () => void;
  text: string;
} & PropsWithChildren;

const FormButtonWrapper: React.FC<Props> = ({text, onSubmit, children}) => {
  return (
    <View className="relative flex-1">
      {children}
      <View className="absolute bottom-0 mb-4 bg-white w-full p-5">
        <Pressable className="py-5 px-6 rounded-2xl items-center justify-center bg-[#6D28D9]" onPress={onSubmit}>
          <Text className="text-white font-medium">{text}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default FormButtonWrapper;
