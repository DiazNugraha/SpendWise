import {View} from 'react-native';
import BudgetForm from './components/BudgetForm';
import {ModalWrapper} from '@/components';

export const Budget: React.FC = () => {
  return (
    <ModalWrapper title="Add Budget">
      <View className="flex flex-col gap-3 flex-1">
        <BudgetForm />
      </View>
    </ModalWrapper>
  );
};
