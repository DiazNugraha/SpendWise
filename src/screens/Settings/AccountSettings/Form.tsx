import {Formik, FormikProps} from 'formik';
import {useCallback, useMemo, useRef, useState} from 'react';
import * as yup from 'yup';
import {useProfile, useUserRepo} from '@/hooks';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {InputField} from '@/components';
import {Pressable, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {SquarePenIcon, XIcon} from 'lucide-react-native';

const accountSchema = yup.object({
  firstName: yup.string().default('').required('First Name is required'),
  lastName: yup.string().default(''),
});

type IAccountInput = yup.InferType<typeof accountSchema>;

export const AccountForm: React.FC = () => {
  const {user: userProfile, onRefetch} = useProfile();
  const userRepo = useUserRepo();
  const navigation = useNavigation();

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const formRef = useRef<FormikProps<IAccountInput>>(null);

  const initialValues = useMemo(() => accountSchema.getDefault(), []);

  const resetForm = (defaultValue?: {firstName: string; lastName: string}) => {
    if (defaultValue) {
      formRef.current?.resetForm({
        values: {
          firstName: defaultValue.firstName,
          lastName: defaultValue.lastName,
        },
      });
      return;
    }
    formRef.current?.resetForm({
      values: accountSchema.getDefault(),
    });
  };

  const handleOnSubmit = async (values: IAccountInput) => {
    if (!userProfile?.id) return;

    const result = await userRepo.updateUser(userProfile.id, {
      ...values,
    });

    if (result) {
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'User updated successfully',
      });

      setIsEditMode(false);

      onRefetch();

      return navigation.goBack();
    }

    Toast.show({
      type: 'error',
      text1: 'Error!',
      text2: 'Failed to update user. Please try again.',
    });
  };

  const fetchUser = useCallback(async () => {
    if (userProfile) {
      resetForm({firstName: userProfile.firstName, lastName: userProfile.lastName});
    } else {
      resetForm();
    }
  }, [userProfile]);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [fetchUser]),
  );

  return (
    <View className="flex flex-col gap-2">
      <View className="flex flex-row justify-end">
        <Pressable
          className={`p-2 rounded-full ${
            isEditMode ? 'border-2 border-[#6D28D9]' : 'border-2 border-[#6D28D9] bg-[#6D28D9]'
          }`}
          onPress={() => {
            if (isEditMode) {
              resetForm({firstName: userProfile?.firstName ?? '', lastName: userProfile?.lastName ?? ''});
            }
            setIsEditMode(prev => !prev);
          }}>
          {isEditMode ? <XIcon color={'#6D28D9'} /> : <SquarePenIcon color={'white'} />}
        </Pressable>
      </View>

      <Formik innerRef={formRef} initialValues={initialValues} onSubmit={handleOnSubmit}>
        {({handleSubmit}) => (
          <View className="flex flex-col flex-1 gap-2">
            <InputField
              name="firstName"
              label="First Name"
              required={isEditMode ? true : false}
              placeholder="John"
              disabled={!isEditMode}
            />
            <InputField name="lastName" label="Last Name" placeholder="Doe" disabled={!isEditMode} />
            {isEditMode && (
              <Pressable className="main-button-container mt-5" onPress={handleSubmit}>
                <Text className="font-medium text-white">Submit</Text>
              </Pressable>
            )}
          </View>
        )}
      </Formik>
    </View>
  );
};
