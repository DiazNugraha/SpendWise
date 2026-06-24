interface IBudget {
  title: string;
  type: 'monthly' | 'weekly' | 'custom';
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  amount: number;
  icon: string;
  iconColor: string;
  enableNotify: boolean;
}
