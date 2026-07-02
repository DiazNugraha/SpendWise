import {SelectField} from '@/components';
import {Formik} from 'formik';
import {View} from 'react-native';
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
  const handleChange = async (value: ICurrencyInput) => {
    console.log('currency input value', value);
  };

  return (
    <Formik initialValues={currencySchema.getDefault()} validationSchema={currencySchema} onSubmit={handleChange}>
      {({handleSubmit}) => (
        <View className="flex flex-col flex-1 gap-3">
          <SelectField name="currency" options={CURRENCY_OPTIONS} onChange={() => handleSubmit()} />
        </View>
      )}
    </Formik>
  );
};
