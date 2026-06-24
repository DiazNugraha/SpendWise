import {expenseSchema, IExpenseInput} from '@/constants/schemas';
import {expenseRepo} from '@/db/repositories';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {Formik} from 'formik';
import ExpenseFormInput from './ExpenseFormInput';
import {capitalizeFirstLetter} from '@/helpers';

const ExpenseForm: React.FC = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitForm = async (values: IExpenseInput) => {
    setIsLoading(true);
    const title = values.title !== '' ? values.title : capitalizeFirstLetter(values.category);
    const savedData = await expenseRepo.create({
      amount: values.amount,
      title: title,
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

      const needToNotifies = await expenseRepo.checkIfThereIsBudgetGoalsToNotify();

      if (needToNotifies.length > 0) {
        needToNotifies.forEach(budget => {
          Toast.show({
            type: 'success',
            text1: 'Budget Alert',
            text2: `You have used 80% of your ${budget.type} budget.`,
            visibilityTime: 7000,
          });
        });
      }

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
