export const dummySavedBudgets: IBudget[] = [
  {
    title: 'Monthly Budget',
    type: 'monthly',
    dateRange: {
      startDate: new Date('2026-02-25 12:15'),
      endDate: new Date('2026-03-25 12:15'),
    },
    amount: 3000,
    icon: 'Calendar',
    iconColor: '#6D28D9',
    enableNotify: true,
  },
  {
    title: 'Weekly Budget',
    type: 'weekly',
    dateRange: {
      startDate: new Date('2026-02-25 12:15'),
      endDate: new Date('2026-03-04 12:15'),
    },
    amount: 1000,
    icon: 'Target',
    iconColor: '#6D28D9',
    enableNotify: true,
  },
  {
    title: 'Custom Budget',
    type: 'custom',
    dateRange: {
      startDate: new Date('2026-02-25 12:15'),
      endDate: new Date('2026-04-01 12:15'),
    },
    amount: 3900,
    icon: 'Target',
    iconColor: '#6D28D9',
    enableNotify: true,
  },
];
