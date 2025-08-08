import React from "react";
import {View} from "react-native";

const ActionSheet = React.forwardRef<any, any>((props, ref) => {
  React.useImperativeHandle(
    ref,
    () => ({
      show: () => {},
      hide: () => {},
    }),
    [],
  );
  return <View {...props}>{props.children}</View>;
});

export default ActionSheet;
export type ActionSheetRef = {
  show: () => void;
  hide: () => void;
};
