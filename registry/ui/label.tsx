import React, {ComponentProps, ReactNode} from "react";
import {Text} from "react-native";
import {tv} from "tailwind-variants";

/**
 * Props for the `Label` component.
 *
 * @param children Content to render within the label. When `asChild` is true, the first child is cloned.
 * @param asChild If true, clones the first child and injects label props and classes.
 * @param className Additional Tailwind classes to merge with defaults.
 * @param props Additional React Native `Text` props.
 */
export type LabelComponentProps = {
  children?: ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

/**
 * Tailwind Variants for the `Label` component.
 * @see LabelComponentProps
 */
export const label = tv({
  base: "text-sm text-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
});

/**
 * A styled text label for form fields and UI elements.
 *
 * @see LabelComponentProps
 */
export function Label({
  children,
  asChild = false,
  baseClassName,
  ...props
}: LabelComponentProps) {
  const classNames = label({className: props.className || baseClassName});

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
    <Text {...props} className={classNames}>
      {children}
    </Text>
  );
}
