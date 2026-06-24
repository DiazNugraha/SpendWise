import * as yup from 'yup';
import {Formik} from 'formik';
import {ScrollView, Text, View} from 'react-native';
import {DateInputField, DecimalInputField, FormButtonWrapper} from '@/components';
import BudgetTypeSelector from './BudgetTypeSelector';
import {Fragment, useMemo, useState} from 'react';
import {formatDate} from '@/helpers';

const budgetSchema = yup.object({
  title: yup.string().default('').required('Title should not be empty'),
  amount: yup.number().typeError('Must be a number').positive().required('Amount should not be empty').default(0),
  type: yup.string().default('').required(),
  dateRange: yup
    .object({
      startDate: yup.date().required('Start date is required').default(new Date()),

      endDate: yup
        .date()
        .min(yup.ref('startDate'), 'End date must be after start date')
        .required('End date is required')
        .default(new Date()),
    })
    .required(),
});

type IOption<T extends string | number> = {
  label: string;
  value: T;
};

type IBudgetInput = yup.InferType<typeof budgetSchema>;

const budgetTypeOptions: IOption<string>[] = [
  {label: 'Weekly', value: 'weekly'},
  {label: 'Monthly', value: 'monthly'},
  {label: 'Custom', value: 'custom'},
];

const BudgetForm: React.FC = () => {
  const [dateRange, setDateRange] = useState<number>();

  const dateRangeText = useMemo(() => {
    if (!dateRange) return '';
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(new Date().getDate() + dateRange);

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }, [dateRange]);

  const submitForm = (values: IBudgetInput) => {
    console.log(values);
  };

  return (
    <Formik initialValues={budgetSchema.getDefault()} validationSchema={budgetSchema} onSubmit={submitForm}>
      {({handleSubmit, setFieldValue, getFieldMeta}) => (
        <FormButtonWrapper text="Submit Budget" onSubmit={handleSubmit}>
          <ScrollView contentContainerClassName="gap-3 px-4">
            <BudgetTypeSelector
              onChange={value => {
                setFieldValue('type', value.label);
                setDateRange(value.rangeDate);
              }}
            />

            <View className="w-full flex justify-center items-center px-5">
              <DecimalInputField
                name="amount"
                label="Enter Amount"
                placeholder="1.000"
                className="bg-transparent border-0 text-[30px] font-bold"
              />
            </View>

            {getFieldMeta('type').value === 'custom' ? (
              <DateInputField name="dateRange" label="Input Date Range" />
            ) : (
              <Fragment>
                <Text>Date Range</Text>
                <View className="input-field">
                  <Text>{dateRangeText}</Text>
                </View>
              </Fragment>
            )}
          </ScrollView>
        </FormButtonWrapper>
      )}
    </Formik>
  );
};

export default BudgetForm;
