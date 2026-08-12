import {CATEGORY_DB_DATA, CategoryIconMap} from '@/constants';
import {formatDate, NumberFormatter} from '@/helpers';
import {useProfile} from '@/hooks';
import {ChevronDown, ChevronUp, Trash2Icon} from 'lucide-react-native';
import {useState} from 'react';
import {Pressable, Text, View} from 'react-native';

const CHAR_MAX = 30;

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

interface IExpenseCardProps {
  item: IExpense;
  onRemove?: () => void;
}

export const ExpenseCard: React.FC<IExpenseCardProps> = ({item, onRemove}) => {
  const {primaryCurrencySymbol} = useProfile();

  const [showMoreDesc, setShowMoreDesc] = useState<boolean>(false);
  const getCategoryItems = (key: string) => {
    return CATEGORY_DB_DATA.find(e => e.key === key);
  };

  const showDescription = () => {
    if (!item.description) return '';
    const maxLength = CHAR_MAX;
    if (item.description.length <= maxLength) return item.description;
    if (showMoreDesc) {
      return item.description;
    }
    return `${item.description?.slice(0, maxLength)}...`;
  };

  const category = getCategoryItems(item.category);
  const Icon = CategoryIconMap[category?.key as keyof typeof CategoryIconMap];
  return (
    <View className={`flex flex-col ${showMoreDesc ? 'gap-2' : ''}`}>
      <Pressable
        className="px-3 py-2 bg-white rounded-lg flex flex-row gap-2 w-full"
        onPress={() => {
          if (item.description && item.description.length > CHAR_MAX) {
            setShowMoreDesc(prev => !prev);
          } else if (onRemove) {
            setShowMoreDesc(prev => !prev);
          }
          return;
        }}>
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
            <Text className="text-sm font-medium">{item.title}</Text>
            <View className="flex flex-row gap-2 items-center">
              {item.description && !showMoreDesc && (
                <Text className="text-[10px] font-light">{showDescription()} </Text>
              )}
              {item.description && !showMoreDesc && item.description.length > CHAR_MAX && (
                <ChevronDown onPress={() => setShowMoreDesc(true)} size={10} />
              )}
            </View>
          </View>

          <View className="flex flex-row items-center gap-2">
            <View className="flex flex-col justify-center items-end gap-2">
              <Text className="text-sm font-medium">
                {primaryCurrencySymbol} {formatter.format(item.amount)}
              </Text>
              <Text className="text-[10px] font-light">
                {formatDate(item.createdAt, {
                  dateTimeOption: {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  },
                })}
              </Text>
            </View>
            {onRemove && showMoreDesc && (
              <Pressable
                className="flex rounded-lg p-2 items-center justify-center bg-red-500"
                onPress={() => {
                  setShowMoreDesc(false);
                  onRemove();
                }}>
                <Trash2Icon color={'white'} />
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>

      {showMoreDesc && item.description && item.description.length > CHAR_MAX && (
        <View className="px-3 py-2 bg-white rounded-lg flex-1 flex flex-col gap-2">
          <Text className="text-sm font-medium">Description:</Text>
          <Text className="text-[10px] font-light">{showDescription()}</Text>
          <Pressable className="flex flex-row gap-2 items-center" onPress={() => setShowMoreDesc(false)}>
            <Text className="text-[10px] font-medium">Show Less</Text>
            <ChevronUp size={10} />
          </Pressable>
        </View>
      )}
    </View>
  );
};
