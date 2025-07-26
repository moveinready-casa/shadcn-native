import React from "react";
import {View} from "react-native";
import {jest} from "@jest/globals";

export const ChevronDownIcon = jest.fn(() =>
  React.createElement(View, {testID: "lucide-icon"}),
);

export const XIcon = jest.fn(() =>
  React.createElement(View, {testID: "lucide-icon"}),
);

export const InfoIcon = jest.fn(() =>
  React.createElement(View, {testID: "lucide-icon"}),
);

export const CheckCircle2Icon = jest.fn(() =>
  React.createElement(View, {testID: "lucide-icon"}),
);

export const AlertTriangleIcon = jest.fn((props: any) =>
  React.createElement(View, {testID: props?.testID || "lucide-icon"}),
);

export const AlertCircleIcon = jest.fn(() =>
  React.createElement(View, {testID: "lucide-icon"}),
);
