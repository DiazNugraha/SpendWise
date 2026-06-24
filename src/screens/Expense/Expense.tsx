import {View} from 'react-native';
import ExpenseForm from './components/ExpenseForm';
import {ModalWrapper} from '@/components';

export const Expense: React.FC = () => {
  return (
    <ModalWrapper title="Add Expense">
      <View className="flex flex-col gap-3 flex-1">
        <ExpenseForm />
      </View>
    </ModalWrapper>
  );
};
