import {BudgetRepo} from '@/db/repositories';

export const updateExpiredBudgets = async () => {
  const budgetRepo = new BudgetRepo('');
  const activeBudgets = await budgetRepo.findActivesEachType();
  const now = new Date();

  const updatedIds: (string | null)[] = await Promise.all(
    activeBudgets.map(async budget => {
      if (budget.endDate < now.getTime()) {
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

          return budget.id;
        }

        await budgetRepo.setToInactive(budget.id);

        return budget.id;
      }
      return null;
    }),
  );

  console.log('updatedIds', updatedIds);
  console.log('activeBudgets', activeBudgets);
};
