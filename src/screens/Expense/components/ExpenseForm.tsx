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
import {expenseSchema, IExpenseInput} from '@/constants/schemas';

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
