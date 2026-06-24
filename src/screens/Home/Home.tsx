import React from 'react';
import {Button, DevSettings, ScrollView, View} from 'react-native';
import Header from './components/Header';
import History from './components/History';
import Navigator from './components/Navigator';
import {resetDatabase} from '@/helpers';

export const Home: React.FC = () => {
  const resetDatabaseAction = async () => {
    await resetDatabase().then(() => {
      DevSettings.reload();
    });
  };

  return (
    <ScrollView className="bg-gray-100 rounded-t-3xl flex-1 p-4">
      <Header />
      <View className="my-4">
        <Button title="reset database" onPress={resetDatabaseAction} />
      </View>
      <Navigator />
      <View className="flex-1">
        <History />
      </View>
    </ScrollView>
  );
};
