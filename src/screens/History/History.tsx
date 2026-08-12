import {ExpenseCard, ModalWrapper} from '@/components';
import {FlatList, Text, View} from 'react-native';
import Filter from './components/Filter';
import {useCallback, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';
import {NumberFormatter} from '@/helpers';
import {categoryOptions} from '@/constants/options';
import {useAlert, useExpenseRepo, useProfile} from '@/hooks';
import Toast from 'react-native-toast-message';

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

export const History = () => {
  const {primaryCurrencySymbol} = useProfile();
  const {alert} = useAlert();
  const expenseRepo = useExpenseRepo();

  const [filter, setFilter] = useState<{
    budget: string;
    categories: string[];
  }>({
    budget: 'all',
    categories: ['all', ...categoryOptions.map(e => e.value)],
  });
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [totalExpense, setTotalExpense] = useState<number>(0);

  const fetchExpenses = useCallback(async () => {
    const appliedFilter = {
      limit: 5,
      categories: filter.categories,
      ...(filter.budget ? {budgetType: filter.budget as BudgetType} : {}),
    };

    const {data, meta} = await expenseRepo.findAll(appliedFilter);

    setTotalExpense(meta.totalExpense);

    const formatData: IExpense[] = data.map(d => ({
      id: d.id,
      title: d.title,
      providers: [],
      category: d.categoryId,
      amount: d.amount,
      description: d?.description ?? undefined,
      createdAt: new Date(d.createdAt),
    }));

    setExpenses(formatData);
  }, [filter, expenseRepo]);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [fetchExpenses]),
  );

  const handleRemoveById = async (id?: string) => {
    if (!id) return;

    alert({
      title: 'Delete expense',
      description: `Are you sure you want to delete this expense? This action cannot be undone.`,
      onConfirm: async () => {
        const result = await expenseRepo.deleteById(id);
        if (result) {
          Toast.show({
            type: 'success',
            text1: 'Success!',
            text2: 'Expense deleted successfully',
          });

          fetchExpenses();
          return;
        }

        Toast.show({
          type: 'error',
          text1: 'Error!',
          text2: 'Failed to delete expense. Please try again.',
        });
      },
      confirmButtonLabel: 'Yes, Continue',
    });
  };

  return (
    <ModalWrapper title="Expense History">
      <View className="flex flex-col gap-3 flex-1 px-4">
        <Filter
          onClear={() =>
            setFilter({
              budget: '',
              categories: [],
            })
          }
          setSelectedBudget={val =>
            setFilter(prev => ({
              budget: val,
              categories: prev.categories,
            }))
          }
          setSelectedCategories={val =>
            setFilter(prev => ({
              budget: prev.budget,
              categories: val,
            }))
          }
          value={filter}
        />

        <LinearGradient
          colors={['#8B5CF6', '#6D28D9']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          className="w-full rounded-2xl p-5 overflow-hidden">
          <View className="flex flex-col gap-3">
            <Text className="text-white/70 font-medium text-base">Total Expense</Text>
            <Text className="text-white text-3xl font-bold">
              {primaryCurrencySymbol} {formatter.format(totalExpense)}
            </Text>
            {/* <View className="flex flex-row gap-1 items-center"> */}
            {/*   <ArrowUpIcon size={16} color={'white'} /> */}
            {/*   <Text className="text-white/40 font-normal text-sm">12% vs last week</Text> */}
            {/* </View> */}
          </View>
        </LinearGradient>

        <FlatList
          data={expenses}
          renderItem={({item}) => <ExpenseCard item={item} onRemove={() => handleRemoveById(item.id)} />}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 8,
          }}
          style={{flex: 1}}
        />
      </View>
    </ModalWrapper>
  );
};
