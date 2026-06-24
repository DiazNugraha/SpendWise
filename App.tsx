/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Container from '@/Container';
import './global.css';
import Toast from 'react-native-toast-message';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useMigrations} from 'drizzle-orm/op-sqlite/migrator';
import {db} from '@/db/client';
import migrations from '@/db/migrations/migrations';
import {Text, View} from 'react-native';
import {useEffect} from 'react';
import {seedDatabase} from '@/db/seeders/seed';

function App() {
  const {success, error} = useMigrations(db, migrations);

  useEffect(() => {
    if (success) {
      seedDatabase().catch(console.error);
    }
  }, [success]);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppContent />
      <Toast />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return <Container />;
}

export default App;
