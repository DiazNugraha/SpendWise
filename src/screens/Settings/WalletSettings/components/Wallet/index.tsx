import {providerRepo} from '@/db/repositories';
import {useFocusEffect} from '@react-navigation/native';
import {ChevronRight} from 'lucide-react-native';
import React, {useCallback, useState} from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import {WalletForm} from './Form';

interface IWallet {
  providerId: string;
  identifier: string;
}

export const WalletList: React.FC = () => {
  const [selectedWallet, setSelectedWallet] = useState<IWallet>();
  const [providerOptions, setProviderOptions] = useState<IOption<string>[]>([]);

  const fetchProviderOptions = useCallback(async () => {
    const providers = await providerRepo.findAll();
    setProviderOptions(providers.map(provider => ({label: provider.name, value: provider.id})));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProviderOptions();
    }, [fetchProviderOptions]),
  );

  const walletsDummy: IWallet[] = [
    {
      providerId: 'cf572b0d-a90c-4ffa-8089-bd2dea2cafba',
      identifier: '0912382123',
    },
  ];

  const getProviderName = (providerId: string): string => {
    return providerOptions.find(e => e.value === providerId)?.label ?? '';
  };

  return (
    <View className="flex flex-col gap-3">
      <Text className="font-medium text-base">Wallets</Text>
      <View className="flex flex-col gap-2">
        {walletsDummy.map(wallet => (
          <WalletItem
            name={getProviderName(wallet.providerId)}
            identifier={wallet.identifier}
            onClick={() => setSelectedWallet(wallet)}
            key={wallet.identifier}
          />
        ))}
      </View>

      <WalletModal
        open={!!selectedWallet}
        onClose={() => setSelectedWallet(undefined)}
        providerOptions={providerOptions}
        selectedItem={selectedWallet}
      />
    </View>
  );
};

interface IWalletItemProps {
  name: string;
  identifier: string;
  onClick: () => void;
}

const WalletItem: React.FC<IWalletItemProps> = ({name, identifier, onClick}) => {
  return (
    <Pressable
      className="flex flex-row justify-between px-5 py-3 border-gray-300 border rounded-2xl items-center"
      onPress={onClick}>
      <View className="flex flex-col gap-2">
        <Text>{name}</Text>
        <Text className="text-xs text-gray-600">{identifier}</Text>
      </View>
      <ChevronRight size={24} />
    </Pressable>
  );
};

interface IWalletModalProps {
  open: boolean;
  onClose: () => void;
  selectedItem?: IWallet;
  providerOptions: IOption<string>[];
}

const WalletModal: React.FC<IWalletModalProps> = ({open, onClose, providerOptions, selectedItem}) => {
  return (
    <Modal visible={open} transparent animationType="slide">
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}>
        <Pressable style={{flex: 1}} onPress={onClose} />

        <View className="h-[50%] bg-white rounded-t-2xl p-4 flex-1">
          <WalletForm selectedItem={selectedItem} providerOptions={providerOptions} />
        </View>
      </View>
    </Modal>
  );
};
