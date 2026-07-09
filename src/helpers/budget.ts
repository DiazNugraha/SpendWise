import {BudgetRepo} from '@/db/repositories';

export const updateExpiredBudgets = async () => {
  const budgetRepo = new BudgetRepo();
  const activeBudgets = await budgetRepo.findActivesEachType();
  const now = new Date();

  const updatedIds: (string | null)[] = await Promise.all(
    activeBudgets.map(async budget => {
      if (budget.endDate < now.getTime()) {
        await budgetRepo.setToInactive(budget.id);
        return budget.id;
      }
      return null;
    }),
  );

  console.log('updatedIds', updatedIds);
  console.log('activeBudgets', activeBudgets);
};
