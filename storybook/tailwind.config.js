/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./storybook/**/*.{js,jsx,ts,tsx}",
    "../registry/**/*.{js,jsx,ts,tsx}",
  ],
  // eslint-disable-next-line
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
