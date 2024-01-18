module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        safe: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@screens': './screens',
          '@wrappers': './wrappers',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
  ],
};
