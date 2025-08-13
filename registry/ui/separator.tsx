import React, {ComponentProps} from "react";
import {Platform, View} from "react-native";
import {tv} from "tailwind-variants";
import {useSeparator as useSeparatorAria} from "@react-aria/separator";

/**
 * Base props for the Separator hook and component.
 * Matches Radix UI's API: orientation and decorative.
 */
export type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
};

/**
 * Return type for the useSeparator hook.
 */
export type SeparatorReturn = {
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
};

/**
 * Component props for Separator.
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
 * Hook: returns RN props for an accessible separator. Uses React Aria on web.
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
 * Component: visually separates content.
 */
export function Separator({
  asChild = false,
  baseClassName,
  className,
  orientation = "horizontal",
  decorative = true,
  children,
  ...props
}: SeparatorComponentProps) {
  const {componentProps} = useSeparator({orientation, decorative});
  const renderProps = {
    className: separator({orientation, className: baseClassName || className}),
    ...componentProps,
    ...props,
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
