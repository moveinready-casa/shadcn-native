import React, {ComponentProps} from "react";
import {ScrollView} from "react-native";
import {tv} from "tailwind-variants";

/**
 * Props for the `ScrollArea` component.
 *
 * @param asChild - When true, merges props into the first child element instead of rendering a `ScrollView`.
 * @param disabled - When true, applies disabled styling and prevents scrolling and interaction.
 * @param loading - When true, applies loading styling and prevents scrolling and interaction.
 * @param borderRadius - Controls the roundness of the container corners.
 * @param baseClassName - Custom tailwind classes applied to the base container. Takes priority over the `className` prop.
 *
 * Also extends all React Native `ScrollView` props.
 */
export type ScrollAreaComponentProps = {
  asChild?: boolean;
  disabled?: boolean;
  loading?: boolean;
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
  baseClassName?: string;
} & ComponentProps<typeof ScrollView>;

/**
 * Conditional classes for the `ScrollArea` component.
 */
export const scrollArea = tv({
  base: "outline-none border border-border focus-visible:ring-ring focus-visible:ring-[3px] focus-visible:outline-1",
  variants: {
    borderRadius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
    },
    disabled: {
      true: "opacity-50 pointer-events-none",
    },
    loading: {
      true: "opacity-80 animate-pulse pointer-events-none",
    },
  },
  defaultVariants: {
    borderRadius: "md",
    disabled: false,
    loading: false,
  },
});

/**
 * The `ScrollArea` component provides a styled, optionally-disabled scroll container.
 *
 * @param param0 - Props to configure the scroll area. See `ScrollAreaComponentProps`.
 * @returns A React element representing the scrollable area or its cloned child.
 */
export function ScrollArea({
  children,
  asChild,
  borderRadius,
  baseClassName,
  disabled,
  loading,
  ...props
}: ScrollAreaComponentProps) {
  const renderProps = {
    className: scrollArea({
      borderRadius,
      disabled,
      loading,
      className: baseClassName || props.className,
    }),
  };

  return asChild ? (
    React.cloneElement(
      children as React.ReactElement<{className?: string}>,
      renderProps,
    )
  ) : (
    <ScrollView
      {...props}
      {...renderProps}
      scrollEnabled={!disabled && !loading}
    >
      {children}
    </ScrollView>
  );
}
