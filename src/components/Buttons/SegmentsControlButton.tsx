import {useEffect, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';

type Props = {
  segments: {
    label: string;
    value: string;
  }[];
  active: string;
  onClick: (value: string) => void;
};

export const SegmentsControlButton: React.FC<Props> = ({segments, active, onClick}) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const activeIndex = segments.findIndex(e => e.value === active);

  const ITEM_WIDTH = containerWidth > 0 ? containerWidth / segments.length : 0;
  const indicatorX = useSharedValue(0);

  useEffect(() => {
    indicatorX.value = withSpring(activeIndex * ITEM_WIDTH);
  }, [activeIndex, indicatorX, ITEM_WIDTH]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{translateX: indicatorX.value}],
  }));

  return (
    <View
      onLayout={e => {
        setContainerWidth(e.nativeEvent.layout.width);
      }}
      className="relative flex-row bg-white rounded-full items-center shadow shadow-slate-300">
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: ITEM_WIDTH,
            height: '100%',
            backgroundColor: '#8B5CF6',
          },
          animatedIndicatorStyle,
        ]}
        className="rounded-full"
      />
      {segments.map(segment => (
        <Pressable
          onPress={() => onClick(segment.value)}
          key={segment.value}
          className="flex-1 items-center justify-center py-3">
          <Text className={`${segment.value === active ? 'text-white' : 'text-[#6D28D9]'} font-medium`}>
            {segment.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
