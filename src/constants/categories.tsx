import {Utensils, Car, ShoppingCart, Zap, Film} from 'lucide-react-native';

export type CategoryDB = {
  key: string;
  label: string;
  color: string; // bold/base color
};

export const CategoryIconMap = {
  food: Utensils,
  transport: Car,
  groceries: ShoppingCart,
  utilities: Zap,
  entertainment: Film,
} as const;

export const CATEGORY_DB_DATA: CategoryDB[] = [
  {
    key: 'food',
    label: 'Food',
    color: '#D97706', // amber-600
  },
  {
    key: 'transport',
    label: 'Transport',
    color: '#2563EB', // blue-600
  },
  {
    key: 'groceries',
    label: 'Groceries',
    color: '#16A34A', // green-600
  },
  {
    key: 'utilities',
    label: 'Utilities',
    color: '#7C3AED', // violet-600
  },
  {
    key: 'entertainment',
    label: 'Entertainment',
    color: '#DB2777', // pink-600
  },
];
