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
import {providerRepo} from '@/db/repositories';
import {useEffect, useMemo, useState} from 'react';
import {useFormikContext} from 'formik';
import {IExpenseInput} from '@/constants/schemas';

interface IExpenseFormProps {
  isLoading: boolean;
}

const ExpenseFormInput: React.FC<IExpenseFormProps> = ({isLoading}) => {
  const {values, handleSubmit, setFieldValue} = useFormikContext<IExpenseInput>();

  const [providerOptions, setProviderOptions] = useState<{value: string; label: string}[]>([]);

  const fetchProviderOptions = async () => {
    const datas = await providerRepo.findAll();
    setProviderOptions(
      datas.map(data => ({
        value: data.id,
        label: data.name,
      })),
    );
  };

  const isShowProvidersInput = useMemo(() => {
    return !(values.mediums.length === 1 && values.mediums[0] === 'cash');
  }, [values.mediums]);

  useEffect(() => {
    if (values.mediums.length === 1 && values.mediums[0] === 'cash') {
      setFieldValue('providers', []);
    }
  }, [values.mediums, setFieldValue]);

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

      <SelectMultiCarouselField name="mediums" options={mediumOptions} label="Medium" itemStyle="card" required />

      <SelectCarouselField name="category" options={categoryOptions} label="Category" required />

      {isShowProvidersInput && (
        <MultiSelectField name="providers" options={providerOptions} label="Providers" required />
      )}

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
