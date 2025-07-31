import React, {ComponentProps, useState, useRef, ReactNode} from "react";
import {Pressable, View, Platform, ActivityIndicator} from "react-native";
import {useButton as useButtonAria} from "@react-aria/button";
import {useFocusRing} from "@react-aria/focus";
import {tv} from "tailwind-variants";

/**
 * Base props for the Button component, context, and hook.
 */
export type ButtonProps = {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  asChild?: boolean;
  loading?: boolean;
  spinner?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  onPress?: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
};

/**
 * Return type for the useButton hook.
 */
export type ButtonReturn = {
  componentProps: ComponentProps<typeof Pressable> | HTMLButtonElement;
  state: {
    isPressed: boolean;
    isDisabled: boolean;
    isLoading: boolean;
    isFocusVisible: boolean;
  };
};

/**
 * Component props for the Button component.
 */
export type ButtonComponentProps = ButtonProps &
  ComponentProps<typeof Pressable>;

/**
 * The useButton hook provides accessibility props and state for the button component.
 */
export const useButton = ({
  disabled = false,
  loading = false,
  onPress,
  onPressStart,
  onPressEnd,
  ...props
}: ButtonProps): ButtonReturn => {
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<View>(null);

  const isDisabled = disabled || loading;

  const {buttonProps: ariaButtonProps} = useButtonAria(
    {
      onPress,
      onPressStart: () => {
        setIsPressed(true);
        onPressStart?.();
      },
      onPressEnd: () => {
        setIsPressed(false);
        onPressEnd?.();
      },
      isDisabled,
    },
    buttonRef,
  );

  const {isFocusVisible, focusProps} = useFocusRing();

  return {
    componentProps: {
      ...(Platform.OS === "web" ? {...ariaButtonProps, ...focusProps} : {}),
      ...props,
      onPress: !isDisabled ? onPress : undefined,
      onPressIn: !isDisabled
        ? () => {
            setIsPressed(true);
            onPressStart?.();
          }
        : undefined,
      onPressOut: !isDisabled
        ? () => {
            setIsPressed(false);
            onPressEnd?.();
          }
        : undefined,
      accessibilityRole: "button",
      accessibilityState: {disabled: isDisabled},
      accessible: true,
      ref: buttonRef,
    },
    state: {
      isPressed,
      isDisabled,
      isLoading: loading,
      isFocusVisible,
    },
  };
};

/**
 * Button component styles using tailwind-variants.
 */
export const button = tv({
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      destructive:
        "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      outline:
        "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
      secondary:
        "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-6",
      icon: "size-9",
    },
    borderRadius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
    },
    fullWidth: {
      true: "w-full",
    },
    disabled: {
      true: "opacity-50",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    borderRadius: "md",
    fullWidth: false,
    disabled: false,
  },
});

/**
 * Button component with accessibility and styling support.
 */
export function Button({
  children,
  variant = "default",
  size = "default",
  borderRadius = "md",
  fullWidth = false,
  asChild = false,
  loading = false,
  spinner,
  startContent,
  endContent,
  disabled = false,
  className,
  onPress,
  onPressStart,
  onPressEnd,
  testID,
  ...props
}: ButtonComponentProps) {
  const buttonState = useButton({
    variant,
    size,
    borderRadius,
    fullWidth,
    loading,
    disabled,
    onPress,
    onPressStart,
    onPressEnd,
  });

  const buttonClassName = button({
    variant,
    size,
    borderRadius,
    fullWidth,
    disabled: disabled || loading,
    className,
  });


  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<any>,
      {
        ...buttonState.componentProps,
        ...props,
        className: buttonClassName,
      },
    )
  ) : (
    <Pressable
      {...buttonState.componentProps}
      {...props}
      className={buttonClassName}
      testID={testID}
    >
      {loading
        ? (startContent ??
          (spinner || (
            <ActivityIndicator
              testID={
                testID ? `${testID}-loading-spinner` : "button-loading-spinner"
              }
              size="small"
              color={
                variant === "outline" || variant === "ghost"
                  ? "currentColor"
                  : "#ffffff"
              }
            />
          )))
        : null}
      {children}
      {endContent}
    </Pressable>
  );
}
