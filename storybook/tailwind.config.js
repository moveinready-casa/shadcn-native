/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./storybook/**/*.{js,jsx,ts,tsx}",
    "../app/registry/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
