module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
          },
        },
      ],
      [
        'inline-import',
        {
          extensions: ['.sql'],
        },
      ],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
        },
      ],
    ],
  };
};
