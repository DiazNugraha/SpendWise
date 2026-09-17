interface IExpense {
  id?: string;
  title: string;
  providers: string[];
  category: string;
  amount: number;
  description?: string;
  createdAt: Date;
  // proofImage?: string; // optional, omitted for now
}

interface IExpenseSchema {
  id: string;
  title: string;
  categoryId: string;
  amount: number;
  description: string | null;
  userId: string;
  createdAt: number;
  updatedAt: number;
}

interface IExpenseProviderSchema {
  id: string;
  expenseId: string;
  providerId: string;
}
