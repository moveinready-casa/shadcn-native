import reactNative from "@react-native/eslint-plugin";
import react from "eslint-plugin-react";
import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * @type {import("eslint").Linter.Config[]}
 */
const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "*.tsbuildinfo",
      "next-env.d.ts",
      ".turbo/**",
      "storybook-static/**",
      ".stories/**",
      "public/_pagefind",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "warn",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    ignores: ["app/registry"],
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
    files: ["app/registry/**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      reactNative,
    },
    ignores: ["!/app/registry"],
  },
];

export default eslintConfig;
