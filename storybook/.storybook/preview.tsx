import type {Preview} from "@storybook/react-native-web-vite";
import "../output.css";
import React from "react";
import {NavigationContainer} from "@react-navigation/native";
// import {Toaster} from "../.stories/ui/sonner";

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
    (Story) => (
      <>
        <NavigationContainer>
          <Story />
        </NavigationContainer>
        {/* <Toaster /> */}
      </>
    ),
  ],
};

export default preview;
