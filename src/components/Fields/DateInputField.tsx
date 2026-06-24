import {formatDate} from '@/helpers';
import {useField} from 'formik';
import React, {Fragment, useState} from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import DateTimePicker, {DateType} from 'react-native-ui-datepicker';

type DateinputFieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
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
}) => {
  const [field, meta, helpers] = useField<IDateRange>(name);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const value = field.value;
  const isEmpty = field.value === undefined;

  const handleOnChange = (selectedRange: IDateRange) => {
    helpers.setValue(selectedRange);
  };

  return (
    <Fragment>
      {label && (
        <Text>
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
      )}

      <Pressable
        onPress={() => setIsOpen(true)}
        className={`input-field ${meta.touched && meta.error ? 'input-field-error' : ''}`}
        disabled={disabled}>
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

        <View className="h-[50%] bg-white rounded-t-2xl p-4 flex-1 bg-[#F5FCFF]">
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
            classNames={{
              // Component Containers (for background colors, layout padding, margins)
              day: 'flex-1 items-center justify-center py-2',
              header: 'flex-row justify-between items-center px-4 py-2',

              // Literal Text Targets (THIS makes the text visible)
              day_label: 'text-neutral-900 font-medium', // Individual day text
              weekday_label: 'text-neutral-500 font-medium', // Su, Mo, Tu column labels

              // Highlight Styles for your Range Selection
              range_fill: 'bg-blue-100', // Mid-range highlight color
              selected: 'bg-blue-600 rounded-full', // Start & End bubble shape
              selected_label: 'text-white font-bold', // Forces selection text to be white
            }}
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
