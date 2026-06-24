import {formatDate} from '@/helpers';
import {useField} from 'formik';
import React, {Fragment, useState} from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import DateTimePicker, {DateType, useDefaultStyles} from 'react-native-ui-datepicker';

type DateinputFieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
};

type IDateRange = {
  startDate: DateType | Date;
  endDate: DateType | Date;
};

export const DateInputField: React.FC<DateinputFieldProps> = ({name, label, placeholder = 'Select Date Range'}) => {
  const [field, meta, helpers] = useField<IDateRange>(name);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const value = field.value;
  const isEmpty = field.value === undefined;

  const handleOnChange = (selectedRange: IDateRange) => {
    helpers.setValue(selectedRange);
  };

  return (
    <Fragment>
      {label && <Text>{label}</Text>}

      <Pressable
        onPress={() => setIsOpen(true)}
        className={`input-field ${meta.touched && meta.error ? 'input-field-error' : ''}`}>
        <Text className={`${isEmpty ? 'text-gray-500' : ''}`}>
          {isEmpty
            ? placeholder
            : `${formatDate(value.startDate?.toString())} - ${formatDate(value.endDate?.toString())}`}
        </Text>
      </Pressable>

      {meta.touched && meta.error && <Text className="text-red-500 mt-1">{meta.error}</Text>}

      <DateSelectDialog
        open={isOpen}
        onChange={selectedRange => handleOnChange(selectedRange)}
        onClose={() => setIsOpen(false)}
        value={field.value}
      />
    </Fragment>
  );
};

type DateSelectDialogProps = {
  open: boolean;
  onClose: () => void;
  onChange: (value: IDateRange) => void;
  modalLabel?: string;
  value: IDateRange;
};

const DateSelectDialog: React.FC<DateSelectDialogProps> = ({open, onClose, onChange, modalLabel = 'Select', value}) => {
  const defaultStyles = useDefaultStyles();
  const [range, setRange] = useState<IDateRange>(value);

  const onConfirm = (dateRangeValue: IDateRange) => {
    onClose();
    onChange({
      startDate: dateRangeValue.startDate?.toString(),
      endDate: dateRangeValue.endDate?.toString(),
    });
  };

  return (
    <Modal visible={open} transparent animationType="slide">
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}>
        <Pressable style={{flex: 1}} onPress={onClose} />

        <View className="h-[50%] bg-white rounded-t-2xl p-4">
          <Text className="text-xs mb-3">{modalLabel}</Text>

          <DateTimePicker
            mode="range"
            startDate={range.startDate}
            endDate={range.endDate}
            onChange={dates => {
              setRange({
                startDate: dates.startDate,
                endDate: dates.endDate,
              });
            }}
            styles={defaultStyles}
          />

          <Pressable
            onPress={() => {
              onConfirm(range);
            }}
            className="mt-3 p-3 bg-[#007AFF] rounded-md">
            <Text className="text-white text-center">Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
