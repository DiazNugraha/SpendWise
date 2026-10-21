import {supabase} from '@/lib';
import {URL} from 'react-native-url-polyfill';

export const extractUserFromCallbackUrl = async (callbackUrl: string) => {
  const parsedUrl = new URL(callbackUrl);
  const errorDescription = parsedUrl.searchParams.get('error_description');

  if (errorDescription) {
    throw new Error(errorDescription);
  }

  const code = parsedUrl.searchParams.get('code');

  if (!code) {
    throw new Error('No authorization code received from Google.');
  }

  const {data, error: exchangeError} = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) throw exchangeError;

  const {
    data: {session},
  } = await supabase.auth.getSession();

  const supabaseUserId = session?.user.id;

  return {
    session: data.session,
    supabaseUserId,
  };
};
