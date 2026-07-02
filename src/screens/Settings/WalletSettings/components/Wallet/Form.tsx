import {InputField, SelectCarouselField} from '@/components';
import {useFocusEffect} from '@react-navigation/native';
import {Formik, FormikProps} from 'formik';
import {useCallback, useMemo, useRef} from 'react';
import {Pressable, Text, View} from 'react-native';
import * as yup from 'yup';

interface IWallet {
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
  providerOptions: IOption<string>[];
}

export const WalletForm: React.FC<IWalletModalProps> = ({providerOptions, selectedItem}) => {
  const formRef = useRef<FormikProps<IWalletInput>>(null);

  const onSubmit = async (value: IWalletInput) => {
    console.log('wallet input value', value);
  };

  const initialValues = useMemo(() => walletSchema.getDefault(), []);

  useFocusEffect(
    useCallback(() => {
      if (!formRef.current) return;

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
    }, [selectedItem, initialValues]),
  );
  return (
    <Formik innerRef={formRef} initialValues={initialValues} validationSchema={walletSchema} onSubmit={onSubmit}>
      {({handleSubmit}) => (
        <View className="flex flex-col flex-1 justify-between">
          <View className="flex flex-col gap-2">
            <SelectCarouselField name="providerId" label="Provider" required options={providerOptions} />
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
