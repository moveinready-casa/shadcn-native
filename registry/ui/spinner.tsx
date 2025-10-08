import {useTheme} from "@/lib/utils/theme";
import {ComponentProps} from "react";
import {ActivityIndicator} from "react-native";
import {tv} from "tailwind-variants";

/**
 * Props for the `Spinner` component.
 *
 * @param color Visual color of the spinner (controls color).
 * @param size Size variant of the spinner.
 * @param baseClassName Tailwind classes applied to the spinner.
 */
export type SpinnerProps = {
  color?: "default" | "secondary" | "destructive" | "warning";
  size?: "sm" | "md" | "lg" | "xl";
  baseClassName?: string;
} & Omit<ComponentProps<typeof ActivityIndicator>, "size" | "color">;

/**
 * Conditional classes for the `Spinner` component.
 */
export const spinner = tv({
  base: "",
  variants: {
    color: {
      default: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive",
      warning: "text-warning",
    },
    size: {
      sm: "size-3",
      md: "size-4",
      lg: "size-6",
      xl: "size-8",
    },
  },
  defaultVariants: {
    color: "default",
    size: "md",
  },
});

/**
 * `Spinner` component.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner size="lg" color="primary" />
 * ```
 */
export function Spinner({
  color = "default",
  size = "md",
  baseClassName,
  ...props
}: SpinnerProps) {
  const currentTheme = useTheme();

  const colorMap = {
    default: currentTheme.foreground,
    secondary: currentTheme.secondaryForeground,
    destructive: currentTheme.destructive,
    warning: currentTheme.warning,
  };

  const sizeMap = {
    sm: "small" as const,
    md: "small" as const,
    lg: "large" as const,
    xl: "large" as const,
  };

  return (
    <ActivityIndicator
      size={sizeMap[size]}
      color={colorMap[color]}
      className={spinner({
        size,
        className: baseClassName || props.className,
      })}
      {...props}
    />
  );
}
