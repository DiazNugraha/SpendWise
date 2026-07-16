import React from 'react';
import {Button, DevSettings, ScrollView, View} from 'react-native';
import Header from './components/Header';
import History from './components/History';
import Navigator from './components/Navigator';
import {resetDatabase} from '@/helpers';
import {useAlert} from '@/hooks';

export const Home: React.FC = () => {
  const {alert} = useAlert();

  const resetDatabaseAction = async () => {
    alert({
      title: 'Reset Database',
      description: 'Are you sure?',
      onConfirm: async () => {
        await resetDatabase().then(() => {
          DevSettings.reload();
        });
      },
      onCancel: () => {
        return;
      },
    });
  };

  return (
    <ScrollView className="bg-gray-100 rounded-t-3xl flex-1 p-4">
      <View className=" flex flex-col gap-6">
        <Header />
        <View className="my-4 flex flex-col gap-2">
          <Button title="reset database" onPress={resetDatabaseAction} />
        </View>
        <Navigator />
        <History />
      </View>
    </ScrollView>
  );
};
