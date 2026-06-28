import {useField} from 'formik';
import {ChevronDown as ChevronDownIcon} from 'lucide-react-native';
import {Fragment, useState} from 'react';
import {FlatList, Modal, Pressable, Text, View} from 'react-native';

type MultiSelectFieldProps<T extends string | number> = {
  name: string;
  label?: string;
  options: {label: string; value: T}[];
  modalLabel?: string;
  placeholder?: string;
  required?: boolean;
};

export function MultiSelectField<T extends string | number>({
  name,
  label,
  options,
  modalLabel,
  placeholder = 'Select Options',
  required,
}: MultiSelectFieldProps<T>) {
  const [field, meta, helpers] = useField<T[]>(name);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const values = field.value ?? [];
  const isEmpty = values.length === 0;

  const getLabelByValue = (value: T) => {
    return options.find(e => e.value === value)?.label ?? '';
  };

  return (
    <Fragment>
      {label && (
        <Text>
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
      )}

      <Pressable
        onPress={() => setIsOpenModal(true)}
        className={`input-field ${meta.touched && meta.error ? 'input-field-error' : ''} relative`}>
        <Text className={`${isEmpty ? 'text-gray-500' : ''}`}>
          {isEmpty ? placeholder : [...values.map(e => getLabelByValue(e))].join(', ')}
        </Text>
        <View className="absolute right-3 top-5">
          <ChevronDownIcon color={'#6b7280'} />
        </View>
      </Pressable>

      {meta.touched && meta.error && <Text className="text-red-500 mt-1">{meta.error}</Text>}

      <MultiSelectDialog
        open={isOpenModal}
        onClose={() => {
          helpers.setTouched(true);
          setIsOpenModal(false);
        }}
        options={options}
        values={values}
        onChange={helpers.setValue}
        modalLabel={modalLabel}
      />
    </Fragment>
  );
}

type MultiSelectDialogProps<T extends string | number> = {
  open: boolean;
  onClose: () => void;
  options: {label: string; value: T}[];
  values: T[];
  onChange: (values: T[]) => void;
  modalLabel?: string;
};

function MultiSelectDialog<T extends string | number>({
  open,
  onClose,
  options,
  values,
  onChange,
  modalLabel = 'Select',
}: MultiSelectDialogProps<T>) {
  const toggle = (value: T) => {
    if (values.includes(value)) {
      onChange(values.filter(v => v !== value));
    } else {
      onChange([...values, value]);
    }
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
              const selected = values.includes(item.value);

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

          <Pressable onPress={onClose} className="py-5 px-6 rounded-2xl items-center justify-center bg-[#6D28D9]">
            <Text className="text-white text-center font-medium">Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
