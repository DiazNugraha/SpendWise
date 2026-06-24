import {FlatList, Text, View} from 'react-native';

interface ISpend {
  title: string;
  providers: string[];
  mediums: string[];
  category: string;
  amount: number;
  description?: string;
  // proofImage?: string; // optional, omitted for now
}

const datas: ISpend[] = [
  {
    title: 'Lunch at warung',
    providers: ['GoPay'],
    mediums: ['emoney'],
    category: 'Food',
    amount: 35000,
    description: 'Nasi ayam + es teh',
  },
  {
    title: 'Morning coffee',
    providers: ['Cash'],
    mediums: ['cash'],
    category: 'Food',
    amount: 18000,
  },
  {
    title: 'Online ride to office',
    providers: ['GoPay'],
    mediums: ['emoney'],
    category: 'Transport',
    amount: 22000,
    description: 'GoRide from home to office',
  },
  {
    title: 'Weekly groceries',
    providers: ['Dana'],
    mediums: ['emoney'],
    category: 'Groceries',
    amount: 125000,
    description: 'Vegetables, eggs, instant noodles',
  },
  {
    title: 'Mobile data package',
    providers: ['ShopeePay'],
    mediums: ['emoney'],
    category: 'Utilities',
    amount: 50000,
    description: 'Monthly internet quota',
  },
  {
    title: 'Parking fee',
    providers: ['Cash'],
    mediums: ['cash'],
    category: 'Transport',
    amount: 5000,
  },
  {
    title: 'Movie night',
    providers: ['OVO'],
    mediums: ['emoney'],
    category: 'Entertainment',
    amount: 45000,
    description: 'Cinema ticket',
  },
];

const History: React.FC = () => {
  const Item: React.FC<ISpend> = props => {
    return (
      <View className="p-2 px-4 bg-white rounded-lg shadow flex flex-row gap-2 w-full">
        <View className="w-10 h-10 bg-purple-500 rounded-full" />

        <View className="flex-1 flex flex-row justify-between">
          <View className="flex flex-col gap-2">
            <Text className="text-sm">{props.title}</Text>
            <Text className="text-[10px]">{props.description}</Text>
          </View>

          <View>
            <Text className="text-xs">{props.amount}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex flex-col gap-1 bg-white px-3 py-5 rounded-2xl" style={{maxHeight: 350}}>
      <FlatList
        data={datas}
        renderItem={({item}) => <Item {...item} />}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingVertical: 10,
          gap: 6,
        }}
      />
    </View>
  );
};

export default History;
