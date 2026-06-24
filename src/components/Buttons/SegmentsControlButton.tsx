import {Pressable, Text, View} from 'react-native';

type Props = {
  segments: {
    label: string;
    value: string;
  }[];
  active: string;
  onClick: (value: string) => void;
};

export const SegmentsControlButton: React.FC<Props> = ({segments, active, onClick}) => {
  const getColorStyle = (segmentValue: string) => {
    if (active === segmentValue)
      return {
        bgColor: '#6D28D9',
        color: 'white',
      };
    return {
      bgColor: 'white',
      color: '#6D28D9',
    };
  };

  return (
    <View className="flex flex-row p-1 bg-white rounded-3xl">
      {segments.map(segment => {
        const colorStyle = getColorStyle(segment.value);
        return (
          <Pressable
            key={segment.value}
            onPress={() => onClick(segment.value)}
            className="px-3 py-1 rounded-2xl flex-1 items-center justify-center"
            style={{
              backgroundColor: colorStyle.bgColor,
            }}>
            <Text
              className="font-medium"
              style={{
                color: colorStyle.color,
              }}>
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
