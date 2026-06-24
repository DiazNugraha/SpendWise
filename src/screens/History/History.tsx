import {ModalWrapper} from '@/components';
import {FlatList, Text, View} from 'react-native';
import Filter from './components/Filter';
import {useCallback, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {expenseRepo} from '@/db/repositories';
import {useFocusEffect} from '@react-navigation/native';
import {formatDate, NumberFormatter} from '@/helpers';
import {CATEGORY_DB_DATA, CategoryIconMap} from '@/constants';
import {categoryOptions} from '@/constants/options';

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

export const History = () => {
  const [filter, setFilter] = useState<{
    budget: string;
    categories: string[];
  }>({
    budget: 'all',
    categories: ['all', ...categoryOptions.map(e => e.value)],
  });
  const [expenses, setExpenses] = useState<IExpense[]>([]);

  const fetchExpenses = useCallback(async () => {
    const appliedFilter = {
      limit: 5,
      categories: filter.categories,
      ...(filter.budget ? {budgetType: filter.budget as BudgetType} : {}),
    };

    const data = await expenseRepo.findAll(appliedFilter);

    const formatData: IExpense[] = data.map(d => ({
      title: d.title,
      providers: [],
      mediums: d.medium ? d.medium.split(',') : [],
      category: d.categoryId,
      amount: d.amount,
      description: d?.description ?? undefined,
      createdAt: new Date(d.createdAt),
    }));

    setExpenses(formatData);
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [fetchExpenses]),
  );

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
          <View className="absolute -top-2 -right-2 w-[40px] h-[40px] rounded-full bg-white/20" />
          <Text className="text-white/50 font-medium text-base">Total Expense</Text>
          <Text className="text-white text-3xl font-bold">400.000</Text>
          <Text className="text-white/50 font-normal text-sm">12% vs last week</Text>
        </LinearGradient>

        <FlatList
          data={expenses}
          renderItem={({item}) => <Item {...item} />}
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

const Item: React.FC<IExpense> = props => {
  const getCategoryItems = (key: string) => {
    return CATEGORY_DB_DATA.find(e => e.key === key);
  };

  const category = getCategoryItems(props.category);
  const Icon = CategoryIconMap[category?.key as keyof typeof CategoryIconMap];
  return (
    <View className="px-3 py-2 bg-white rounded-lg flex flex-row gap-2 w-full">
      {category && (
        <View
          className={`p-3 rounded-md`}
          style={{
            backgroundColor: `${category.color}4D`,
          }}>
          <Icon size={20} color={category.color} />
        </View>
      )}

      <View className="flex-1 flex flex-row justify-between">
        <View className="flex flex-col gap-2 justify-center">
          <Text className="text-sm font-medium">{props.title}</Text>
          {props.description && <Text className="text-[10px] font-light">{props.description}</Text>}
        </View>

        <View className="flex flex-col justify-center items-end gap-2">
          <Text className="text-sm font-medium">{formatter.format(props.amount)}</Text>
          <Text className="text-[10px] font-light">
            {formatDate(props.createdAt, {
              dateTimeOption: {
                dateStyle: 'short',
                timeStyle: 'short',
              },
            })}
          </Text>
        </View>
      </View>
    </View>
  );
};
