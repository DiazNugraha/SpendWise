import {useField} from 'formik';
import {LucideIcon} from 'lucide-react-native';
import {Fragment} from 'react';
import {FlatList, Pressable, Text} from 'react-native';

type ItemStyle = 'chip' | 'card';

type SelectMultiCarouselFieldProps<T> = {
  name: string;
  label?: string;
  options: {label: string; value: T; icon?: LucideIcon}[];
  itemStyle?: ItemStyle;
  required?: boolean;
};

export function SelectMultiCarouselField<T>({
  name,
  label,
  options,
  itemStyle = 'chip',
  required,
}: SelectMultiCarouselFieldProps<T>) {
  const [field, meta, helpers] = useField<T[]>(name);

  const values = field.value;

  const handleChange = (value: T) => {
    if (values.includes(value)) {
      helpers.setValue(values.filter(e => e !== value));
    } else {
      helpers.setValue([...values, value]);
    }
  };

  return (
    <Fragment>
      {label && (
        <Text>
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
      )}

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
          return (
            <PressableChip
              item={item}
              isSelected={values.includes(item.value)}
              onChange={handleChange}
              itemStyle={itemStyle}
            />
          );
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
  itemStyle,
}: {
  item: {label: string; value: T; icon?: LucideIcon};
  onChange: (value: T) => void;
  isSelected: boolean;
  itemStyle: ItemStyle;
}) {
  const Icon = item.icon;
  const style: string =
    itemStyle === 'chip'
      ? 'px-5 py-3 flex flex-row gap-2 rounded-3xl'
      : 'p-5 flex flex-col gap-2 rounded-3xl w-[100px]';

  const selectedStyle: string = itemStyle === 'chip' ? 'bg-[#6D28D9]' : 'border border-[#6D28D9] bg-[#6D28D9]/5';
  const selectedTextStyle: string = itemStyle === 'chip' ? 'text-[#fff]' : 'text-[#6D28D9]';
  const selectedIconStyle: string = itemStyle === 'chip' ? 'white' : '#6D28D9';

  return (
    <Pressable
      onPress={() => onChange(item.value)}
      className={`items-center justify-center ${style} ${
        isSelected ? `${selectedStyle}` : 'border border-[#eee] bg-white'
      }`}>
      {Icon && <Icon size={16} color={isSelected ? `${selectedIconStyle}` : '#6b7280'} />}
      <Text numberOfLines={1} className={`font-medium ${isSelected ? `${selectedTextStyle}` : 'text-gray-500'}`}>
        {item.label}
      </Text>
    </Pressable>
  );
}

export default SelectMultiCarouselField;
