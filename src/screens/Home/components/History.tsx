import {ExpenseCard} from '@/components';
import {expenseRepo} from '@/db/repositories';
import {RootNavigationProp} from '@/types';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Fragment, useCallback, useState} from 'react';
import {Text, View} from 'react-native';

const History: React.FC = () => {
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const navigation = useNavigation<RootNavigationProp>();

  const fetchExpenses = useCallback(async () => {
    const {data} = await expenseRepo.findAll({limit: 5});

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
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [fetchExpenses]),
  );

  return (
    <View className="flex flex-col gap-1 p-3 flex-1">
      {expenses.length > 0 ? (
        <Fragment>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-lg font-medium mb-4">Recent Transactions</Text>
            <Text
              className="text-slate-500 text-xs"
              onPress={() => {
                return navigation.navigate('History');
              }}>
              View History
            </Text>
          </View>
          <View className="flex flex-col gap-2 mb-3">
            {expenses.map(item => (
              <ExpenseCard {...item} key={item.id} />
            ))}
          </View>
        </Fragment>
      ) : (
        <View className="flex justify-center items-center">
          <Text className="text-lg font-medium mb-4 content-center">---- Make your expenses! ----</Text>
        </View>
      )}
    </View>
  );
};

export default History;
