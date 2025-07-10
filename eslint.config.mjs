import reactNative from "@react-native/eslint-config";
import react from "eslint-plugin-react";

/**
 * @type {import("eslint").Linter.Config[]}
 */
const eslintConfig = [
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    },
  },
  {
    ...reactNative,
    ignores: ["node_modules", "!/app/registry"],
  },
];

export default eslintConfig;
