import type {Preview} from "@storybook/react-native-web-vite";
import "../global.css";
import Theme from "../.stories/theme";
import React from "react";

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        light: {
          name: "Light",
          value: "#ffffff",
        },
        dark: {
          name: "Dark",
          value: "#0a0a0a",
        },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  initialGlobals: {
    backgrounds: {value: "dark"},
  },
  decorators: [
    (Story, {context}) => (
      <Theme colorScheme={context.globals.backgrounds.value}>
        <Story />
      </Theme>
    ),
  ],
};

export default preview;
