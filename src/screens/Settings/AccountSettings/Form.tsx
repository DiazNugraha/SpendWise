import {Formik, FormikProps} from 'formik';
import {useCallback, useMemo, useRef} from 'react';
import * as yup from 'yup';
import {useProfile} from '@/hooks';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {InputField} from '@/components';
import {Pressable, Text, View} from 'react-native';
import {userRepo} from '@/db/repositories';
import Toast from 'react-native-toast-message';

const accountSchema = yup.object({
  firstName: yup.string().default('').required('First Name is required'),
  lastName: yup.string().default(''),
});

type IAccountInput = yup.InferType<typeof accountSchema>;

export const AccountForm: React.FC = () => {
  const {user: userProfile, onRefetch} = useProfile();
  const navigation = useNavigation();

  const formRef = useRef<FormikProps<IAccountInput>>(null);

  const initialValues = useMemo(() => accountSchema.getDefault(), []);

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
      formRef.current?.resetForm({
        values: {
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
        },
      });
    } else {
      formRef.current?.resetForm({
        values: accountSchema.getDefault(),
      });
    }
  }, [userProfile]);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [fetchUser]),
  );

  return (
    <Formik innerRef={formRef} initialValues={initialValues} onSubmit={handleOnSubmit}>
      {({handleSubmit}) => (
        <View className="flex flex-col flex-1 gap-2">
          <InputField name="firstName" label="First Name" required placeholder="John" />
          <InputField name="lastName" label="Last Name" placeholder="Doe" />
          <Pressable className="main-button-container mt-5" onPress={handleSubmit}>
            <Text className="font-medium text-white">Submit</Text>
          </Pressable>
        </View>
      )}
    </Formik>
  );
};
