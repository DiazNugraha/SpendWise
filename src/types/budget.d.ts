type BudgetType = 'monthly' | 'weekly' | 'custom';

interface IBudget {
  title: string;
  type: BudgetType;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  amount: number;
  icon: string;
  iconColor: string;
  enableNotify: boolean;
}
