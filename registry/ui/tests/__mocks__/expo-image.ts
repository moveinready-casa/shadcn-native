import React from "react";
import {View} from "react-native";
import {jest} from "@jest/globals";

export const Image = jest.fn((props: any) =>
  React.createElement(View, {
    testID: props.testID || "expo-image",
    ...props,
  }),
);

export default Image;
