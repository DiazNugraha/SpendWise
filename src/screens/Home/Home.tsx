import React from 'react';
import {Text, View} from 'react-native';
import Header from './components/Header';
import History from './components/History';
import Navigator from './components/Navigator';

export const Home: React.FC = () => {
  return (
    <View className="bg-black flex flex-col gap-3">
      <View className="mt-5 flex flex-row gap-3 items-center px-4 justify-end">
        <View className=" bg-blue-200 items-center justify-center rounded-lg py-1 px-4">
          <Text className="text-blue-700 text-xs">Badge</Text>
        </View>
        <Text className="text-white">Name</Text>
      </View>
      <View className=" bg-gray-100 rounded-t-3xl flex flex-col gap-4 p-4">
        <Header />
        <Navigator />
        <History />
      </View>
    </View>
  );
};
