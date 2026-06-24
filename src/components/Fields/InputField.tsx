import {useField} from 'formik';
import {Fragment} from 'react';
import {Text, TextInput} from 'react-native';

type InputFieldProp = {
  name: string;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  type?: 'number' | 'text';
  required?: boolean;
};

export const InputField: React.FC<InputFieldProp> = ({
  name,
  label,
  placeholder,
  secureTextEntry,
  multiline,
  numberOfLines,
  type = 'text',
  required,
}) => {
  const [field, meta, helpers] = useField(name);
  const isNumeric = type === 'number';

  return (
    <Fragment>
      {label && (
        <Text>
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
      )}

      <TextInput
        keyboardType={isNumeric ? 'numeric' : 'default'}
        value={field.value}
        onChangeText={value => {
          if (!isNumeric) {
            helpers.setValue(value);
            return;
          }

          if (value === '') {
            helpers.setValue(undefined as any);
            return;
          }

          const num = Number(value);
          if (!Number.isNaN(num)) {
            helpers.setValue(num);
          }
        }}
        onBlur={() => helpers.setTouched(true)}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        className={`input-field ${meta.touched && meta.error ? 'input-field-error' : ''} ${multiline ? 'h-32' : ''}`}
        textAlignVertical="top"
      />

      {meta.touched && meta.error && <Text className="text-red-500 mt-1">{meta.error}</Text>}
    </Fragment>
  );
};
