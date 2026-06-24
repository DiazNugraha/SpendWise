import * as yup from 'yup';

export const budgetSchema = yup.object({
  title: yup.string().default('').required('Title should not be empty'),
  amount: yup.number().typeError('Must be a number').positive().required('Amount should not be empty').default(0),
  type: yup.string().default('').required(),
  dateRange: yup
    .object({
      startDate: yup
        .date()
        .required('Start date is required')
        .default(() => new Date()),

      endDate: yup
        .date()
        .min(yup.ref('startDate'), 'End date must be after start date')
        .required('End date is required')
        .default(() => new Date()),
    })
    .default(() => ({
      startDate: new Date(),
      endDate: new Date(),
    }))
    .required(),
  icon: yup.string().default(''),
  iconColor: yup.string().default(''),
  enableNotify: yup.boolean().default(true),
});

export type IBudgetInput = yup.InferType<typeof budgetSchema>;
