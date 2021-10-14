import EventEmitter from 'events';
import {Thread} from 'react-native-threads';

/*
 * CryptoThread Controller
 *
 * Spin up a new process to do the crypto heavy lifting,
 * and promisify ipc calls to it.
 * */

let thread;
let threadEmitter: EventEmitter;
let taskCounter = 0; // TODO: Make something that won't overflow

const prepMessage = (method, data) => {
  let task = {
    method,
    data,
    id: taskCounter,
  };
  taskCounter++;
  return task;
};

const messageGenerator = (method, data) => {
  let task = prepMessage(method, data);
  return Promise.race([
    new Promise((resolve, reject) => {
      thread.postMessage(JSON.stringify(task));
      // Await reply that matches id
      console.log('ThreadEmitter: ', JSON.stringify(threadEmitter));
      const messageListener = function (message) {
        if (message.id === task.id) {
          threadEmitter.removeListener('message', messageListener);
          if (message.err) {
            return reject(new Error(message.err));
          }
          return resolve(message.data);
        }
      };
      threadEmitter.addListener(
        'message',
        messageListener,
      );
    }),
    new Promise((_, reject) => {
      // Reject for timeout after 5 seconds
      setTimeout(() => {
        return reject(new Error(`Timeout on cryptoThread for task: ${task}`));
      }, 10000);
    })
  ]);
};

const deriveXPriv = (mnemonic, path) => {
  return messageGenerator('deriveXPriv', { mnemonic: mnemonic.toString(), path }).then(data => data.xpriv);
  // console.log('thread.postMessage Hey there');
  // thread.postMessage('Hey there');
};
export default {
  initialize: async () => {
    thread = new Thread('./cryptoWorker.js');
    threadEmitter = new EventEmitter();
    thread.onmessage = (m) => {
      try {
        console.log('thread.onMessage');
        const message = JSON.parse(m);
        if (message.err && !message.id) {
          // Log global error since it will not be handled
          throw new Error(message.err || 'Received response without id');
        }
        console.log(m);
        threadEmitter.emit('message', message);
      } catch (e) {
        console.error(e);
      }
    };
  },
  deriveXPriv,
};
