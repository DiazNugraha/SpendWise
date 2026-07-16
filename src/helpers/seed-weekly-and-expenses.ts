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

  const startDate = new Date('2026-07-11');
  const endDate = new Date('2026-07-12');
  const budgetAmount = 100000;
  const spentAmount = 80000;

  // NOTE: Adjust payload and userId later
  await db.insert(budgets).values({
    id: budgetUuid,
    amount: budgetAmount,
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
    title: 'Weekly',
    userId: '',
    createdAt: nowTime,
    updatedAt: nowTime,
    enableNotify: false,
    type: 'weekly',
    icon: 'Calendar',
    iconColor: '#21BCFF',
    isActive: false,
  });

  // NOTE: Adjust userId and categoryId later
  await db.insert(expenses).values({
    id: expenseUuid,
    amount: spentAmount,
    createdAt: startDate.getTime(),
    updatedAt: nowTime,
    userId: '',
    title: category.label,
    categoryId: category?.value,
  });
};
