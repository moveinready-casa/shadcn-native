import React, {ComponentProps, ReactNode} from "react";
import {
  View,
  ViewProps,
  AccessibilityState,
  ActivityIndicator,
} from "react-native";
import {tv} from "tailwind-variants";
import {AlertTriangleIcon} from "lucide-react-native";

/**
 * Badge visual variants.
 */
export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

/**
 * Border radius (mirrors Avatar).
 */
export type BadgeRadius = "none" | "sm" | "md" | "lg" | "xl";

/**
 * Loading / error / idle states for status indicator.
 */
export type BadgeStatus = "idle" | "loading" | "error";

/**
 * Props for the `Badge` component.
 */
/**
 * Props for the `Badge` component.
 * @param children The content to display inside the badge.
 * @param variant Visual variant of the badge.
 * @param borderRadius Border radius of the badge.
 * @param disabled Disabled state of the badge.
 * @param status Status for indicator (idle, loading, error).
 * @param loading Convenience boolean prop to show loading state.
 * @param indicator Custom indicator renderer function.
 * @param baseClassName Provide custom base className (overrides className).
 * @param asChild Clone props to child instead of rendering a View.
 */
export type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  borderRadius?: BadgeRadius;
  disabled?: boolean;
  status?: BadgeStatus;
  loading?: boolean;
  indicator?: (state: BadgeStatus) => ReactNode;
  baseClassName?: string;
  asChild?: boolean;
} & ViewProps;

/**
 * Conditional classes for the `Badge` component.
 */
export const badge = tv({
  base: "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  variants: {
    variant: {
      default:
        "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
      secondary:
        "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
      destructive:
        "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
      outline:
        "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
    },
    radius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
    },
    disabled: {
      true: "opacity-50",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    radius: "lg",
    disabled: false,
  },
});

/**
 * Root Badge component.
 */
export function Badge({
  children,
  variant = "default",
  borderRadius = "lg",
  disabled = false,
  status: incomingStatus = "idle",
  loading = false,
  indicator,
  baseClassName,
  asChild = false,
  ...props
}: BadgeProps) {
  const status: BadgeStatus = loading ? "loading" : incomingStatus;

  const className = badge({
    variant,
    radius: borderRadius,
    disabled,
    className: baseClassName || props.className,
  });

  const accessibilityState: AccessibilityState = {
    disabled: disabled,
  };

  function Indicator() {
    if (indicator) {
      return indicator(status);
    }

    if (status === "loading") {
      return <ActivityIndicator />;
    } else if (status === "error") {
      return <AlertTriangleIcon />;
    } else if (status === "idle") {
      return null;
    }
  }

  const renderProps: ComponentProps<typeof View> = {
    ...props,
    accessibilityState,
    className,
  };

  return asChild ? (
    React.cloneElement(children as React.ReactElement<any>, renderProps)
  ) : (
    <View {...renderProps}>
      <Indicator />
      {children}
    </View>
  );
}
