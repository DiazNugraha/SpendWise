type BudgetType = 'monthly' | 'weekly' | 'custom' | 'all';

interface IBudget {
  id?: string;
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
