import {useFocusEffect} from '@react-navigation/native';
import {PlusIcon, Trash2Icon} from 'lucide-react-native';
import React, {useCallback, useState} from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import {WalletForm} from './Form';
import {useAlert, useUserRepo} from '@/hooks';
import Toast from 'react-native-toast-message';
import {displayProviderIcon} from '@/constants';

interface IWallet {
  id: string;
  name: string;
  identifier: string;
  description: string | null;
}

export const WalletList: React.FC = () => {
  const {alert} = useAlert();
  const userRepo = useUserRepo();

  const [selectedWallet, setSelectedWallet] = useState<IWallet>();
  const [savedWallets, setSavedWallets] = useState<IWallet[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const fetchSavedProviders = useCallback(async () => {
    const wallets = await userRepo.getUserProviders();

    if (wallets)
      setSavedWallets(
        wallets?.map(e => ({
          id: e.user_providers.id,
          name: e.providers?.label ?? '',
          identifier: e.user_providers.identifier,
          description: e.user_providers.description,
        })),
      );
  }, [userRepo]);

  useFocusEffect(
    useCallback(() => {
      fetchSavedProviders();
    }, [fetchSavedProviders]),
  );

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
            wallet={wallet}
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
  wallet: IWallet;
  onClick: () => void;
  onRemove: () => void;
}

const WalletItem: React.FC<IWalletItemProps> = ({wallet, onClick, onRemove}) => {
  const {name, identifier, description} = wallet;

  return (
    <Pressable
      className="flex flex-row justify-between px-5 py-3 border-gray-300 border rounded-2xl items-center"
      onPress={() => {
        if (identifier !== 'cash') onClick();
      }}>
      <View className="flex flex-row gap-2 items-center">
        {displayProviderIcon(wallet.identifier)}
        <View className="flex flex-col gap-2">
          <Text>{name}</Text>
          {identifier !== 'cash' && description !== null && (
            <Text className="text-xs text-gray-600">{description}</Text>
          )}
        </View>
      </View>
      {identifier !== 'cash' && <Trash2Icon size={24} color={'red'} onPress={onRemove} />}
    </Pressable>
  );
};

interface IWalletModalProps {
  open: boolean;
  onClose: () => void;
  selectedItem?: IWallet;
  onRefetch: () => void;
}

const WalletModal: React.FC<IWalletModalProps> = ({open, onClose, selectedItem, onRefetch}) => {
  return (
    <Modal visible={open} transparent animationType="slide">
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}>
        <Pressable style={{flex: 1}} onPress={onClose} />

        <View className="h-[50%] bg-white rounded-t-2xl p-4 flex-1">
          <WalletForm selectedItem={selectedItem} onRefetch={onRefetch} />
        </View>
      </View>
    </Modal>
  );
};
