import {CategoryIconMap} from '@/constants';
import {Banknote as IconBanknote, LucideIcon, Wallet as IconWallet, Calendar, Target} from 'lucide-react-native';

type IOption<T extends string | number> = {
  label: string;
  value: T;
};

type IOptionWithIcon<T extends string | number> = {
  label: string;
  value: T;
  icon?: LucideIcon;
};

export const providerOptions: IOption<string>[] = [
  {label: 'Cash', value: 'cash'},
  {label: 'Bank Account', value: 'bank'},
  {label: 'GoPay', value: 'gopay'},
  {label: 'DANA', value: 'dana'},
  {label: 'ShopeePay', value: 'shopeepay'},
  {label: 'OVO', value: 'ovo'},
];

export const mediumOptions: IOptionWithIcon<string>[] = [
  {
    label: 'E-money',
    value: 'emoney',
    icon: IconWallet,
  },
  {
    label: 'Cash',
    value: 'cash',
    icon: IconBanknote,
  },
];

export const categoryOptions: IOptionWithIcon<string>[] = [
  {
    label: 'Food',
    value: 'food',
    icon: CategoryIconMap['food' as keyof typeof CategoryIconMap],
  },
  {
    label: 'Transport',
    value: 'transport',
    icon: CategoryIconMap['transport' as keyof typeof CategoryIconMap],
  },
  {
    label: 'Groceries',
    value: 'groceries',
    icon: CategoryIconMap['groceries' as keyof typeof CategoryIconMap],
  },
  {
    label: 'Entertainment',
    value: 'entertainment',
    icon: CategoryIconMap['entertainment' as keyof typeof CategoryIconMap],
  },
  {
    label: 'OVO',
    value: 'ovo',
    icon: CategoryIconMap['ovo' as keyof typeof CategoryIconMap],
  },
];

export const budgetOptions: {label: string; rangeDate?: number; icon: LucideIcon}[] = [
  {
    label: 'weekly',
    rangeDate: 7,
    icon: Target,
  },
  {
    label: 'monthly',
    rangeDate: 30,
    icon: Calendar,
  },

  {
    label: 'custom',
    icon: Target,
  },
];

export const currencyOptions: IOption<string>[] = [
  {
    label: 'IDR',
    value: 'IDR',
  },
  {label: 'USD', value: 'USD'},
  {label: 'SGD', value: 'SGD'},
];
