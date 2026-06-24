import {CarouselChips} from '@/components';
import {budgetOptions, categoryOptions} from '@/constants/options';
import {Text, View} from 'react-native';

interface IFilterValue {
  budget: string;
  categories: string[];
}

interface IFilterProps {
  setSelectedBudget: (val: string) => void;
  setSelectedCategories: (val: string[]) => void;
  value: IFilterValue;
  onClear: () => void;
}

const Filter: React.FC<IFilterProps> = ({onClear, setSelectedBudget, setSelectedCategories, value}) => {
  const selectedBudget = value.budget;
  const selectedTypes = value.categories;

  const selectBudgetOptions = [
    ...budgetOptions.map(val => {
      return {
        label: val.label,
        value: val.rangeDate?.toString() || 'custom',
      };
    }),
  ];
  const selectTypeOptions = [
    {
      label: 'All Categories',
      value: 'all',
    },
    ...categoryOptions,
  ];

  const handleClear = () => {
    onClear();
  };

  return (
    <View className="flex flex-col gap-3">
      <CarouselChips
        value={selectedBudget}
        onChange={val => (typeof val === 'string' ? setSelectedBudget(val) : {})}
        options={selectBudgetOptions}
      />

      <CarouselChips
        value={selectedTypes}
        onChange={val => {
          if (!Array.isArray(val)) return;

          if (!selectedTypes.includes('all')) {
            if (val.includes('all') || (!val.includes('all') && val.length === selectTypeOptions.length - 1)) {
              return setSelectedCategories(['all', ...categoryOptions.map(e => e.value)]);
            }
          }

          if (selectedTypes.includes('all')) {
            if (val.length === selectTypeOptions.length - 1 && !val.includes('all')) {
              return setSelectedCategories([]);
            }
            if (val.length !== selectTypeOptions.length) {
              return setSelectedCategories(val.filter(e => e !== 'all'));
            }
          }

          setSelectedCategories(Array.isArray(val) ? val : [val]);
        }}
        options={selectTypeOptions}
        multiple
      />

      {(selectedBudget !== '' || selectedTypes.length > 0) && (
        <View className="flex flex-row px-5 py-5 items-center justify-between gap-2 bg-white rounded-xl">
          <View className="flex flex-col">
            <Text className="font-medium text-sm text-slate-400">Showing:</Text>

            {selectedBudget !== '' && (
              <Text className="capitalize font-medium text-sm text-slate-400">
                {selectBudgetOptions.find(e => e.value === selectedBudget)?.label}
              </Text>
            )}
            {selectedTypes.length > 0 && (
              <Text className="capitalize font-medium text-sm text-slate-400">
                {selectedTypes
                  .filter(e => e !== 'all')
                  .filter(e => e !== '')
                  .join(', ')}{' '}
              </Text>
            )}
          </View>

          <Text onPress={handleClear} className="text-base text-purple-600 font-medium">
            Clear
          </Text>
        </View>
      )}
    </View>
  );
};

export default Filter;
