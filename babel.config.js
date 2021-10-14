module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'babel-plugin-rewrite-require',
      {
        aliases: {
          zlib: 'browserify-zlib',
          constants: 'constants-browserify',
          crypto: 'react-native-crypto',
          dns: 'dns.js',
          domain: 'domain-browser',
          http: '@tradle/react-native-http',
          https: 'https-browserify',
          os: 'react-native-os',
          path: 'path-browserify',
          querystring: 'querystring-es3',
          fs: 'react-native-level-fs',
          dgram: 'react-native-udp',
          stream: 'stream-browserify',
          timers: 'timers-browserify',
          tty: 'tty-browserify',
          net: 'react-native-tcp',
          vm: 'vm-browserify',
        },
      },
    ],
  ],
};
