import {and, eq, gte, lte, sql} from 'drizzle-orm';
import {db} from '../client';
import {budgets, expenses} from '../schema';
import uuid from 'react-native-uuid';
import {applyWhere, formatDate} from '@/helpers';
import {categoryOptions} from '@/constants/options';
import {LucideIcon} from 'lucide-react-native';

type IBudgetInsert = {
  title: string;
  type: BudgetType;
  startDate: Date;
  endDate: Date;
  amount: number;
  icon?: string;
  iconColor?: string;
  enableNotify: boolean;
  autoRenew: boolean;
  userId?: string;
};

export class BudgetRepo {
  constructor(private readonly userId?: string) {}

  async findAll() {
    return await db.select().from(budgets);
  }

  async findById(id: string) {
    return await db.select().from(budgets).where(eq(budgets.id, id));
  }

  async findActivesEachType(options?: {notify?: boolean}) {
    let weeklyQuery = db
      .select()
      .from(budgets)
      .where(and(eq(budgets.type, 'weekly'), eq(budgets.isActive, true)));
    let monthlyQuery = db
      .select()
      .from(budgets)
      .where(and(eq(budgets.type, 'monthly'), eq(budgets.isActive, true)));
    let customQuery = db
      .select()
      .from(budgets)
      .where(and(eq(budgets.type, 'custom'), eq(budgets.isActive, true)));

    if (options?.notify) {
      weeklyQuery = applyWhere(weeklyQuery, eq(budgets.enableNotify, true));
      monthlyQuery = applyWhere(monthlyQuery, eq(budgets.enableNotify, true));
      customQuery = applyWhere(customQuery, eq(budgets.enableNotify, true));
    }

    const weekly = await weeklyQuery;
    const monthly = await monthlyQuery;
    const custom = await customQuery;

    return [weekly[0], monthly[0], custom[0]].filter(e => e !== undefined);
  }

  async findActiveByType(type: BudgetType, options?: {notify?: boolean}) {
    let query = db
      .select()
      .from(budgets)
      .where(and(eq(budgets.type, type), eq(budgets.isActive, true)));

    query = options?.notify ? applyWhere(query, eq(budgets.enableNotify, true)) : query;

    return await query;
  }

  async create(data: IBudgetInsert) {
    if (!this.userId) return;

    const now = Date.now();
    const newBudgetId = uuid.v4();

    return await db.insert(budgets).values({
      id: newBudgetId,
      title: data.title,
      type: data.type,
      amount: data.amount,
      icon: data.icon,
      iconColor: data.iconColor,
      enableNotify: data.enableNotify,
      startDate: data.startDate.getTime(),
      endDate: data.endDate.getTime(),
      isActive: true,
      autoRenew: data.autoRenew,
      userId: data.userId ?? this.userId,
      createdAt: now,
      updatedAt: now,
    });
  }

  async update(id: string, data: IBudgetInsert) {
    const now = Date.now();

    return await db
      .update(budgets)
      .set({
        title: data.title,
        type: data.type,
        amount: data.amount,
        icon: data.icon,
        iconColor: data.iconColor,
        enableNotify: data.enableNotify,
        startDate: data.startDate.getTime(),
        endDate: data.endDate.getTime(),
        autoRenew: data.autoRenew,
        updatedAt: now,
      })
      .where(eq(budgets.id, id));
  }

  async setToInactive(id: string) {
    return await db
      .update(budgets)
      .set({
        isActive: false,
      })
      .where(and(eq(budgets.id, id), eq(budgets.isActive, true)));
  }

  async getExpensesByBudget(id: string) {
    const budget = await db.select().from(budgets).where(eq(budgets.id, id)).limit(1);

    const {startDate, endDate} = budget[0];

    const existingExpenses = await db
      .select()
      .from(expenses)
      .where(and(gte(expenses.createdAt, startDate), lte(expenses.createdAt, endDate)));

    return existingExpenses;
  }

  async getLastInactiveBudget(budgetType: BudgetType) {
    const budget = await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.isActive, false), eq(budgets.type, budgetType)))
      .orderBy(sql`${budgets.createdAt} desc`)
      .limit(1);

    return budget[0];
  }

  async getPercentageOfEachBudget(props?: {type?: BudgetType; dateRange?: {startDate: Date; endDate: Date}}) {
    const conditions = [];

    if (props?.type) {
      conditions.push(eq(budgets.type, props.type));
    }

    if (props?.dateRange) {
      conditions.push(
        gte(budgets.startDate, props.dateRange.startDate.getTime()),
        lte(budgets.startDate, props.dateRange.endDate.getTime()),
      );
    }

    const existingBudgets = await db
      .select()
      .from(budgets)
      .where(conditions.length ? and(...conditions) : undefined);

    const result = await Promise.all(
      existingBudgets.map(async budget => {
        const countExpenseAmount = await this.sumExpensesWithinDate(budget.startDate, budget.endDate);

        return {
          label: formatDate(new Date(budget.startDate), {
            locales: 'en-GB',
            dateTimeOption: {
              day: 'numeric',
              month: 'short',
            },
          }),
          value: Math.floor((countExpenseAmount / budget.amount) * 100),
          spentAmount: countExpenseAmount,
          ...budget,
        };
      }),
    );
    return result;
  }

  async sumExpensesWithinDate(startDate: number, endDate: number) {
    const result = await db
      .select({
        total: sql<number>`COALESCE(sum(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .where(and(gte(expenses.createdAt, startDate), lte(expenses.createdAt, endDate)));

    return result[0]?.total ?? 0;
  }

  async getBudgetExpensesAnalytic(id: string) {
    const selectBudget = (await db.select().from(budgets).where(eq(budgets.id, id)))[0];

    if (!selectBudget) return;

    const budgetExpenses = await this.getExpensesByBudget(id);

    const categoryCollections: {
      name: string;
      icon?: LucideIcon;
      total: number;
      spentTimes: number;
    }[] = [];

    categoryOptions.forEach(category => {
      const filteredExpenses = budgetExpenses.filter(e => e.categoryId === category.value);
      const total = filteredExpenses.reduce((acc, curr) => {
        return acc + curr.amount;
      }, 0);
      if (filteredExpenses.length > 0) {
        categoryCollections.push({
          name: category.label,
          icon: category.icon,
          total: total,
          spentTimes: filteredExpenses.length,
        });
      }
    });

    return {
      budgetAmount: selectBudget.amount,
      budgetTitle: selectBudget.title,
      categoryCollections,
    };
  }

  async deleteBudgetById(id: string) {
    return await db.delete(budgets).where(eq(budgets.id, id));
  }
}
