import {useTheme} from "@/lib/utils/theme";
import {AlertTriangleIcon} from "lucide-react-native";
import React, {ComponentProps, ReactNode} from "react";
import {
  AccessibilityState,
  ActivityIndicator,
  Text,
  View,
  ViewProps,
} from "react-native";
import {tv} from "tailwind-variants";

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
  variant?: "default" | "secondary" | "destructive" | "outline";
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  status?: BadgeStatus;
  indicator?: (state: BadgeStatus) => ReactNode;
  baseClassName?: string;
  asChild?: boolean;
} & ViewProps;

/**
 * Conditional classes for the `Badge` component.
 */
export const badge = tv({
  base: "inline-flex items-center justify-center rounded-md border px-2 py-0.5 w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  slots: {
    text: "text-xs font-medium",
  },
  variants: {
    variant: {
      default: {
        base: "border-transparent bg-primary [a&]:hover:bg-primary/90",
        text: "text-primary-foreground",
      },
      secondary: {
        base: "border-transparent bg-secondary [a&]:hover:bg-secondary/90",
        text: "text-secondary-foreground",
      },
      destructive: {
        base: "border-transparent bg-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        text: "text-white",
      },
      outline: {
        base: "[a&]:hover:bg-accent",
        text: "text-foreground",
      },
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
  status,
  indicator,
  baseClassName,
  asChild = false,
  ...props
}: BadgeProps) {
  const currentTheme = useTheme();
  const {base, text} = badge({
    variant,
    radius: borderRadius,
    disabled,
  });

  const accessibilityState: AccessibilityState = {
    disabled: disabled,
  };

  function Indicator() {
    if (indicator) {
      return indicator(status || "idle");
    }

    if (status === "loading") {
      return <ActivityIndicator testID="badge-loading-icon" />;
    } else if (status === "error") {
      return (
        <AlertTriangleIcon
          testID="badge-error-icon"
          color={currentTheme.foreground}
        />
      );
    } else if (status === "idle") {
      return null;
    }
  }

  const renderProps: ComponentProps<typeof View> = {
    ...props,
    accessibilityState,
    className: base({className: baseClassName || props.className}),
  };

  return asChild ? (
    React.cloneElement(children as React.ReactElement<any>, renderProps)
  ) : (
    <View {...renderProps}>
      <Indicator />
      <Text className={text()}>{children}</Text>
    </View>
  );
}
