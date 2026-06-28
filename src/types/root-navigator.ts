import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootNavigatorParamList = {
  MainTabs: undefined;
  Expense: undefined;
  Budget: undefined;
  BudgetForm: {
    budgetType: string;
    id?: string;
  };
  History: undefined;
  [key: string]: any;
};

export type RootNavigationProp = NativeStackNavigationProp<RootNavigatorParamList>;
