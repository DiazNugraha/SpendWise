import React from 'react';
import {View} from 'react-native';
import Header from './components/Header';
import History from './components/History';
import Navigator from './components/Navigator';

export const Home: React.FC = () => {
  return (
    <View className="bg-gray-100 rounded-t-3xl flex-1 p-4">
      <Header />
      <Navigator />
      <View className="flex-1">
        <History />
      </View>
    </View>
  );
};
