module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Must be LAST
      'react-native-reanimated/plugin',
    ],
  };
};
