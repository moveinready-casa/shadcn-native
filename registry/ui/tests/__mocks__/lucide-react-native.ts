import React from "react";
import {View} from "react-native";
import {jest} from "@jest/globals";

export const ChevronDownIcon = jest.fn(() =>
  React.createElement(View, {testID: "lucide-icon"}),
);
