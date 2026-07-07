import {BudgetCard, SegmentsControlButton} from '@/components';
import {useProfile} from '@/hooks';
import {PropsWithChildren, useState} from 'react';
import {Text, View} from 'react-native';

const CardWrapper: React.FC<PropsWithChildren> = ({children}) => {
  return <View className="w-full p-2">{children}</View>;
};

const Header: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<BudgetType>('weekly');
  const {user} = useProfile();

  return (
    <View className="flex flex-col rounded-2xl p-3 gap-5">
      <View className="flex flex-row">
        <View className="flex flex-col gap-2">
          <Text className="font-medium">
            Good morning, {user?.firstName} {user?.lastName} 👋
          </Text>
          <Text className="font-medium">Let’s stay within your budget today</Text>
        </View>
      </View>
      <SegmentsControlButton
        onClick={val => setActiveSegment(val as BudgetType)}
        active={activeSegment}
        segments={[
          {
            value: 'weekly',
            label: 'Weekly',
          },
          {
            value: 'monthly',
            label: 'Monthly',
          },
          {
            value: 'custom',
            label: 'Custom',
          },
        ]}
      />
      <CardWrapper>
        <BudgetCard budgetType={activeSegment} />
      </CardWrapper>
    </View>
  );
};

export default Header;
