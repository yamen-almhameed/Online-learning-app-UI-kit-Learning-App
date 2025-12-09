import * as React from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './core/store';
import { loadAuthStateAsync } from './core/store';
import { ThemeProvider } from './core/context/ThemeContext';
import { AppRoutes, NavigationStateProvider } from './navigation';
import { createNavigationContainerRef } from '@react-navigation/native';
import './core/localization/i18n';

export const navigationRef = createNavigationContainerRef();

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'ViewPropTypes will be removed',
]);

const App: React.FC = () => {
  React.useEffect(() => {
    store.dispatch(loadAuthStateAsync());
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <NavigationStateProvider>
              <NavigationContainer ref={navigationRef}>
                <StatusBar
                  barStyle="dark-content"
                  backgroundColor="transparent"
                  translucent
                />
                <AppRoutes />
              </NavigationContainer>
            </NavigationStateProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
