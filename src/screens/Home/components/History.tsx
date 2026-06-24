import {CATEGORY_DB_DATA, CategoryIconMap} from '@/constants';
import {expenseRepo} from '@/db/repositories';
import {formatDate, NumberFormatter} from '@/helpers';
import {RootNavigationProp} from '@/types';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Fragment, useCallback, useState} from 'react';
import {FlatList, Text, View} from 'react-native';

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

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

const History: React.FC = () => {
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const navigation = useNavigation<RootNavigationProp>();

  const fetchExpenses = useCallback(async () => {
    const data = await expenseRepo.findAll({limit: 5});

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
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [fetchExpenses]),
  );

  return (
    <View className="flex flex-col gap-1 p-3 flex-1" style={{maxHeight: 490}}>
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
