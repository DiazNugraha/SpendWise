import {useField} from 'formik';
import {Fragment, useState} from 'react';
import {FlatList, Modal, Pressable, Text, View} from 'react-native';

type SelectFieldProps<T extends string | number> = {
  name: string;
  label?: string;
  options: {label: string; value: T}[];
  modalLabel?: string;
  placeholder?: string;
  required?: boolean;
};

export function SelectField<T extends string | number>({
  name,
  label,
  options,
  modalLabel,
  placeholder = 'Select Options',
  required,
}: SelectFieldProps<T>) {
  const [field, meta, helpers] = useField<T>(name);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const value = field.value ?? undefined;
  const isEmpty = value.toString().length < 1;

  return (
    <Fragment>
      {label && (
        <Text>
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
      )}

      <Pressable
        onPress={() => setIsOpenModal(true)}
        className={`input-field ${meta.touched && meta.error ? 'input-field-error' : ''}`}>
        <Text className={`${isEmpty ? 'text-gray-500' : ''}`}>{isEmpty ? placeholder : value}</Text>
      </Pressable>

      {meta.touched && meta.error && <Text className="text-red-500 mt-1">{meta.error}</Text>}

      <SelectDialog
        open={isOpenModal}
        onClose={() => {
          helpers.setTouched(true);
          setIsOpenModal(false);
        }}
        options={options}
        value={value}
        onChange={helpers.setValue}
        modalLabel={modalLabel}
      />
    </Fragment>
  );
}

type SelectDialogProps<T extends string | number> = {
  open: boolean;
  onClose: () => void;
  options: {label: string; value: T}[];
  value: T;
  onChange: (value: T) => void;
  modalLabel?: string;
};

function SelectDialog<T extends string | number>({
  open,
  onClose,
  options,
  value,
  onChange,
  modalLabel,
}: SelectDialogProps<T>) {
  const toggle = (selectedValue: T) => {
    onChange(selectedValue);
  };

  return (
    <Modal visible={open} transparent animationType="slide">
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}>
        <Pressable style={{flex: 1}} onPress={onClose} />

        <View className="h-[50%] bg-white rounded-t-2xl p-4">
          <Text className="text-xs mb-3">{modalLabel}</Text>
          <FlatList
            data={options}
            keyExtractor={item => String(item.value)}
            renderItem={({item}) => {
              const selected = value == item.value;

              return (
                <Pressable
                  onPress={() => toggle(item.value)}
                  className={`p-3 border border-b-[1px] border-[#eee] ${selected ? 'bg-[#e6f0ff]' : 'bg-white'}`}>
                  <Text>
                    {item.label} {selected ? '✓' : ''}
                  </Text>
                </Pressable>
              );
            }}
          />

          <Pressable onPress={onClose} className="mt-3 p-3 bg-[#007AFF] rounded-md">
            <Text className="text-white text-center">Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
