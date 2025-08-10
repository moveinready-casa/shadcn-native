import React, {ComponentProps, ReactNode} from "react";
import {Text} from "react-native";
import {tv} from "tailwind-variants";

export type LabelProps = {
  children?: ReactNode;
  asChild?: boolean;
  className?: string;
} & ComponentProps<typeof Text>;

export const label = tv({
  base: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
});

export function Label({
  children,
  asChild = false,
  className,
  ...props
}: LabelProps) {
  const classNames = label({className});

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<any>,
      {
        ...props,
        className: classNames,
        accessibilityRole: "text",
      },
    )
  ) : (
    <Text {...props} className={classNames} accessibilityRole="text">
      {children}
    </Text>
  );
}
