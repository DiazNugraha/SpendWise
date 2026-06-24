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
import {categoryOptions, mediumOptions} from '@/constants/options';
import {expenseSchema, IExpenseInput} from '@/constants/schemas';
import {expenseRepo, providerRepo} from '@/db/repositories';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

const ExpenseForm: React.FC = () => {
  const navigation = useNavigation();

  const [providerOptions, setProviderOptions] = useState<{value: string; label: string}[]>([]);

  const submitForm = async (values: IExpenseInput) => {
    const savedData = await expenseRepo.create({
      amount: values.amount,
      title: values.title,
      providerIds: values.providers.filter(e => e !== undefined),
      categoryId: values.category,
      description: values.description,
      medium: values.mediums.join(','),
    });

    if (savedData) {
      navigation.goBack();
    }
  };

  const fetchProviderOptions = async () => {
    const datas = await providerRepo.findAll();
    setProviderOptions(
      datas.map(data => ({
        value: data.id,
        label: data.name,
      })),
    );
  };

  useEffect(() => {
    fetchProviderOptions();
  }, []);

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
