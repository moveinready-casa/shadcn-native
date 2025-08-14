import React, {ComponentProps} from "react";
import {View} from "react-native";
import {tv} from "tailwind-variants";

/**
 * Props for the `Skeleton` component.
 *
 * @param baseClassName Tailwind classes applied to the root view.
 * @param borderRadius Corner roundness variant. Defaults to `"md"`.
 */
export type SkeletonProps = {
  baseClassName?: string;
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
} & Omit<ComponentProps<typeof View>, "children">;

/**
 * Conditional classes for the `Skeleton` component.
 */
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

/**
 * `Skeleton` component.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-[120px]" />
 * <Skeleton className="h-10 w-10 rounded-full" />
 * ```
 */
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
