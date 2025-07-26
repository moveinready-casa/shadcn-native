import React, {ComponentProps, ReactNode} from "react";
import {View, ViewProps, AccessibilityState} from "react-native";
import {tv} from "tailwind-variants";

/**
 * Badge visual variants.
 */
export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

/**
 * Border radius (mirrors Avatar).
 */
export type BadgeRadius = "none" | "sm" | "md" | "lg" | "full";

/**
 * Loading / error / idle states for status indicator.
 */
export type BadgeStatus = "idle" | "loading" | "error";

/**
 * Conditional classes for the `Badge` component.
 */
export const badge = tv({
  base: "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  variants: {
    variant: {
      default: "border-transparent bg-primary text-primary-foreground shadow",
      secondary: "border-transparent bg-secondary text-secondary-foreground",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground",
      outline:
        "border border-border bg-transparent text-foreground shadow-none",
    },
    radius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    },
    disabled: {
      true: "opacity-50",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    radius: "full",
    disabled: false,
  },
});

/**
 * Props for the `Badge` component.
 */
export type BadgeProps = {
  children: ReactNode;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Border radius */
  borderRadius?: BadgeRadius;
  /** Disabled state */
  disabled?: boolean;
  /** Status for indicator */
  status?: BadgeStatus;
  /** Convenience boolean prop to show loading state */
  loading?: boolean;
  /** Custom indicator renderer */
  indicator?: (state: BadgeStatus) => ReactNode;
  /** Provide custom base className (overrides className) */
  baseClassName?: string;
  /** Clone props to child instead of rendering a View */
  asChild?: boolean;
} & ViewProps;

/**
 * Default indicator components (simple Views) so tests can assert presence via `testID`.
 */
const DefaultLoadingIndicator = () => (
  <View
    testID="badge-loading-icon"
    className="mr-1 h-3 w-3 animate-spin rounded-full bg-current opacity-80"
  />
);

const DefaultErrorIndicator = () => (
  <View
    testID="badge-error-icon"
    className="mr-1 h-3 w-3 rounded-full bg-current opacity-80"
  />
);

/**
 * Root Badge component.
 */
export function Badge({
  children,
  variant = "default",
  borderRadius = "full",
  disabled = false,
  status: incomingStatus = "idle",
  loading = false,
  indicator,
  baseClassName,
  asChild = false,
  testID = "badge",
  ...props
}: BadgeProps) {
  // Infer final status
  const status: BadgeStatus = loading ? "loading" : incomingStatus;

  // Resolve conditional classes
  const className = badge({
    variant,
    radius: borderRadius,
    disabled,
    className: baseClassName || props.className,
  });

  const accessibilityState: AccessibilityState = {
    disabled: disabled,
  };

  // Determine indicator node
  let indicatorNode: ReactNode = null;
  if (indicator) {
    indicatorNode = indicator(status);
  } else {
    if (status === "loading") indicatorNode = <DefaultLoadingIndicator />;
    else if (status === "error") indicatorNode = <DefaultErrorIndicator />;
  }

  // Props that are injected into rendered element
  const renderProps: ComponentProps<typeof View> = {
    ...props,
    testID,
    accessibilityState,
    className,
  } as ComponentProps<typeof View>;

  if (asChild && React.isValidElement(children)) {
    // Merge props + className into child element
    const childElement = children as React.ReactElement<any>;
    return React.cloneElement(childElement, {
      ...renderProps,
      ...childElement.props, // Preserve child's original props (including testID)
      className: [childElement.props.className, renderProps.className]
        .filter(Boolean)
        .join(" "),
      children: (
        <>
          {indicatorNode}
          {childElement.props.children}
        </>
      ),
    });
  }

  return (
    <View {...renderProps}>
      {indicatorNode}
      {children}
    </View>
  );
}
