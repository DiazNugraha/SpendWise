import {SelectField} from '@/components';
import {currencyOptions} from '@/constants/options';
import {useProfile, useUserRepo} from '@/hooks';
import {useFocusEffect} from '@react-navigation/native';
import {Formik, FormikProps} from 'formik';
import {useCallback, useMemo, useRef} from 'react';
import {View} from 'react-native';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';

const currencySchema = yup.object({
  currency: yup.string().default(''),
});

type ICurrencyInput = yup.InferType<typeof currencySchema>;

export const CurrencyForm: React.FC = () => {
  const {onRefetch: onRefetchUserProfile} = useProfile();
  const userRepo = useUserRepo();

  const formRef = useRef<FormikProps<ICurrencyInput>>(null);

  const initialValues = useMemo(() => currencySchema.getDefault(), []);

  const handleChange = async (value: ICurrencyInput) => {
    const updatedUser = await userRepo.setPrimaryCurrencyCode(value.currency);

    if (updatedUser) {
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Currency updated successfully',
      });

      onRefetchUserProfile();
      return;
    }

    Toast.show({
      type: 'error',
      text1: 'Error!',
      text2: 'Failed to update Currency. Please try again.',
    });
  };

  const fetchUserCurrency = useCallback(async () => {
    const user = await userRepo.find();
    const currencyCode = user[0]?.primaryCurrencyCode ?? undefined;
    if (currencyCode) {
      formRef.current?.resetForm({
        values: {
          currency: currencyCode,
        },
      });
    } else {
      formRef.current?.resetForm({values: initialValues});
    }
  }, [initialValues, userRepo]);

  useFocusEffect(
    useCallback(() => {
      if (!formRef.current) return;

      fetchUserCurrency();
    }, [fetchUserCurrency]),
  );

  return (
    <Formik innerRef={formRef} initialValues={initialValues} validationSchema={currencySchema} onSubmit={handleChange}>
      {({handleSubmit}) => (
        <View className="flex flex-col gap-3">
          <SelectField name="currency" options={currencyOptions} onChange={() => handleSubmit()} />
        </View>
      )}
    </Formik>
  );
};
