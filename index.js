/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function Main() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
           {/* App */}
          <HomeScreen />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>  
      </PaperProvider>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
