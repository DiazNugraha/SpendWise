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

interface IBudgetSchema {
  id: string;
  title: string;
  type: string;
  startDate: number;
  endDate: number;
  amount: number;
  icon: string | null;
  iconColor: string | null;
  enableNotify: boolean;
  autoRenew: boolean;
  isActive: boolean;
  userId: string;
  createdAt: number;
  updatedAt: number;
}
