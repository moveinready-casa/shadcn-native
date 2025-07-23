// @ts-check
export default {
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript",
    "module:@react-native/babel-preset",
  ],
  plugins: ["react-native-worklets/plugin"],
};
