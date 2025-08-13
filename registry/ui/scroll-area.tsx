import React, {ComponentProps} from "react";
import {ScrollView} from "react-native";
import {tv} from "tailwind-variants";

export type ScrollAreaComponentProps = {
  asChild?: boolean;
  disabled?: boolean;
  loading?: boolean;
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
  baseClassName?: string;
} & ComponentProps<typeof ScrollView>;

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
