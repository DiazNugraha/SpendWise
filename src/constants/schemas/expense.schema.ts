import * as yup from 'yup';

export const expenseSchema = yup.object({
  title: yup.string().default(''),
  providers: yup.array().of(yup.string()).default([]),
  mediums: yup
    .array()
    .of(yup.string())
    .min(1, 'Select at least one medium')
    .required('Medium should not be empty')
    .default([]),
  category: yup.string().default('').required('Category should not be empty'),
  amount: yup.number().typeError('Must be a number').positive().required('Amount should not be empty').default(0),
  description: yup.string().default(''),
});

export type IExpenseInput = yup.InferType<typeof expenseSchema>;
