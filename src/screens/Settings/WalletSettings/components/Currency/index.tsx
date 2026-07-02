import React from 'react';
import {Text, View} from 'react-native';
import {CurrencyForm} from './Form';

export const Currency: React.FC = () => {
  return (
    <View>
      <Text className="text-base font-medium">Currency:</Text>
      <CurrencyForm />
    </View>
  );
};
