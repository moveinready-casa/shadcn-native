// @ts-check

/** @type {import('@babel/core').OptionManager} */
export default {
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript",
    "module:@react-native/babel-preset",
  ],
  plugins: ["react-native-reanimated/plugin"],
};
