import {useField} from 'formik';
import {LucideIcon} from 'lucide-react-native';
import {Fragment} from 'react';
import {Text} from 'react-native';
import {CarouselChips} from '../Buttons';

type SelectCarouselFieldProps<T> = {
  name: string;
  label?: string;
  options: {label: string; value: T; icon?: LucideIcon}[];
};

export function SelectCarouselField<T>({name, label, options}: SelectCarouselFieldProps<T>) {
  const [field, meta, helpers] = useField<T>(name);

  const handleChange = (value: T | T[]) => {
    if (typeof value === 'string') {
      helpers.setValue(value);
    }
  };

  return (
    <Fragment>
      {label && <Text>{label}</Text>}
      <CarouselChips onChange={handleChange} options={options} value={field.value} />

      {meta.touched && meta.error && <Text className="text-red-500 mt-1">{meta.error}</Text>}
    </Fragment>
  );
}

export default SelectCarouselField;
