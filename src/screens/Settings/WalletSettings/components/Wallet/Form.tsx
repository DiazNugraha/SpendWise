import {InputField, SelectCarouselField} from '@/components';
import {providerRepo, userRepo} from '@/db/repositories';
import {useFocusEffect} from '@react-navigation/native';
import {Formik, FormikProps} from 'formik';
import {useCallback, useMemo, useRef, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';

interface IWallet {
  id: string;
  providerId: string;
  identifier: string;
}

const walletSchema = yup.object({
  providerId: yup.string().default('').required('Provider is required'),
  identifier: yup.string().default('').required('Identifier is required'),
});

type IWalletInput = yup.InferType<typeof walletSchema>;

interface IWalletModalProps {
  selectedItem?: IWallet;
  onRefetch: () => void;
}

export const WalletForm: React.FC<IWalletModalProps> = ({selectedItem, onRefetch}) => {
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
    const providers = await providerRepo.findAll();

    const wallets = await userRepo.getUserProviders();

    const walletCollection = wallets?.map(e => e.providers?.name ?? '') ?? [];

    setProviderOptions(
      providers
        .filter(e => !walletCollection.includes(e.name))
        .map(provider => ({label: provider.name, value: provider.id})),
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!formRef.current) return;

      fetchProviderOptions();

      if (selectedItem) {
        formRef.current.resetForm({
          values: walletSchema.cast({
            identifier: selectedItem.identifier,
            providerId: selectedItem.providerId,
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
              <SelectCarouselField name="providerId" label="Provider" required options={providerOptions} />
            )}
            <InputField name="identifier" label="Identifier" required placeholder="Your wallet identifier" />
          </View>
          <Pressable className="main-button-container" onPress={handleSubmit}>
            <Text className="font-medium text-white">Submit</Text>
          </Pressable>
        </View>
      )}
    </Formik>
  );
};
