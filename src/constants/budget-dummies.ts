export const dummySavedBudgets: IBudget[] = [
  {
    title: '',
    type: 'monthly',
    dateRange: {
      startDate: new Date(),
      endDate: new Date(),
    },
    amount: 3000,
    icon: 'Calendar',
    iconColor: '#6D28D9',
    enableNotify: true,
  },
  {
    title: '',
    type: 'weekly',
    dateRange: {
      startDate: new Date(),
      endDate: new Date(),
    },
    amount: 1000,
    icon: 'Target',
    iconColor: '#6D28D9',
    enableNotify: true,
  },
  {
    title: '',
    type: 'custom',
    dateRange: {
      startDate: new Date(),
      endDate: new Date(),
    },
    amount: 3900,
    icon: 'Target',
    iconColor: '#6D28D9',
    enableNotify: true,
  },
];
