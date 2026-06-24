import {CalendarIcon, Hamburger, LucideIcon, TargetIcon} from 'lucide-react-native';
import {Fragment, useState} from 'react';
import {FlatList, Modal, Pressable, StyleProp, Text, View, ViewStyle} from 'react-native';

type Props = {
  value: LucideIcon;
  onChange: (value: LucideIcon) => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export const IconSelector: React.FC<Props> = ({value, onChange, className, style}) => {
  const Icon = value;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Fragment>
      <Pressable className={className} style={style} onPress={() => setOpen(!open)}>
        <Icon color={'white'} />
      </Pressable>

      <IconPickerDialog open={open} value={value} onChange={onChange} onClose={() => setOpen(false)} />
    </Fragment>
  );
};

const iconOptions: LucideIcon[] = [CalendarIcon, TargetIcon, Hamburger];

type IconPickerDialogProps = {
  value: LucideIcon;
  onClose: () => void;
  onChange: (value: LucideIcon) => void;
  open: boolean;
};

const IconPickerDialog: React.FC<IconPickerDialogProps> = ({open, value, onClose, onChange}) => {
  return (
    <Modal visible={open} transparent animationType="slide">
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}>
        <Pressable style={{flex: 1}} onPress={onClose} />

        <View className="h-[50%] bg-white rounded-t-2xl p-4">
          <FlatList
            data={iconOptions}
            keyExtractor={(_, index) => index.toString()}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{gap: 12}}
            columnWrapperStyle={{gap: 12}}
            renderItem={({item}) => {
              const Icon = item;
              return (
                <Pressable
                  className="items-center rounded-2xl p-5"
                  style={{
                    backgroundColor: value === item ? '#f0f0f0' : '#fff',
                  }}
                  onPress={() => onChange(item)}>
                  <Icon color="black" />
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
};
