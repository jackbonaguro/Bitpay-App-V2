import './shim';
// if (__DEV__) {
//   import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
// }
// import Reactotron from 'reactotron-react-native';
// require('react-native-crypto');

import {self} from 'react-native-threads';
import Mnemonic from 'bitcore-mnemonic';

// Reactotron.log('initializing');
// self.onmessage = m => {
//   Reactotron.log('self.onMessage');
//   console.log('self.onMessage');
//   return self.postMessage('Hello World' + m);
// };

let count = 0;

// self.onmessage = message => {
//   // Reactotron.log(`THREAD: got message ${message}`);
//
//   count++;
//
//   self.postMessage(`Message #${count} from worker thread!`);
// };


self.onmessage = m => {
  let message;
  try {
    message = JSON.parse(m);
    //throw new Error(`${message.method}`);
    if (typeof message.id === 'undefined') {
      throw new Error('CryptoThread message has no id');
    }
  } catch (e) {
    // We don't even have id, so message is garbage. Emit for global error handler
    return self.postMessage(
      JSON.stringify({
        err: e.message,
      }),
    );
  }

  try {
    switch (message.method) {
      case 'deriveXPriv': {
        let {mnemonic, path} = message.data;
        return new Promise(resolve => {
          // let seed = new Mnemonic(mnemonic);
          // let xpriv = seed.toHDPrivateKey();
          // console.log(xpriv.toString());
          // let finalXpriv = xpriv.derive(path);
          // console.log(finalXpriv.toString());
          // return resolve(finalXpriv.toString());
          return resolve('ABCD');
          // return resolve(`${JSON.stringify(Mnemonic)}`);
          // return resolve(Mnemonic.Words.ENGLISH.toString());
        }).then(xpriv => {
          self.postMessage(
            JSON.stringify({
              id: message.id,
              data: {
                xpriv,
              },
            }),
          );
        });
      }
      default: {
        throw new Error(
          `CryptoThread message has invalid method: ${message.method}`,
        );
      }
    }
  } catch (e) {
    return self.postMessage(
      JSON.stringify({
        id: message.id,
        err: e.message,
      }),
    );
  }
};
