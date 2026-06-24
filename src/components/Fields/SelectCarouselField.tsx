import {useField} from 'formik';
import {LucideIcon} from 'lucide-react-native';
import {Fragment} from 'react';
import {FlatList, Pressable, Text} from 'react-native';

type SelectCarouselFieldProps<T> = {
  name: string;
  label?: string;
  options: {label: string; value: T; icon?: LucideIcon}[];
};

export function SelectCarouselField<T>({name, label, options}: SelectCarouselFieldProps<T>) {
  const [field, meta, helpers] = useField<T>(name);

  const handleChange = (value: T) => {
    helpers.setValue(value);
  };

  return (
    <Fragment>
      {label && <Text>{label}</Text>}

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
          return <PressableChip item={item} isSelected={field.value === item.value} onChange={handleChange} />;
        }}
      />

      {meta.touched && meta.error && <Text className="text-red-500 mt-1">{meta.error}</Text>}
    </Fragment>
  );
}

function PressableChip<T>({
  onChange,
  item,
  isSelected,
}: {
  item: {label: string; value: T; icon?: LucideIcon};
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

export default SelectCarouselField;
