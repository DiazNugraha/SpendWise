import {NumberFormatter} from '@/helpers';
import {useField} from 'formik';
import {Fragment, useState} from 'react';
import {Text, TextInput, TextInputProps} from 'react-native';

type DecimalInputFieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
} & TextInputProps;

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

export const DecimalInputField: React.FC<DecimalInputFieldProps> = ({name, label, placeholder, className}) => {
  const [field, meta, helpers] = useField<number>(name);
  const [display, setDisplay] = useState('');

  return (
    <Fragment>
      {label && <Text>{label}</Text>}

      <TextInput
        keyboardType="decimal-pad"
        placeholder={placeholder}
        value={display}
        onChangeText={text => {
          setDisplay(text);
          const parsed = NumberFormatter.parse(text);
          if (parsed !== null) {
            helpers.setValue(parsed);
          }
        }}
        autoFocus
        onBlur={() => {
          helpers.setTouched(true);
          if (typeof field.value === 'number') {
            setDisplay(formatter.format(field.value));
          }
        }}
        className={className ? className : `input-field ${meta.touched && meta.error ? 'input-field-error' : ''}`}
      />

      {meta.touched && meta.error && <Text className="text-red-500 mt-1">{meta.error}</Text>}
    </Fragment>
  );
};
