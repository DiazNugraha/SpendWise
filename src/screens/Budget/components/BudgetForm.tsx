import {
  ColorSelector,
  DateInputField,
  DecimalInputField,
  FormButtonWrapper,
  IconSelector,
  ModalWrapper,
  SwitchButton,
} from '@/components';
import {budgetSchema, IBudgetInput} from '@/constants/schemas';
import {Formik} from 'formik';
import {BellRingIcon} from 'lucide-react-native';
import {useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import * as Icons from 'lucide-react-native';

// type BudgetDetailRouteProps = RouteProp<RootNavigatorParamList, 'BudgetDetail'>;

const BudgetForm: React.FC = () => {
  // const route = useRoute<BudgetDetailRouteProps>();
  // const {budgetType} = route.params;

  const [icon, setIcon] = useState<string>('Calendar');
  const [iconColor, setIconColor] = useState<string>();
  const [enableNotify, setEnableNotify] = useState<boolean>(true);

  const submitForm = (values: IBudgetInput) => {
    console.log(values);
  };

  return (
    <ModalWrapper title="Set Saving Goal">
      <Formik initialValues={budgetSchema.getDefault()} validationSchema={budgetSchema} onSubmit={submitForm}>
        {({handleSubmit}) => (
          <FormButtonWrapper onSubmit={handleSubmit} text="Set Budget Plan">
            <ScrollView contentContainerClassName="gap-3 px-4">
              <View className="w-full justify-center items-center px-5 flex flex-col gap-4">
                <IconSelector
                  className="p-5 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: iconColor ? iconColor : '#9C9C9C',
                  }}
                  value={icon ? (icon as keyof typeof Icons) : 'Calendar'}
                  onChange={value => setIcon(value)}
                />
                <View className="flex flex-col gap-2 items-center justify-center">
                  <ColorSelector label="Choose color" value={iconColor ?? ''} onChange={value => setIconColor(value)} />
                </View>
              </View>

              <View className="flex flex-col gap-4 rounded-2xl p-5 bg-white">
                <DecimalInputField name="amount" label="Target Amount" placeholder="1.000" />
                <DateInputField name="dateRange" label="Target Date" />
              </View>

              <View className="flex flex-row justify-between items-center p-5 bg-white rounded-2xl">
                <View className="flex flex-row gap-2 items-center">
                  <View className="p-3 rounded-full bg-[#6D28D9]/20">
                    <BellRingIcon color={'#6D28D9'} />
                  </View>
                  <View className="flex flex-col gap-2">
                    <Text className="font-medium">Budget Alerts</Text>
                    <Text className="font-light text-[10px]">Get notified at 80% usage</Text>
                  </View>
                </View>
                <SwitchButton value={enableNotify} onChange={value => setEnableNotify(value)} />
              </View>
            </ScrollView>
          </FormButtonWrapper>
        )}
      </Formik>
    </ModalWrapper>
  );
};

export default BudgetForm;
