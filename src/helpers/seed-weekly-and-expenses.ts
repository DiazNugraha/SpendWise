import {categoryOptions} from '@/constants/options';
import {db} from '@/db/client';
import {budgets, expenses} from '@/db/schema';
import uuid from 'react-native-uuid';

export const seedWeeklyAndExpenses = async () => {
  const budgetUuid = uuid.v4();
  const expenseUuid = uuid.v4();
  const nowTime = new Date().getTime();

  const category = categoryOptions.find(e => e.value === 'food');
  if (!category) {
    throw new Error('Category food not found');
  }

  const startDate = new Date(2026, 8, 23, 0, 0, 0);
  const endDate = new Date(2026, 8, 23, 15, 28, 0);
  const budgetAmount = 1000000;
  const spentAmount = 80000;

  // NOTE: Adjust payload and userId later
  await db.insert(budgets).values({
    id: budgetUuid,
    amount: budgetAmount,
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
    title: 'Bulanan',
    userId: 'f8384cf0-e518-42df-ad98-c88945a83769',
    createdAt: nowTime,
    updatedAt: nowTime,
    enableNotify: true,
    type: 'monthly',
    icon: 'Target',
    iconColor: '#FDC745',
    isActive: true,
    autoRenew: false,
  });

  // NOTE: Adjust userId and categoryId later
  // await db.insert(expenses).values({
  //   id: expenseUuid,
  //   amount: spentAmount,
  //   createdAt: startDate.getTime(),
  //   updatedAt: startDate.getTime(),
  //   userId: 'f8384cf0-e518-42df-ad98-c88945a83769',
  //   title: category.label,
  //   categoryId: category?.value,
  // });
};
