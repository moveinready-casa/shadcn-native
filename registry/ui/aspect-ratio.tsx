import React, {ComponentProps} from "react";
import {View, StyleProp, ViewStyle} from "react-native";
import {tv} from "tailwind-variants";

/**
 * Props for the `AspectRatio` component.
 * @param ratio - Desired width/height ratio. A value of `16/9` represents 16 × 9.
 * @param children - Element(s) that should be constrained to the given ratio.
 * @param asChild - If true clones the child and passes all layout props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base component.
 */
export type AspectRatioProps = {
  children: React.ReactNode;
  ratio?: number;
  asChild?: boolean;
  baseClassName?: string;
  style?: StyleProp<ViewStyle>;
} & ComponentProps<typeof View>;

/**
 * Tailwind classes for the `AspectRatio` component.
 */
const aspectRatio = tv({
  base: "w-full",
});

/**
 * The `AspectRatio` component. Displays content within a desired ratio.
 * @param param0 @see AspectRatioProps
 * @returns A `View` component with the desired aspect ratio.
 */
export function AspectRatio({
  children,
  ratio = 1 / 1,
  asChild = false,
  baseClassName,
  style,
  ...props
}: AspectRatioProps) {
  const aspectStyle: StyleProp<ViewStyle> = [{aspectRatio: ratio}, style];

  const className = aspectRatio({className: baseClassName});

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<any>;
    return React.cloneElement(child, {
      ...props,
      style: [aspectStyle, child.props.style],
      className,
    });
  }

  return (
    <View style={aspectStyle} className={className} {...props}>
      {children}
    </View>
  );
}
