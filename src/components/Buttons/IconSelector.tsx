import {CalendarIcon, Hamburger, LucideIcon, TargetIcon} from 'lucide-react-native';
import {Fragment, useState} from 'react';
import {FlatList, Modal, Pressable, StyleProp, Text, View, ViewStyle} from 'react-native';
import * as Icons from 'lucide-react-native';

type Props = {
  value: keyof typeof Icons;
  onChange: (value: string) => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export const IconSelector: React.FC<Props> = ({value, onChange, className, style}) => {
  const Icon = Icons[value] as Icons.LucideIcon;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Fragment>
      <Pressable className={className} style={style} onPress={() => setOpen(!open)}>
        <Icon color={'white'} />
      </Pressable>

      <IconPickerDialog open={open} value={Icon} onChange={onChange} onClose={() => setOpen(false)} />
    </Fragment>
  );
};

const iconOptions: {
  name: string;
  icon: LucideIcon;
}[] = [
  {
    name: 'Calendar',
    icon: CalendarIcon,
  },
  {
    name: 'Target',
    icon: TargetIcon,
  },
  {
    name: 'Hamburger',
    icon: Hamburger,
  },
];

type IconPickerDialogProps = {
  value: LucideIcon;
  onClose: () => void;
  onChange: (value: string) => void;
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
              const Icon = item.icon;
              return (
                <Pressable
                  className="items-center rounded-2xl p-5"
                  style={{
                    backgroundColor: value === item.icon ? '#f0f0f0' : '#fff',
                  }}
                  onPress={() => onChange(item.name)}>
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
