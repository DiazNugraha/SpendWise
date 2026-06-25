import {
  ColorSelector,
  DateInputField,
  DecimalInputField,
  FormButtonWrapper,
  InputField,
  IconSelector,
  ModalWrapper,
  SwitchButton,
} from '@/components';
import {budgetSchema, IBudgetInput} from '@/constants/schemas';
import {Formik, FormikProps} from 'formik';
import {BellRingIcon} from 'lucide-react-native';
import {Text, View} from 'react-native';
import * as Icons from 'lucide-react-native';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {budgetRepo} from '@/db/repositories';
import Toast from 'react-native-toast-message';
import {RouteProp, useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {RootNavigatorParamList} from '@/types';
import {useAlert} from '@/hooks';
import {capitalizeFirstLetter} from '@/helpers';

type BudgetDetailRouteProps = RouteProp<RootNavigatorParamList, 'BudgetForm'>;

const toFormValues = (budgetType: BudgetType, budget?: IBudgetInput) => {
  if (!budget) {
    const defaults = budgetSchema.getDefault();
    const startDate = new Date();
    const endDate = new Date(startDate);

    if (budgetType === 'weekly') {
      endDate.setDate(endDate.getDate() + 2);
    } else if (budgetType === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    return budgetSchema.cast({
      ...defaults,
      type: budgetType ?? defaults.type,
      dateRange: {
        ...defaults.dateRange,
        startDate,
        endDate,
      },
    }) as IBudgetInput;
  }

  return budgetSchema.cast({
    ...budget,
  });
};

const BudgetForm: React.FC = () => {
  const route = useRoute<BudgetDetailRouteProps>();
  const {budgetType, isEdit} = route.params;
  const navigation = useNavigation();
  const formRef = useRef<FormikProps<IBudgetInput>>(null);

  const {alert} = useAlert();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitForm = async (values: IBudgetInput) => {
    setIsLoading(true);

    const existingBudget = await budgetRepo.findActiveByType(values.type as BudgetType);
    if (existingBudget.length > 0) {
      alert({
        title: 'Active Budget Plan Exist!',
        description: `You already have an active ${values.type} plan. Budget plan of ${existingBudget[0].amount}. Creating a new budget will replace your current plan. Do you want to continue?`,
        onConfirm: async () => {
          await budgetRepo.setToInactive(existingBudget[0].id);
          await createBudget(values);
        },
        confirmButtonLabel: 'Yes, Continue',
      });

      setIsLoading(false);
      return;
    }

    await createBudget(values);
  };

  const createBudget = async (values: IBudgetInput) => {
    let adjustedDateType = {
      startDate: values.dateRange.startDate,
      endDate: values.dateRange.endDate,
    };

    if (typeof values.dateRange.startDate === 'string') {
      adjustedDateType = {
        startDate: new Date(values.dateRange.startDate),
        endDate: new Date(values.dateRange.startDate),
      };
    }
    const title = values.title ? values.title : capitalizeFirstLetter(values.type);
    const result = await budgetRepo.create({
      type: values.type as BudgetType,
      icon: values.icon,
      iconColor: values.iconColor,
      title: title,
      amount: values.amount,
      enableNotify: values.enableNotify,
      startDate: adjustedDateType.startDate,
      endDate: adjustedDateType.endDate,
    });

    setIsLoading(false);

    if (result) {
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Budget goal created successfully',
      });
      return navigation.goBack();
    }

    Toast.show({
      type: 'error',
      text1: 'Error!',
      text2: 'Failed to create budget goal. Please try again.',
    });
  };

  const initialValues = useMemo<IBudgetInput>(() => {
    return toFormValues(budgetType as BudgetType);
  }, [budgetType]);

  const fetchExistingActiveBudget = useCallback(async () => {
    const fetchedItems = await budgetRepo.findActiveByType(budgetType as BudgetType);
    const activeBudget = fetchedItems[0];
    if (activeBudget) {
      formRef.current?.resetForm({
        values: toFormValues(budgetType as BudgetType, {
          title: activeBudget.title,
          amount: activeBudget.amount,
          type: activeBudget.type,
          dateRange: {
            startDate: new Date(activeBudget.startDate),
            endDate: new Date(activeBudget.endDate),
          },
          enableNotify: activeBudget.enableNotify,
          icon: activeBudget.icon as string,
          iconColor: activeBudget.iconColor as string,
        }),
      });
    }
  }, [budgetType]);

  useEffect(() => {
    formRef.current?.resetForm({values: initialValues});
  }, [initialValues]);

  useFocusEffect(
    useCallback(() => {
      fetchExistingActiveBudget();
    }, [fetchExistingActiveBudget]),
  );

  return (
    <ModalWrapper title="Set Saving Goal">
      <Formik innerRef={formRef} initialValues={initialValues} validationSchema={budgetSchema} onSubmit={submitForm}>
        {({handleSubmit, getFieldMeta, setFieldValue}) => {
          const icon = getFieldMeta('icon').value as string;
          const iconColor = getFieldMeta('iconColor').value as string;
          const enableNotify = getFieldMeta('enableNotify').value as boolean;

          return (
            <FormButtonWrapper onSubmit={handleSubmit} text="Set Budget Plan" isLoading={isLoading}>
              <View className="w-full justify-center items-center px-5 flex flex-col gap-4">
                <IconSelector
                  className="p-5 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: iconColor ? iconColor : '#9C9C9C',
                  }}
                  value={icon ? (icon as keyof typeof Icons) : 'Calendar'}
                  onChange={value => setFieldValue('icon', value)}
                />
                <View className="flex flex-col gap-2 items-center justify-center">
                  <ColorSelector
                    label="Choose color"
                    value={iconColor ?? ''}
                    onChange={value => setFieldValue('iconColor', value)}
                  />
                </View>
              </View>

              <View className="flex flex-col gap-4 rounded-2xl p-5 bg-white">
                <DecimalInputField name="amount" label="Target Amount" placeholder="1.000" required autoFocus={false} />
                <DateInputField
                  name="dateRange"
                  label="Target Date"
                  disabled={budgetType !== 'custom' || isEdit}
                  required
                />
                <InputField name="title" label="Budget Title" placeholder="Name your budget plan" />
              </View>

              <View className="flex flex-row justify-between items-center p-5 bg-white rounded-2xl">
                <View className="flex flex-row gap-2 items-center">
                  <View className="p-3 rounded-full bg-[#6D28D9]/20">
                    <BellRingIcon color={'#6D28D9'} />
                  </View>
                  <View className="flex flex-col gap-2">
                    <Text className="font-medium">Budget Alert</Text>
                    <Text className="font-light text-[10px]">Get notified at 80% usage</Text>
                  </View>
                </View>
                <SwitchButton value={enableNotify} onChange={value => setFieldValue('enableNotify', value)} />
              </View>
            </FormButtonWrapper>
          );
        }}
      </Formik>
    </ModalWrapper>
  );
};

export default BudgetForm;
