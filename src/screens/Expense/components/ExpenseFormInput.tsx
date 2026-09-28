import {View} from 'react-native';
import {
  DecimalInputField,
  FormButtonWrapper,
  InputField,
  SelectCarouselField,
  SelectMultiCarouselField,
} from '@/components';
import {categoryOptions} from '@/constants/options';
import {ReactElement, useCallback, useState} from 'react';
import {useFormikContext} from 'formik';
import {IExpenseInput} from '@/constants/schemas';
import {LucideIcon} from 'lucide-react-native';
import {displayProviderIcon} from '@/constants';
import {useUserRepo} from '@/hooks';
import {useFocusEffect} from '@react-navigation/native';

interface IExpenseFormProps {
  isLoading: boolean;
}

const ExpenseFormInput: React.FC<IExpenseFormProps> = ({isLoading}) => {
  const {handleSubmit, setFieldError, values} = useFormikContext<IExpenseInput>();
  const userRepo = useUserRepo();

  const [providerOptions, setProviderOptions] = useState<
    {label: string; value: string; icon?: LucideIcon | ReactElement}[]
  >([]);

  const fetchProviderOptions = useCallback(async () => {
    const datas = await userRepo.getUserProviders();
    if (!datas) return;
    setProviderOptions(
      datas.map(data => {
        const icon = data.providers?.value ? displayProviderIcon(data.providers?.value) : undefined;
        return {
          value: data.user_providers.id ?? '',
          label: data.providers?.label ?? '',
          icon: icon,
        };
      }),
    );
  }, [userRepo]);

  const onSubmit = () => {
    if (!values.amount) {
      setFieldError('amount', 'Amount should not be empty');
      return;
    }

    handleSubmit();
  };

  useFocusEffect(
    useCallback(() => {
      fetchProviderOptions();
    }, [fetchProviderOptions]),
  );

  return (
    <FormButtonWrapper text="Submit Expense" onSubmit={onSubmit} isLoading={isLoading}>
      <View className="w-full flex justify-center items-center px-5">
        <DecimalInputField
          name="amount"
          label="Enter Amount"
          placeholder="1.000"
          className="bg-transparent border-0 text-[30px] font-bold"
          autoFocus
          required
        />
      </View>

      <SelectCarouselField name="category" options={categoryOptions} label="Category" required />

      <SelectMultiCarouselField
        name="providers"
        options={providerOptions}
        label="Providers"
        required
        itemStyle="card"
      />

      <InputField name="title" label="Title" placeholder="Input Title here" />

      <InputField
        name="description"
        label="Description"
        placeholder="Input Description here"
        multiline
        numberOfLines={4}
      />
    </FormButtonWrapper>
  );
};

export default ExpenseFormInput;
