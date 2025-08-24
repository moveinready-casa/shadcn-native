import {useButton as useButtonAria} from "@react-aria/button";
import {useFocusRing} from "@react-aria/focus";
import React, {ComponentProps, ReactNode, useRef, useState} from "react";
import {ActivityIndicator, Platform, Pressable, Text, View} from "react-native";
import {tv} from "tailwind-variants";

/**
 * Base props for the Button component, context, and hook.
 */
export type ButtonProps = {
  variant?:
    | "default"
    | "destructive"
    | "warning"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "md" | "sm" | "lg" | "xl" | "icon";
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  asChild?: boolean;
  loading?: boolean;
  spinner?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  baseClassName?: string;
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
  slots: {
    base: "flex flex-row items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none",
    text: "",
  },
  variants: {
    variant: {
      default: {
        base: "bg-primary text-primary-foreground shadow hover:opacity-90",
        text: "text-primary-foreground",
      },
      destructive: {
        base: "bg-destructive text-destructive-foreground shadow-sm hover:opacity-90",
        text: "text-destructive-foreground",
      },
      warning: {
        base: "bg-warning text-warning-foreground shadow-sm hover:opacity-90",
        text: "text-warning-foreground",
      },
      outline: {
        base: "border bg-background border-input text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground hover:opacity-90",
        text: "text-foreground hover:text-accent-foreground",
      },
      secondary: {
        base: "bg-secondary text-secondary-foreground shadow-sm hover:opacity-90",
        text: "text-secondary-foreground",
      },
      ghost: {
        base: "text-foreground hover:bg-accent hover:text-accent-foreground hover:opacity-90",
        text: "text-foreground hover:text-accent-foreground",
      },
      link: {
        base: "text-primary underline-offset-4 hover:underline hover:opacity-90",
        text: "text-primary underline-offset-4 hover:underline",
      },
    },
    size: {
      sm: "h-8 rounded-md px-3 text-xs",
      md: "h-9 px-4",
      lg: "h-10 rounded-md px-6",
      xl: "h-11 rounded-md px-8",
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
    size: "md",
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
  size = "md",
  borderRadius = "md",
  fullWidth = false,
  asChild = false,
  loading = false,
  spinner,
  startContent,
  endContent,
  disabled = false,
  baseClassName,
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

  const {base, text} = button({
    variant,
    size,
    borderRadius,
    fullWidth,
    disabled: disabled || loading,
  });

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<any>,
      {
        ...buttonState.componentProps,
        ...props,
        className: base({className: baseClassName || props.className}),
      },
    )
  ) : (
    <Pressable
      {...buttonState.componentProps}
      {...props}
      className={base({className: baseClassName || props.className})}
      testID={testID}
    >
      {loading
        ? spinner || (
            <ActivityIndicator
              testID={
                testID ? `${testID}-loading-spinner` : "button-loading-spinner"
              }
              size="small"
              color="currentColor"
            />
          )
        : startContent}
      <Text className={text({className: baseClassName || props.className})}>
        {children}
      </Text>
      {endContent}
    </Pressable>
  );
}
