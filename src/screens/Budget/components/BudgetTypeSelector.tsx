import {Calendar, LucideIcon, Target} from 'lucide-react-native';
import {useState} from 'react';
import {Pressable, Text, View} from 'react-native';

const targetTypes: {label: string; rangeDate?: number; icon: LucideIcon}[] = [
  {
    label: 'monthly',
    rangeDate: 30,
    icon: Calendar,
  },
  {
    label: 'weekly',
    rangeDate: 7,
    icon: Target,
  },
  {
    label: 'custom',
    icon: Target,
  },
];

type Props = {
  onChange: (value: {label: string; rangeDate?: number}) => void;
};

const BudgetTypeSelector: React.FC<Props> = ({onChange}) => {
  const [selected, setSelected] = useState<string>();

  const getBorderRoundedStyle = (orderIndex: number): string => {
    if (targetTypes.length === orderIndex + 1) return 'rounded-r-2xl';
    if (orderIndex === 0) return 'rounded-l-2xl';
    return '';
  };

  const getColorStyle = (label: string): {bgColor: string; color: string} => {
    if (selected == label)
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
    <View className="flex flex-row w-full">
      {targetTypes.map((target, index) => {
        const borderStyle = getBorderRoundedStyle(index);
        const Icon = target.icon;
        const colorStyle = getColorStyle(target.label);
        return (
          <Pressable
            onPress={() => {
              setSelected(target.label);
              onChange({...target});
            }}
            key={index}
            className={`px-4 py-3 flex flex-col gap-1 border border-[#6D28D9] items-center justify-center flex-1 ${borderStyle} `}
            style={{
              backgroundColor: colorStyle.bgColor,
            }}>
            {<Icon color={colorStyle.color} />}
            <Text
              className="capitalize"
              style={{
                color: colorStyle.color,
              }}>
              {target.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default BudgetTypeSelector;
