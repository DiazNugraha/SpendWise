/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Container from '@/Container';
import './global.css';

import {SafeAreaProvider} from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return <Container />;
}

export default App;
