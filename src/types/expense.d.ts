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
