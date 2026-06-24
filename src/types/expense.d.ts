interface IExpense {
  id: string;
  title: string;
  providers: string[];
  mediums: string[];
  category: string;
  amount: number;
  description?: string;
  createdAt: Date;
  // proofImage?: string; // optional, omitted for now
}
