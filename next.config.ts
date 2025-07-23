import nextra from "nextra";

const withNextra = nextra({});

export default withNextra({
  typescript: {
    tsconfigPath: "./tsconfig.next.json",
  },
  serverExternalPackages: [
    "@storybook/react-native",
    "react-native",
    "react-native-web",
    "react-native-reanimated",
  ],
});
