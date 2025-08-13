import React from "react";
import {View} from "react-native";

export const MenuView = ({
  children,
  onPressAction,
  testID = "rn-menu-view",
  ...props
}: any) =>
  React.createElement(View, {testID, onPressAction, ...props}, children);
