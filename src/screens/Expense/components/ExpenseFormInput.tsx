import {View} from 'react-native';
import {
  DecimalInputField,
  FormButtonWrapper,
  InputField,
  SelectCarouselField,
  SelectMultiCarouselField,
} from '@/components';
import {categoryOptions} from '@/constants/options';
import {userRepo} from '@/db/repositories';
import {useEffect, useState} from 'react';
import {useFormikContext} from 'formik';
import {IExpenseInput} from '@/constants/schemas';

interface IExpenseFormProps {
  isLoading: boolean;
}

const ExpenseFormInput: React.FC<IExpenseFormProps> = ({isLoading}) => {
  const {handleSubmit} = useFormikContext<IExpenseInput>();

  const [providerOptions, setProviderOptions] = useState<{value: string; label: string}[]>([]);

  const fetchProviderOptions = async () => {
    const datas = await userRepo.getUserProviders();
    if (!datas) return;
    setProviderOptions(
      datas.map(data => ({
        value: data.providers?.id ?? '',
        label: data.providers?.name ?? '',
      })),
    );
  };

  useEffect(() => {
    fetchProviderOptions();
  }, []);

  return (
    <FormButtonWrapper text="Submit Expense" onSubmit={handleSubmit} isLoading={isLoading}>
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

      <SelectMultiCarouselField name="providers" options={providerOptions} label="Providers" required />

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
