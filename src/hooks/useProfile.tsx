import {useProfileProvider} from '@/contexts/ProfileProvider';

const useProfile = () => {
  const providerContext = useProfileProvider();
  return providerContext;
};

export default useProfile;
