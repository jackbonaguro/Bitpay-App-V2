import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Mnemonic from 'bitcore-mnemonic';
import crypto from 'crypto';
// import { Buffer } from 'buffer';
import CryptoThread from '../../../services/CryptoThread';

let doStuff = (seed: any) => {
  return new Promise(resolve => {
    console.log(seed.toString());
    let xpriv = seed.toHDPrivateKey();
    console.log(xpriv.toString());
    let finalXpriv = xpriv.derive("m/44'/0'/0'/0/0");
    console.log(finalXpriv.toString());
    return resolve(finalXpriv.toString());
  });
};

let doStuffOnThread = (seed: any) => {
  return new Promise(resolve => {
    CryptoThread.deriveXPriv(seed, "m/44'/0'/0'/0/0")
      .then(xpriv => {
        return resolve(xpriv);
      })
      .catch();
  });
};

const DemoComponent = ({ title, color, onPress}) => {
  const [xpriv, setXpriv] = useState(null);
  return (
    <View
      style={{
        backgroundColor: color,
        padding: 10,
        margin: 10,
        borderRadius: 10,
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: '#00000088',
        }}>
        {title}
      </Text>
      <TextInput
        style={{
          color: '#00000088',
          backgroundColor: '#ffffff44',
          borderRadius: 5,
          padding: 25,
          margin: 10,
          textAlign: 'center',
        }}>
        {xpriv || '---'}
      </TextInput>
      <TouchableOpacity
        style={{
          backgroundColor: '#00000022',
          borderRadius: 5,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
        onPress={() => {
          onPress().then(newXpriv => {
            return setXpriv(newXpriv);
          });
        }}>
        <Text>Test</Text>
      </TouchableOpacity>
    </View>
  );
};

const LoginScreen = () => {
  const [seed, setSeed] = useState(null);
  const [threadInitialized, setThreadInitialized] = useState(false);

  useEffect(() => {
    crypto.randomBytes(16, (err, buff) => {
      let mnemonic = Mnemonic.fromSeed(
        // Buffer.from('78d993442ae71b5a06ecd15bd44ada452ac965118a312caba4159f41a6c6320feced94f53ed5a9511281027b0d62360fe3ad5623b31dafa026a1bd672803ecc7'),
        buff,
        Mnemonic.Words.ENGLISH,
      );
      setSeed(mnemonic);
    });
    CryptoThread.initialize().then(() => {
      setThreadInitialized(true);
    });
  }, []);

  return (
    <ScrollView
      style={{
        width: 100 + '%',
        height: 100 + '%',
      }}
      contentContainerStyle={{
        padding: 10,
      }}>
      <Text>Crypto Thread Initialized: {threadInitialized ? 'Yes' : 'No'}</Text>
      <Text>Mnemonic:</Text>
      <TextInput>{seed ? seed.toString() : '---'}</TextInput>
      <DemoComponent
        title={'Direct Method Call'}
        color={'#ff8888'}
        onPress={() => {
          return doStuff(seed);
        }}
      />
      <DemoComponent
        title={'Delegate Call to Worker'}
        color={'#88ff88'}
        onPress={() => {
          return doStuffOnThread(seed);
        }}
      />
    </ScrollView>
  );
};

export default LoginScreen;
