import React, {PropsWithChildren} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {WalletList} from './components/Wallet';
import {Currency} from './components/Currency';

export const WalletSettings: React.FC = () => {
  return (
    <ScrollView className="flex flex-col gap-5 flex-1 p-4">
      <View className="flex-1 justify-center mb-3">
        <Text className="font-medium text-xl text-center">Wallet Preferences</Text>
      </View>
      <View className="flex flex-col gap-3">
        <Wrapper>
          <Currency />
        </Wrapper>
        <Wrapper>
          <WalletList />
        </Wrapper>
      </View>
    </ScrollView>
  );
};

const Wrapper: React.FC<PropsWithChildren> = ({children}) => {
  return <View className="p-4 bg-white rounded-2xl flex flex-col">{children}</View>;
};
