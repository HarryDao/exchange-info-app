import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import store, { createStore, AppState } from 'src/redux/store';
import { Background } from 'src/components/Background';

export interface RootProps {
  initialState?: AppState;
  children: ReactNode;
}

export const Root = (() => {
  let customizedStore: typeof store;

  return class RootWrapper extends React.PureComponent<RootProps> {
    static getStore() {
      return customizedStore;
    }

    render() {
      const { initialState, children } = this.props;

      customizedStore = initialState ? createStore(initialState) : store;

      const persistor = persistStore(store);
      persistor.flush();

      return (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SafeAreaProvider>
              <Background>{children}</Background>
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      );
    }
  };
})();
