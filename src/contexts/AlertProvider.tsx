import {AlertCircleIcon} from 'lucide-react-native';
import React, {createContext, PropsWithChildren, useCallback, useState} from 'react';
import {Modal, Pressable, Text, View} from 'react-native';

interface ConfirmState {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  hideCancelButton?: boolean;
  content?: React.ReactElement;
}

interface ConfirmOptions {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  hideCancelButton?: boolean;
  content?: React.ReactElement;
}

interface IAlertContext {
  alert: (options: ConfirmOptions) => void;
}

export const AlertContext = createContext<IAlertContext | null>(null);

const AlertProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [alertState, setAlertState] = useState<ConfirmState>({
    open: false,
    title: '',
    onConfirm: () => {},
    onCancel: () => {},
    confirmButtonLabel: '',
    cancelButtonLabel: '',
    hideCancelButton: false,
  });

  const alert = useCallback(
    ({
      title,
      description,
      onConfirm,
      onCancel,
      cancelButtonLabel,
      confirmButtonLabel,
      hideCancelButton,
      content,
    }: ConfirmOptions) => {
      setAlertState({
        open: true,
        title,
        description,
        onConfirm: () => {
          setAlertState(prev => ({...prev, open: false}));
          if (onConfirm) {
            onConfirm();
          }
        },
        onCancel: () => {
          setAlertState(prev => ({...prev, open: false}));
          if (onCancel) onCancel();
        },
        cancelButtonLabel: cancelButtonLabel ?? 'Cancel',
        confirmButtonLabel: confirmButtonLabel ?? 'Confirm',
        hideCancelButton: hideCancelButton,
        content: content,
      });
    },
    [],
  );

  return (
    <AlertContext.Provider value={{alert}}>
      {children}
      <Modal visible={alertState.open} animationType="fade" transparent={true}>
        <Pressable
          style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}
          onPress={alertState.onCancel}>
          <Pressable
            className="w-[300px] p-5 flex flex-col items-center bg-white rounded-2xl gap-4"
            onPress={e => e.stopPropagation()}>
            <View className="p-3 rounded-full flex items-center justify-center bg-[#6D28D9]/10">
              <AlertCircleIcon color={'#6D28D9'} />
            </View>
            <Text className="text-base text-black font-medium">{alertState.title}</Text>
            {alertState.description && (
              <Text className="text-sm text-center text-slate-500">{alertState.description}</Text>
            )}

            {alertState.content}

            <View className="flex flex-col gap-2 w-full">
              {!alertState.hideCancelButton && (
                <Pressable
                  className="py-5 px-6 rounded-2xl items-center bg-white border-slate-500 border"
                  onPress={() => alertState.onCancel()}>
                  <Text className="text-slate-500 font-medium">{alertState.cancelButtonLabel}</Text>
                </Pressable>
              )}
              <Pressable
                className="py-5 px-6 rounded-2xl items-center bg-[#6D28D9]"
                onPress={() => alertState.onConfirm()}>
                <Text className="text-white font-medium">{alertState.confirmButtonLabel}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </AlertContext.Provider>
  );
};

export default AlertProvider;
