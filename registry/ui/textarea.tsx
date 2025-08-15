import {ComponentProps} from "react";
import {TextInput} from "react-native";
import {tv} from "tailwind-variants";

/**
 * Props for the `Textarea` component.
 * @param disabled Whether the textarea is disabled.
 * @param loading Whether the textarea is in a loading state.
 * @param color Visual color variant of the textarea.
 * @param borderRadius Border radius of the textarea.
 * @param variant Visual variant style of the textarea.
 * @param baseClassName Provide custom base className (overrides className).
 */
export type TextareaProps = {
  disabled?: boolean;
  loading?: boolean;
  color?: "default" | "secondary" | "destructive" | "warning" | "success";
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
  variant?: "shadcn" | "ghost";
  baseClassName?: string;
} & ComponentProps<typeof TextInput>;

/**
 * Conditional classes for the `Textarea` component.
 */
export const textArea = tv({
  base: "flex w-full min-h-[60px] px-3 py-2 shadow-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-1 placeholder:text-muted-foreground md:text-sm",
  variants: {
    variant: {
      shadcn: "border border-input bg-transparent shadow-sm",
      ghost: "bg-transparent",
    },
    color: {
      default: "focus-visible:ring-ring",
      secondary: "focus-visible:ring-secondary",
      destructive: "focus-visible:ring-destructive",
      warning: "focus-visible:ring-warning",
      success: "focus-visible:ring-success",
    },
    isDisabled: {
      true: "cursor-not-allowed opacity-50",
    },
    isLoading: {
      true: "cursor-not-allowed opacity-80 animate-pulse",
    },
    borderRadius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
    },
  },
  defaultVariants: {
    variant: "shadcn",
    color: "default",
    borderRadius: "md",
  },
});

/**
 * Root Textarea component.
 * Displays a form textarea or a component that looks like a textarea.
 * @param props - Props for the `Textarea` @see {@link TextareaProps}
 */
export function Textarea({
  disabled = false,
  loading = false,
  color = "default",
  variant = "shadcn",
  borderRadius = "md",
  baseClassName,
  ...props
}: TextareaProps) {
  return (
    <TextInput
      {...props}
      multiline
      className={textArea({
        color,
        variant,
        isDisabled: disabled,
        isLoading: loading,
        borderRadius,
        className: baseClassName || props.className,
      })}
    />
  );
}
