import {BudgetRepo, SyncQueueRepo} from '@/db/repositories';

export const updateExpiredBudgets = async (userId: string): Promise<(IBudgetSchema & {totalSpent: number})[]> => {
  const syncQueueRepo = new SyncQueueRepo();
  const budgetRepo = new BudgetRepo(syncQueueRepo, userId);

  const activeBudgets = await budgetRepo.findActivesEachType();
  const now = new Date();

  const updatedBudgets: ((IBudgetSchema & {totalSpent: number}) | null | undefined)[] = await Promise.all(
    activeBudgets.map(async budget => {
      if (budget.endDate < now.getTime()) {
        const totalSpent = await budgetRepo.sumExpensesWithinDate(budget.startDate, budget.endDate);

        if (budget.autoRenew) {
          const startDate = new Date(budget.startDate);
          startDate.setDate(startDate.getDate() + 1);

          const endDate = new Date(budget.endDate);

          if (budget.type === 'weekly') {
            endDate.setDate(endDate.getDate() + 7);
          } else if (budget.type === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
          }

          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);

          budgetRepo.create({
            ...budget,
            startDate,
            endDate,
            type: budget.type as BudgetType,
            icon: budget.icon ?? undefined,
            iconColor: budget.iconColor ?? undefined,
            userId: budget.userId,
          });

          return {...budget, totalSpent};
        }

        await budgetRepo.setToInactive(budget.id);

        return {...budget, totalSpent};
      }
    }),
  );

  const filtered: (IBudgetSchema & {totalSpent: number})[] = updatedBudgets.filter(u => u !== null && u !== undefined);

  return filtered;
};
