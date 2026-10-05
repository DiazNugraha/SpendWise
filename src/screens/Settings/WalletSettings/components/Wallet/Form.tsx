import {InputField, SelectCarouselField} from '@/components';
import {useUserRepo} from '@/hooks';
import {useFocusEffect} from '@react-navigation/native';
import {Formik, FormikProps} from 'formik';
import {useCallback, useMemo, useRef, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {providerOptions as providerOptionCollections} from '@/constants/options';
import * as yup from 'yup';

interface IWallet {
  id: string;
  identifier: string;
  description: string | null;
}

const walletSchema = yup.object({
  description: yup.string().default('').required('Identifier is required'),
  identifier: yup.string().default('').required('Identifier is required'),
});

type IWalletInput = yup.InferType<typeof walletSchema>;

interface IWalletModalProps {
  selectedItem?: IWallet;
  onRefetch: () => void;
}

export const WalletForm: React.FC<IWalletModalProps> = ({selectedItem, onRefetch}) => {
  const userRepo = useUserRepo();

  const formRef = useRef<FormikProps<IWalletInput>>(null);

  const [providerOptions, setProviderOptions] = useState<IOption<string>[]>([]);

  const handleOnSubmit = async (value: IWalletInput) => {
    let result = null;

    if (selectedItem) {
      result = await userRepo.updateUserProvider(selectedItem.id, {
        ...value,
      });
    } else {
      result = await userRepo.createUserProvider({...value});
    }

    if (result) {
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: `Wallet ${selectedItem ? 'updated' : 'created'} successfully`,
      });

      onRefetch();

      return;
    }

    Toast.show({
      type: 'error',
      text1: 'Error!',
      text2: `Failed to ${selectedItem ? 'update' : 'create'} wallet. Please try again.`,
    });
  };

  const initialValues = useMemo(() => walletSchema.getDefault(), []);

  const fetchProviderOptions = useCallback(async () => {
    const providers = providerOptionCollections;

    const wallets = await userRepo.getUserProviders();

    const walletCollection = wallets?.map(e => e.providers?.value ?? '') ?? [];

    setProviderOptions(
      providers
        .filter(e => !walletCollection.includes(e.value))
        .map(provider => ({label: provider.label, value: provider.value})),
    );
  }, [userRepo]);

  useFocusEffect(
    useCallback(() => {
      if (!formRef.current) return;

      fetchProviderOptions();

      if (selectedItem) {
        formRef.current.resetForm({
          values: walletSchema.cast({
            identifier: selectedItem.identifier,
            description: selectedItem.description,
          }),
        });
      } else {
        formRef.current.resetForm({values: initialValues});
      }
    }, [selectedItem, initialValues, fetchProviderOptions]),
  );

  return (
    <Formik innerRef={formRef} initialValues={initialValues} validationSchema={walletSchema} onSubmit={handleOnSubmit}>
      {({handleSubmit}) => (
        <View className="flex flex-col flex-1 justify-between">
          <View className="flex flex-col gap-2">
            {!selectedItem && (
              <SelectCarouselField name="identifier" label="Provider" required options={providerOptions} />
            )}
            <InputField name="description" label="Identifier" required placeholder="Your wallet identifier" />
          </View>
          <Pressable className="main-button-container" onPress={handleSubmit}>
            <Text className="font-medium text-white">Submit</Text>
          </Pressable>
        </View>
      )}
    </Formik>
  );
};
