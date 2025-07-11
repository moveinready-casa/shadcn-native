// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

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
  ...storybook.configs["flat/recommended"],
  ...storybook.configs["flat/recommended"],
];

export default eslintConfig;
