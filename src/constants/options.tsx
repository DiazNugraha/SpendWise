import {CategoryIconMap} from '@/constants';
import {Banknote as IconBanknote, LucideIcon, Wallet as IconWallet} from 'lucide-react-native';

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
  {
    label: 'Cash',
    value: 'cash',
  },
  {
    label: 'GoPay',
    value: 'gopay',
  },
  {
    label: 'Dana',
    value: 'dana',
  },
  {
    label: 'ShopeePay',
    value: 'shopeepay',
  },
  {
    label: 'OVO',
    value: 'ovo',
  },
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
