import {BudgetCard, SegmentsControlButton} from '@/components';
import {budgetSegments} from '@/constants/options';
import {useBudgetRepo, useProfile} from '@/hooks';
import {RootNavigationProp} from '@/types';
import {useNavigation} from '@react-navigation/native';
import {ChevronRightIcon, CloudBackupIcon} from 'lucide-react-native';
import {useCallback, useEffect, useState} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const startingPosition = 0;
const translateXMax = 150;

const Header: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<BudgetType>('weekly');

  const budgetRepo = useBudgetRepo();
  const {user} = useProfile();

  const navigation = useNavigation<RootNavigationProp>();

  const goNext = () => {
    const index = budgetSegments.findIndex(s => s.value === activeSegment);

    if (index < budgetSegments.length - 1) {
      setActiveSegment(budgetSegments[index + 1].value as BudgetType);
    } else {
      setActiveSegment(budgetSegments[0].value as BudgetType);
    }
  };

  const goPrevious = () => {
    const index = budgetSegments.findIndex(s => s.value === activeSegment);

    if (index - 1 >= 0) {
      setActiveSegment(budgetSegments[index - 1].value as BudgetType);
    } else {
      setActiveSegment(budgetSegments[budgetSegments.length - 1].value as BudgetType);
    }
  };

  const translateX = useSharedValue(startingPosition);

  const pan = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = withSpring(event.translationX);
    })
    .onEnd(event => {
      if (event.translationX < -translateXMax) {
        goNext();
      } else if (event.translationX > translateXMax) {
        goPrevious();
      }

      translateX.value = withSpring(0);
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(Math.abs(translateX.value), [0, translateXMax], [1, 0], Extrapolation.CLAMP);

    const scale = interpolate(Math.abs(translateX.value), [0, translateXMax], [1, 0.95], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{translateX: translateX.value}, {scale}],
    };
  });

  const findActiveBudgetGoals = useCallback(async () => {
    const activeBudgetGoals = await budgetRepo.findActivesEachType();

    const findOne = activeBudgetGoals.filter(e => e.isActive)[0];
    if (findOne) {
      setActiveSegment(findOne.type as BudgetType);
    }
  }, [budgetRepo]);

  useEffect(() => {
    findActiveBudgetGoals();
  }, [findActiveBudgetGoals]);

  return (
    <View className="flex flex-col rounded-2xl gap-5">
      <View className="flex flex-col gap-2">
        <View className="flex flex-row justify-between">
          <View className="flex flex-col gap-2">
            <Text className="font-medium text-base">
              Welcome back, {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-sm text-slate-500">Let's stay on track with your budget.</Text>
          </View>
          {user?.avatarUrl && (
            <Pressable onPress={() => navigation.navigate('AccountSettings')}>
              <Image
                source={{
                  uri: user.avatarUrl,
                }}
                className="rounded-full"
                style={{
                  height: 42,
                  width: 42,
                }}
              />
            </Pressable>
          )}
        </View>
        {user?.isGuest && (
          <Pressable
            onPress={() => navigation.navigate('AccountSettings')}
            className="flex-row items-center justify-between rounded-2xl bg-purple-50 p-4">
            <View className="flex-row items-center flex-1">
              <CloudBackupIcon className="text-purple-600" />

              <View className="ml-3 flex-1">
                <Text className="font-semibold">Cloud Backup</Text>
                <Text className="text-sm text-gray-500">Sign in to sync your data.</Text>
              </View>
            </View>

            <ChevronRightIcon className="text-gray-400" />
          </Pressable>
        )}
      </View>

      <SegmentsControlButton
        onClick={val => setActiveSegment(val as BudgetType)}
        active={activeSegment}
        segments={budgetSegments}
      />
      <GestureDetector gesture={pan}>
        <Animated.View style={[animatedStyle]}>
          <BudgetCard budgetType={activeSegment} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default Header;
