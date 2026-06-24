import * as yup from 'yup';
import {Formik} from 'formik';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {
  DecimalInputField,
  FormButtonWrapper,
  InputField,
  MultiSelectField,
  SelectCarouselField,
  SelectMultiCarouselField,
} from '@/components';
import {categoryOptions, mediumOptions, providerOptions} from '@/constants/options';

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

const ExpenseForm: React.FC = () => {
  const submitForm = (values: IExpenseInput) => {
    console.log(values);
  };

  return (
    <Formik initialValues={expenseSchema.getDefault()} validationSchema={expenseSchema} onSubmit={submitForm}>
      {({handleSubmit}) => (
        <FormButtonWrapper text="Submit Expense" onSubmit={handleSubmit}>
          <ScrollView className="flex flex-col" contentContainerClassName="gap-3 px-4">
            <View className="w-full flex justify-center items-center px-5">
              <DecimalInputField
                name="amount"
                label="Enter Amount"
                placeholder="1.000"
                className="bg-transparent border-0 text-[30px] font-bold"
              />
            </View>

            <InputField name="title" label="Title" placeholder="Input Title here" />

            <SelectMultiCarouselField name="mediums" options={mediumOptions} label="Medium" itemStyle="card" />

            <SelectCarouselField name="category" options={categoryOptions} label="Category" />

            <MultiSelectField name="providers" options={providerOptions} label="Providers" />

            <InputField
              name="description"
              label="Description"
              placeholder="Input Description here"
              multiline
              numberOfLines={4}
            />
          </ScrollView>
          <View className="absolute bottom-0 mb-4 bg-white w-full p-5">
            <Pressable
              className="py-5 px-6 rounded-2xl items-center justify-center bg-[#6D28D9]"
              onPress={handleSubmit}>
              <Text className="text-white font-medium">Submit Expense</Text>
            </Pressable>
          </View>
        </FormButtonWrapper>
      )}
    </Formik>
  );
};

export default ExpenseForm;
