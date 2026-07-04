import {providerRepo, userRepo} from '@/db/repositories';
import {useFocusEffect} from '@react-navigation/native';
import {PlusIcon, Trash2Icon} from 'lucide-react-native';
import React, {useCallback, useState} from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import {WalletForm} from './Form';
import {useAlert} from '@/hooks';
import Toast from 'react-native-toast-message';

interface IWallet {
  id: string;
  providerId: string;
  identifier: string;
}

export const WalletList: React.FC = () => {
  const {alert} = useAlert();

  const [selectedWallet, setSelectedWallet] = useState<IWallet>();
  const [providerOptions, setProviderOptions] = useState<IOption<string>[]>([]);
  const [savedWallets, setSavedWallets] = useState<IWallet[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const fetchSavedProviders = useCallback(async () => {
    const providers = await providerRepo.findAll();
    setProviderOptions(providers.map(provider => ({label: provider.name, value: provider.id})));

    const wallets = await userRepo.getUserProviders();
    if (wallets)
      setSavedWallets(
        wallets?.map(e => ({
          id: e.user_providers.id,
          identifier: e.user_providers.identifier,
          providerId: e.user_providers.providerId,
        })),
      );
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSavedProviders();
    }, [fetchSavedProviders]),
  );

  const getProviderName = (providerId: string): string => {
    return providerOptions.find(e => e.value === providerId)?.label ?? '';
  };

  const handleRemoveWallet = async (id: string) => {
    alert({
      title: 'Remove saved Wallet',
      description: 'Are you sure to remove your saved wallet?',
      onConfirm: async () => {
        const result = await userRepo.removeUserProvider(id);

        if (result) {
          Toast.show({
            type: 'success',
            text1: 'Success!',
            text2: 'Wallet deleted successfully',
          });

          fetchSavedProviders();

          return;
        }

        Toast.show({
          type: 'error',
          text1: 'Error!',
          text2: 'Failed to delete wallet. Please try again.',
        });
      },
    });
  };

  return (
    <View className="flex flex-col gap-3">
      <Text className="font-medium text-base">Wallets</Text>
      <View className="flex flex-col gap-2">
        {savedWallets.map(wallet => (
          <WalletItem
            name={getProviderName(wallet.providerId)}
            identifier={wallet.identifier}
            onClick={() => {
              setSelectedWallet(wallet);
              setOpenModal(true);
            }}
            key={wallet.identifier}
            onRemove={() => handleRemoveWallet(wallet.id)}
          />
        ))}
        <Pressable
          className="main-button-container flex items-center justify-center"
          onPress={() => setOpenModal(true)}>
          <PlusIcon color={'white'} size={30} />
        </Pressable>
      </View>

      <WalletModal
        open={openModal}
        onClose={() => {
          setSelectedWallet(undefined);
          setOpenModal(false);
        }}
        providerOptions={providerOptions}
        selectedItem={selectedWallet}
        onRefetch={() => {
          fetchSavedProviders();
          setSelectedWallet(undefined);
          setOpenModal(false);
        }}
      />
    </View>
  );
};

interface IWalletItemProps {
  name: string;
  identifier: string;
  onClick: () => void;
  onRemove: () => void;
}

const WalletItem: React.FC<IWalletItemProps> = ({name, identifier, onClick, onRemove}) => {
  return (
    <Pressable
      className="flex flex-row justify-between px-5 py-3 border-gray-300 border rounded-2xl items-center"
      onPress={onClick}>
      <View className="flex flex-col gap-2">
        <Text>{name}</Text>
        <Text className="text-xs text-gray-600">{identifier}</Text>
      </View>
      <Trash2Icon size={24} color={'red'} onPress={onRemove} />
    </Pressable>
  );
};

interface IWalletModalProps {
  open: boolean;
  onClose: () => void;
  selectedItem?: IWallet;
  providerOptions: IOption<string>[];
  onRefetch: () => void;
}

const WalletModal: React.FC<IWalletModalProps> = ({open, onClose, providerOptions, selectedItem, onRefetch}) => {
  return (
    <Modal visible={open} transparent animationType="slide">
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}>
        <Pressable style={{flex: 1}} onPress={onClose} />

        <View className="h-[50%] bg-white rounded-t-2xl p-4 flex-1">
          <WalletForm selectedItem={selectedItem} providerOptions={providerOptions} onRefetch={onRefetch} />
        </View>
      </View>
    </Modal>
  );
};
