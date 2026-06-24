import * as yup from 'yup';
import {Formik} from 'formik';
import {Button, View} from 'react-native';
import {DecimalInputField, InputField, MultiSelectField, SelectField} from '@/components';

const expenseSchema = yup.object({
  title: yup.string().default('').required('Title should not be empty'),
  providers: yup
    .array()
    .of(yup.string())
    .min(1, 'Select at least one provider')
    .required('Provider should not be empty')
    .default([]),
  mediums: yup
    .array()
    .of(yup.string())
    .min(1, 'Select at least one medium')
    .required('Medium should not be empty')
    .default([]),
  category: yup.string().default('').required('Category should not be empty'),
  amount: yup.number().typeError('Must be a number').positive().required('Amount should not be empty').default(0),
  description: yup.string().default(''),
});

type IExpenseInput = yup.InferType<typeof expenseSchema>;

type IOption<T extends string | number> = {
  label: string;
  value: T;
};

const ExpenseForm: React.FC = () => {
  const submitForm = (values: IExpenseInput) => {
    console.log(values);
  };

  const providerOptions: IOption<string>[] = [
    {
      label: 'Cash',
      value: 'cash',
    },
    {
      label: 'GoPay',
      value: 'gopay',
    },
    {
      label: 'Dana',
      value: 'dana',
    },
    {
      label: 'ShopeePay',
      value: 'shopeepay',
    },
    {
      label: 'OVO',
      value: 'ovo',
    },
  ];

  const mediumOptions: IOption<string>[] = [
    {
      label: 'E-money',
      value: 'emoney',
    },
    {
      label: 'Cash',
      value: 'cash',
    },
  ];

  const categoryOptions: IOption<string>[] = [
    {
      label: 'Food',
      value: 'food',
    },
    {
      label: 'Transport',
      value: 'transport',
    },
    {
      label: 'Groceries',
      value: 'groceries',
    },
    {
      label: 'Entertainment',
      value: 'entertainment',
    },
    {
      label: 'OVO',
      value: 'ovo',
    },
  ];

  return (
    <Formik initialValues={expenseSchema.getDefault()} validationSchema={expenseSchema} onSubmit={submitForm}>
      {({handleSubmit}) => (
        <View className="flex flex-col gap-3">
          <InputField name="title" label="Title" placeholder="Input Title here" />

          <DecimalInputField name="amount" label="Amount" placeholder="1.000" />

          <MultiSelectField
            name="providers"
            options={providerOptions}
            label="Providers"
            modalLabel="Select Providers"
          />

          <MultiSelectField name="mediums" options={mediumOptions} label="Mediums" modalLabel="Select Mediums" />

          <SelectField name="category" options={categoryOptions} label="Category" modalLabel="Select Category" />

          <InputField
            name="description"
            label="Description"
            placeholder="Input Description here"
            multiline
            numberOfLines={4}
          />

          <View className="mt-4">
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </View>
      )}
    </Formik>
  );
};

export default ExpenseForm;
