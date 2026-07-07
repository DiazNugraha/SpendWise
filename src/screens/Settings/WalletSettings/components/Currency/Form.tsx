import {SelectField} from '@/components';
import {userRepo} from '@/db/repositories';
import {useProfile} from '@/hooks';
import {useFocusEffect} from '@react-navigation/native';
import {Formik, FormikProps} from 'formik';
import {useCallback, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';

const CURRENCY_OPTIONS: IOption<string>[] = [
  {
    label: 'IDR',
    value: 'IDR',
  },
  {label: 'USD', value: 'USD'},
  {label: 'SGD', value: 'SGD'},
];

const currencySchema = yup.object({
  currency: yup.string().default(''),
});

type ICurrencyInput = yup.InferType<typeof currencySchema>;

export const CurrencyForm: React.FC = () => {
  const {onRefetch: onRefetchUserProfile} = useProfile();

  const formRef = useRef<FormikProps<ICurrencyInput>>(null);
  const [userId, setUserId] = useState<string>();

  const initialValues = useMemo(() => currencySchema.getDefault(), []);

  const handleChange = async (value: ICurrencyInput) => {
    if (!userId) return;

    const updatedUser = await userRepo.setPrimaryCurrencyCode(userId, value.currency);

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
    if (user[0].id) setUserId(user[0].id);
    if (currencyCode) {
      formRef.current?.resetForm({
        values: {
          currency: currencyCode,
        },
      });
    } else {
      formRef.current?.resetForm({values: initialValues});
    }
  }, [initialValues]);

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
          <SelectField name="currency" options={CURRENCY_OPTIONS} onChange={() => handleSubmit()} />
        </View>
      )}
    </Formik>
  );
};
