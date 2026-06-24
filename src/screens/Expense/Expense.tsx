import {View} from 'react-native';
import {ModalWrapper} from '@/components';
import ExpenseForm from './components/ExpenseForm';

export const Expense: React.FC = () => {
  return (
    <ModalWrapper title="Add Expense">
      <View className="flex flex-col gap-3 flex-1">
        <ExpenseForm />
      </View>
    </ModalWrapper>
  );
};
