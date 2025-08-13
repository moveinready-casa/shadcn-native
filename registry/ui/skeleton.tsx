import React, {ComponentProps} from "react";
import {View} from "react-native";
import {tv} from "tailwind-variants";

export type SkeletonProps = {
  baseClassName?: string;
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
} & Omit<ComponentProps<typeof View>, "children">;

export const skeleton = tv({
  base: "bg-accent animate-pulse",
  variants: {
    borderRadius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    borderRadius: "md",
  },
});

export function Skeleton({
  baseClassName,
  borderRadius = "md",
  ...props
}: SkeletonProps) {
  const renderProps = {
    ...props,
    className: skeleton({
      className: baseClassName || props.className,
      borderRadius,
    }),
  };

  return <View {...renderProps} />;
}
