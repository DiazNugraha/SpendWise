import {PropsWithChildren} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';

type Props = {
  onSubmit: () => void;
  isLoading?: boolean;
  text: string;
} & PropsWithChildren;

const FormButtonWrapper: React.FC<Props> = ({text, isLoading = false, onSubmit, children}) => {
  return (
    <View className="flex-1">
      <ScrollView className="flex flex-col" contentContainerClassName="gap-3 px-4">
        {children}
      </ScrollView>
      <View className=" mb-4 bg-white w-full p-5">
        <Pressable
          className={`py-5 px-6 rounded-2xl items-center justify-center  ${
            isLoading ? 'bg-[#6D28D9]/10' : 'bg-[#6D28D9]'
          }`}
          onPress={onSubmit}>
          <Text className="text-white font-medium">{isLoading ? 'Submitting...' : text}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default FormButtonWrapper;
