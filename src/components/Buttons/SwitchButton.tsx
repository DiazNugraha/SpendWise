import React from 'react';
import {Switch, View} from 'react-native';

type Props = {
  onChange: (value: boolean) => void;
  value: boolean;
};

export const SwitchButton: React.FC<Props> = ({onChange, value}) => {
  return (
    <View
      className="px-[2px] py-[0px] rounded-3xl"
      style={{
        backgroundColor: value ? '#6D28D9' : '#767577',
      }}>
      <Switch
        trackColor={{false: '#767577', true: '#6D28D9'}}
        style={{
          padding: 0,
        }}
        thumbColor={'#f4f3f4'}
        className="h-10"
        ios_backgroundColor="#3e3e3e"
        onValueChange={onChange}
        value={value}
      />
    </View>
  );
};
