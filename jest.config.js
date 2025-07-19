// @ts-check

/** @type {import('jest').Config} */
const jestConfig = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs|flow)$": [
      "babel-jest",
      {configFile: "./babel.test.config.js"},
    ],
  },
  transformIgnorePatterns: [
    "./node_modules/(?!((.pnpm/)?((jest-)?react-native|@react-native(-community)?))|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@react-native-vector-icons/.*)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "flow"],
  preset: "react-native",
  testMatch: ["**/*.spec.tsx"],
  setupFilesAfterEnv: ["./jest-setup.ts"],
};

export default jestConfig;
