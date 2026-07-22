import {supabase} from '@/lib';
import {Alert} from 'react-native';
import {URL, URLSearchParams} from 'react-native-url-polyfill';

export const extractUserFromCallbackUrl = async (callbackUrl: string) => {
  const url = new URL(callbackUrl);

  const hash = url.hash.slice(1);
  if (!hash) return;

  const params = new URLSearchParams(hash);

  const access_token = params.get('access_token');
  const refresh_token = params.get('refresh_token');

  if (!access_token || !refresh_token) {
    return;
  }

  const {error} = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    console.error(error);
    Alert.alert('Error', error.message || 'An unknown error occurred');
    return;
  }

  const {
    data: {session},
  } = await supabase.auth.getSession();

  return session?.user;
};
