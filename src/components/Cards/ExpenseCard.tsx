import {CATEGORY_DB_DATA, CategoryIconMap} from '@/constants';
import {formatDate, NumberFormatter} from '@/helpers';
import {ChevronDown, ChevronUp} from 'lucide-react-native';
import {useState} from 'react';
import {Pressable, Text, View} from 'react-native';

const CHAR_MAX = 30;

const formatter = new NumberFormatter({
  maxFractionDigits: 2,
});

export const ExpenseCard: React.FC<IExpense> = props => {
  const [showMoreDesc, setShowMoreDesc] = useState<boolean>(false);
  const getCategoryItems = (key: string) => {
    return CATEGORY_DB_DATA.find(e => e.key === key);
  };

  const showDescription = () => {
    if (!props.description) return '';
    const maxLength = CHAR_MAX;
    if (props.description.length <= maxLength) return props.description;
    if (showMoreDesc) {
      return props.description;
    }
    return `${props.description?.slice(0, maxLength)}...`;
  };

  const category = getCategoryItems(props.category);
  const Icon = CategoryIconMap[category?.key as keyof typeof CategoryIconMap];
  return (
    <View className={`flex flex-col ${showMoreDesc ? 'gap-2' : ''}`}>
      <Pressable
        className="px-3 py-2 bg-white rounded-lg flex flex-row gap-2 w-full"
        onPress={() => {
          if (props.description && props.description.length > CHAR_MAX) {
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
            <Text className="text-sm font-medium">{props.title}</Text>
            <View className="flex flex-row gap-2 items-center">
              {props.description && !showMoreDesc && (
                <Text className="text-[10px] font-light">{showDescription()} </Text>
              )}
              {props.description && !showMoreDesc && props.description.length > CHAR_MAX && (
                <ChevronDown onPress={() => setShowMoreDesc(true)} size={10} />
              )}
            </View>
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
      </Pressable>

      {showMoreDesc && (
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
