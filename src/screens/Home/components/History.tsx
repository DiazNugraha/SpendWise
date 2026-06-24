import {CATEGORY_DB_DATA, CategoryIconMap, dummySavedExpenses} from '@/constants';
import {formatDate, NumberFormatter} from '@/helpers';
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
  return (
    <View className="flex flex-col gap-1 p-3" style={{maxHeight: 490}}>
      <Text className="text-lg font-medium mb-4">Recent Transactions</Text>
      <FlatList
        data={dummySavedExpenses}
        renderItem={({item}) => <Item {...item} />}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 8,
        }}
      />
    </View>
  );
};

export default History;
