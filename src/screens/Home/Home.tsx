import React from 'react';
import {View} from 'react-native';
import Header from './components/Header';
import History from './components/History';
import Navigator from './components/Navigator';

export const Home: React.FC = () => {
  return (
    <View className=" bg-gray-100 rounded-t-3xl flex flex-col gap-4 p-4">
      <Header />
      <Navigator />
      <History />
    </View>
  );
};
