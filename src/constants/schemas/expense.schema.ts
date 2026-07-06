import * as yup from 'yup';

export const expenseSchema = yup.object({
  title: yup.string().default(''),
  providers: yup.array().of(yup.string()).default([]),
  category: yup.string().default('').required('Category should not be empty'),
  amount: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' || originalValue == null ? undefined : value))
    .typeError('Must be a number')
    .positive()
    .optional(),
  description: yup.string().default(''),
});

export type IExpenseInput = yup.InferType<typeof expenseSchema>;
