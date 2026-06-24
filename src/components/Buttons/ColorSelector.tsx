import {CheckIcon} from 'lucide-react-native';
import {Fragment} from 'react';
import {Pressable, Text, View} from 'react-native';

type ColorSelectorProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
};

const colorOptions: {name: string; code: string}[] = [
  {
    name: 'red',
    code: '#FF6467',
  },
  {
    name: 'yellow',
    code: '#FDC745',
  },
  {
    name: 'green',
    code: '#9AE630',
  },
  {
    name: 'blue',
    code: '#21BCFF',
  },
  {
    name: 'purple',
    code: '#A684FF',
  },
];

export const ColorSelector: React.FC<ColorSelectorProps> = ({value, onChange, label}) => {
  return (
    <Fragment>
      {label && <Text className="font-medium">{label}</Text>}

      <View className="flex flex-row gap-3">
        {colorOptions.map(e => {
          return (
            <Pressable onPress={() => onChange(e.code)} key={e.code}>
              <View
                className="w-[34px] h-[34px] rounded-full items-center justify-center"
                style={{
                  borderWidth: e.code === value ? 2 : 0,
                  borderColor: e.code,
                }}>
                <View
                  className="w-[26px] h-[26px] rounded-full items-center justify-center"
                  style={{
                    backgroundColor: e.code,
                  }}>
                  {e.code === value && <CheckIcon size={14} color="white" />}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Fragment>
  );
};
