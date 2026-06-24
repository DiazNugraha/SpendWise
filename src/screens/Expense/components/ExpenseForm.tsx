import {Formik} from 'formik';
import {View} from 'react-native';
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
import Toast from 'react-native-toast-message';

const ExpenseForm: React.FC = () => {
  const navigation = useNavigation();

  const [providerOptions, setProviderOptions] = useState<{value: string; label: string}[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitForm = async (values: IExpenseInput) => {
    setIsLoading(true);
    const savedData = await expenseRepo.create({
      amount: values.amount,
      title: values.title,
      providerIds: values.providers.filter(e => e !== undefined),
      categoryId: values.category,
      description: values.description,
      medium: values.mediums.join(','),
    });

    setIsLoading(false);

    if (savedData) {
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Expense created successfully',
      });
      return navigation.goBack();
    }

    Toast.show({
      type: 'error',
      text1: 'Error!',
      text2: 'Failed to create expense. Please try again.',
    });
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
        <FormButtonWrapper text="Submit Expense" onSubmit={handleSubmit} isLoading={isLoading}>
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
        </FormButtonWrapper>
      )}
    </Formik>
  );
};

export default ExpenseForm;
