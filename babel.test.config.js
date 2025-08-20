// @ts-check
export default {
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript",
    "module:@react-native/babel-preset",
  ],
  plugins: [
    "@babel/plugin-proposal-export-namespace-from",
    "react-native-reanimated/plugin",
  ],
};
