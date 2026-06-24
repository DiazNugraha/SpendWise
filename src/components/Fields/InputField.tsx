import {useField} from 'formik';
import {Text, TextInput, View} from 'react-native';

type InputFieldProp = {
  name: string;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  type?: 'number' | 'text';
};

export const InputField: React.FC<InputFieldProp> = ({
  name,
  label,
  placeholder,
  secureTextEntry,
  multiline,
  numberOfLines,
  type = 'text',
}) => {
  const [field, meta, helpers] = useField(name);
  const isNumeric = type === 'number';

  return (
    <View>
      {label && <Text>{label}</Text>}

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
        className={`input-field ${meta.touched && meta.error ? 'input-field-error' : ''}`}
      />

      {meta.touched && meta.error && <Text className="text-red-500 mt-1">{meta.error}</Text>}
    </View>
  );
};
