import './shim.js';
// import crypto from 'crypto';
// require('crypto');

import {AppRegistry} from 'react-native';
import Root from './src/Root';
import React from 'react';
import {name as appName} from './app.json';
import getStore from './src/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

export const {store, persistor} = getStore();

const ReduxProvider = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {storeRehydrated => storeRehydrated && <Root />}
      </PersistGate>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => ReduxProvider);
