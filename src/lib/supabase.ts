import {createClient} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState, Platform} from 'react-native';
import {PUBLIC_SUPABASE_URL, PUBLIC_PUBLISHABLE_KEY} from '@env';

export const supabaseUrl = PUBLIC_SUPABASE_URL;
export const supabasePublishableKey = PUBLIC_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    flowType: 'pkce',
    autoRefreshToken: false,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

if (Platform.OS !== 'web') {
  AppState.addEventListener('change', state => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
