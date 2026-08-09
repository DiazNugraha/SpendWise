import React from 'react';
import {ScrollView, View} from 'react-native';
import Header from './components/Header';
import History from './components/History';
import Navigator from './components/Navigator';

export const Home: React.FC = () => {
  return (
    <ScrollView className="bg-gray-100 rounded-t-3xl flex-1 p-4">
      <View className=" flex flex-col gap-6">
        <Header />
        <Navigator />
        <History />
      </View>
    </ScrollView>
  );
};
