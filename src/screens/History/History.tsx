import {ModalWrapper} from '@/components';
import {Text, View} from 'react-native';
import Filter from './components/Filter';
import {useState} from 'react';

export const History = () => {
  const [filter, setFilter] = useState<{
    budget: string;
    categories: string[];
  }>({
    budget: '',
    categories: [],
  });

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
        <Text>History lies here</Text>
      </View>
    </ModalWrapper>
  );
};
