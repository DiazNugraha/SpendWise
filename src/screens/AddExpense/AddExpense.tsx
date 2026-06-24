import {View} from 'react-native';
import ExpenseForm from './components/ExpenseForm';

export const AddExpense: React.FC = () => {
  return (
    <View className="flex flex-col gap-3 p-4">
      <ExpenseForm />
    </View>
  );
};
