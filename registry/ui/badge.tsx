import React, {ComponentProps, ReactNode} from "react";
import {Text, View} from "react-native";
import {tv} from "tailwind-variants";
import {AlertCircle, Loader2} from "lucide-react-native";

/**
 * Badge status type for indicating loading, error, or idle states.
 */
export type BadgeStatus = "idle" | "loading" | "error";

/**
 * Props for the Badge component.
 */
export type BadgeProps = {
  variant?: "default" | "secondary" | "destructive" | "outline";
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
  disabled?: boolean;
  status?: BadgeStatus;
  indicator?: (state: BadgeStatus) => ReactNode;
  baseClassName?: string;
  asChild?: boolean;
  children?: ReactNode;
} & ComponentProps<typeof View>;

/**
 * Tailwind variants for the Badge component.
 */
export const badge = tv({
  base: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  variants: {
    variant: {
      default:
        "border-transparent bg-primary text-primary-foreground hover:opacity-80",
      secondary:
        "border-transparent bg-secondary text-secondary-foreground hover:opacity-80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:opacity-80",
      outline: "text-foreground",
    },
    borderRadius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    },
    disabled: {
      true: "opacity-50",
    },
  },
  defaultVariants: {
    variant: "default",
    borderRadius: "full",
    disabled: false,
  },
});

/**
 * Badge component with various styling options and status indicators.
 */
export function Badge({
  variant = "default",
  borderRadius = "full",
  disabled = false,
  status = "idle",
  indicator,
  baseClassName,
  asChild = false,
  children,
  ...props
}: BadgeProps) {
  const className = badge({
    variant,
    borderRadius,
    disabled,
    className: baseClassName || props.className,
  });

  // Render custom indicator or default indicators based on status
  const renderIndicator = () => {
    if (indicator) {
      return indicator(status);
    }

    switch (status) {
      case "loading":
        return (
          <Loader2
            size={12}
            className="mr-1 animate-spin"
            testID="badge-loading-icon"
          />
        );
      case "error":
        return (
          <AlertCircle size={12} className="mr-1" testID="badge-error-icon" />
        );
      default:
        return null;
    }
  };

  if (asChild) {
    return React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<any>,
      {
        ...props,
        className,
      },
    );
  }

  return (
    <View
      {...props}
      className={className}
      accessibilityState={{disabled}}
      accessibilityRole="text"
    >
      {renderIndicator()}
      <Text className="text-inherit">{children}</Text>
    </View>
  );
}
