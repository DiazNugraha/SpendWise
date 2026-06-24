import {LucideIcon} from 'lucide-react-native';
import {FlatList, Pressable, Text} from 'react-native';

type IOption<T> = {
  label: string;
  value: T;
  icon?: LucideIcon;
};

type CarouselChipsProps<T> = {
  options: IOption<T>[];
  onChange: (value: T | T[]) => void;
  value: T | T[];
  multiple?: boolean;
};

export function CarouselChips<T>({options, onChange, value, multiple}: CarouselChipsProps<T>) {
  const checkSelected = (val: T) => {
    if (!multiple) return value === val;
    if (!Array.isArray(value)) return false;
    return value.includes(val);
  };

  const handleChange = (val: T) => {
    if (!multiple) return onChange(val);
    if (!Array.isArray(value)) return;

    if (value.includes(val)) return onChange(value.filter(e => e !== val));
    return onChange([...value, val]);
  };

  return (
    <FlatList
      data={options}
      showsHorizontalScrollIndicator={false}
      horizontal
      keyExtractor={item => String(item.value)}
      contentContainerStyle={{
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
      }}
      renderItem={({item}) => {
        return <PressableChip item={item} isSelected={checkSelected(item.value)} onChange={handleChange} />;
      }}
    />
  );
}

function PressableChip<T>({
  onChange,
  item,
  isSelected,
}: {
  item: IOption<T>;
  onChange: (value: T) => void;
  isSelected: boolean;
}) {
  const Icon = item.icon;
  return (
    <Pressable
      onPress={() => onChange(item.value)}
      className={`px-5 py-3 flex flex-row gap-2 items-center justify-center rounded-3xl ${
        isSelected ? 'bg-[#6D28D9]' : 'border border-[#eee] bg-white'
      }`}>
      {Icon && <Icon size={16} color={isSelected ? 'white' : '#6b7280'} />}
      <Text numberOfLines={1} className={`font-medium ${isSelected ? 'text-[#fff]' : 'text-gray-500'}`}>
        {item.label}
      </Text>
    </Pressable>
  );
}
