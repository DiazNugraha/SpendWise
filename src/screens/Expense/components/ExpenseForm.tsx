import {expenseSchema, IExpenseInput} from '@/constants/schemas';
import {expenseRepo} from '@/db/repositories';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {Formik} from 'formik';
import ExpenseFormInput from './ExpenseFormInput';

const ExpenseForm: React.FC = () => {
  const navigation = useNavigation();

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

  return (
    <Formik initialValues={expenseSchema.getDefault()} validationSchema={expenseSchema} onSubmit={submitForm}>
      <ExpenseFormInput isLoading={isLoading} />
    </Formik>
  );
};

export default ExpenseForm;
