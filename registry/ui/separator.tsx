import React, {ComponentProps} from "react";
import {Platform, View} from "react-native";
import {tv} from "tailwind-variants";
import {useSeparator as useSeparatorAria} from "@react-aria/separator";

/**
 * Base props for the `Separator` hook and component.
 * Matches Radix UI's API.
 *
 * @param orientation The separator orientation. Defaults to `"horizontal"`.
 * @param decorative If true, hides the separator from assistive technologies. Defaults to `true`.
 */
export type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
};

/**
 * Return type for the `useSeparator` hook.
 *
 * @param componentProps React Native props to spread on the separator root.
 */
export type SeparatorReturn = {
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
};

/**
 * Component props for `Separator`.
 *
 * @param asChild Clone the first child and apply all props to it.
 * @param baseClassName Custom tailwind classes applied to the base separator. Takes precedence over `className`.
 * @see SeparatorProps
 */
export type SeparatorComponentProps = SeparatorProps & {
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * Tailwind Variants for the Separator styles.
 */
export const separator = tv({
  base: "shrink-0 bg-border",
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

/**
 * The `useSeparator` hook returns platform-appropriate accessibility props for a separator.
 * On web, it integrates with React Aria. On native platforms, it returns RN accessibility props.
 *
 * @param orientation The separator orientation. Defaults to `"horizontal"`.
 * @param decorative If true, hides the separator from assistive technologies. Defaults to `true`.
 * @returns Returns an object with `componentProps` that should be spread on the separator element.
 */
export const useSeparator = ({
  orientation = "horizontal",
  decorative = true,
}: SeparatorProps): SeparatorReturn => {
  const {separatorProps} = useSeparatorAria({orientation});

  const componentProps: ComponentProps<typeof View> | HTMLDivElement = {
    ...(Platform.OS === "web" ? separatorProps : {}),
    accessibilityRole: "separator",
    role: "separator",
    "aria-orientation": orientation,
  };

  return {
    componentProps: decorative ? {} : componentProps,
  };
};

/**
 * Visually or semantically separates content.
 * @see SeparatorComponentProps
 */
export function Separator({
  asChild = false,
  baseClassName,
  orientation = "horizontal",
  decorative = true,
  children,
  ...props
}: SeparatorComponentProps) {
  const {componentProps} = useSeparator({orientation, decorative});
  const renderProps = {
    ...componentProps,
    ...props,
    className: separator({
      orientation,
      className: baseClassName || props.className,
    }),
  };

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className?: string;
      }>,
      renderProps,
    )
  ) : (
    <View {...renderProps} />
  );
}
