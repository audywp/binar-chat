import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import Root from './src/routes';
import {persistor, store} from './src/store/store';
import messaging from '@react-native-firebase/messaging';

export default function App() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Root />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
