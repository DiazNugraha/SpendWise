import {CATEGORY_DB_DATA, CategoryIconMap} from '@/constants';
import {formatDate, NumberFormatter} from '@/helpers';
import {FlatList, Text, View} from 'react-native';

const dummyDate = new Date();
const datas: ISpend[] = [
  {
    title: 'Lunch at warung',
    providers: ['GoPay'],
    mediums: ['emoney'],
    category: 'food',
    amount: 35000,
    description: 'Nasi ayam + es teh',
    createdAt: dummyDate,
  },
  {
    title: 'Morning coffee',
    providers: ['Cash'],
    mediums: ['cash'],
    category: 'food',
    amount: 18000,
    createdAt: dummyDate,
  },
  {
    title: 'Online ride to office',
    providers: ['GoPay'],
    mediums: ['emoney'],
    category: 'transport',
    amount: 22000,
    description: 'GoRide from home to office',
    createdAt: dummyDate,
  },
  {
    title: 'Weekly groceries',
    providers: ['Dana'],
    mediums: ['emoney'],
    category: 'groceries',
    amount: 125000,
    description: 'Vegetables, eggs, instant noodles',
    createdAt: dummyDate,
  },
  {
    title: 'Mobile data package',
    providers: ['ShopeePay'],
    mediums: ['emoney'],
    category: 'utilities',
    amount: 50000,
    description: 'Monthly internet quota',
    createdAt: dummyDate,
  },
  {
    title: 'Parking fee',
    providers: ['Cash'],
    mediums: ['cash'],
    category: 'transport',
    amount: 5000,
    createdAt: dummyDate,
  },
  {
    title: 'Movie night',
    providers: ['OVO'],
    mediums: ['emoney'],
    category: 'entertainment',
    amount: 45000,
    description: 'Cinema ticket',
    createdAt: dummyDate,
  },
  {
    title: 'Movie night',
    providers: ['OVO'],
    mediums: ['emoney'],
    category: 'entertainment',
    amount: 45000,
    description: 'Cinema ticket',
    createdAt: dummyDate,
  },
  {
    title: 'Movie night',
    providers: ['OVO'],
    mediums: ['emoney'],
    category: 'entertainment',
    amount: 45000,
    description: 'Cinema ticket',
    createdAt: dummyDate,
  },
];

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

const Item: React.FC<ISpend> = props => {
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
        data={datas}
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
