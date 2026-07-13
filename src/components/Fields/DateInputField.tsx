import {useField} from 'formik';
import React, {Fragment} from 'react';
import {Text} from 'react-native';
import {DateType} from 'react-native-ui-datepicker';
import {DatePicker} from '../Buttons';

type DateinputFieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  minDate?: Date;
};

type IDateRange = {
  startDate: DateType | Date;
  endDate: DateType | Date;
};

export const DateInputField: React.FC<DateinputFieldProps> = ({
  name,
  disabled = false,
  label,
  placeholder = 'Select Date Range',
  required,
  minDate,
}) => {
  const [field, meta, helpers] = useField<IDateRange>(name);

  return (
    <Fragment>
      {label && (
        <Text>
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
      )}

      <DatePicker
        onChange={val => helpers.setValue(val)}
        minDate={minDate}
        value={field.value}
        placeholder={placeholder}
        disabled={disabled}
        error={!!(meta.touched && meta.error)}
      />

      {meta.touched && meta.error && <Text className="text-red-500 mt-1">{meta.error}</Text>}
    </Fragment>
  );
};
