import React, {ComponentProps, ReactNode, useRef, useState} from "react";
import {View, Pressable, Platform} from "react-native";
import {tv} from "tailwind-variants";
import {usePress} from "@react-aria/interactions";
import {useFocusRing} from "@react-aria/focus";

/**
 * Props for the main Card component.
 */
export type CardProps = {
  children: ReactNode;
  variant?: "shadcn" | "outline" | "ghost";
  radius?: "none" | "sm" | "md" | "lg" | "xl";
  asChild?: boolean;
  blurred?: boolean;
  pressable?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
} & ComponentProps<typeof View>;

/**
 * Props for CardHeader component.
 */
export type CardHeaderProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  blurred?: boolean;
} & ComponentProps<typeof View>;

/**
 * Props for CardTitle component.
 */
export type CardTitleProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  blurred?: boolean;
} & ComponentProps<typeof View>;

/**
 * Props for CardDescription component.
 */
export type CardDescriptionProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  blurred?: boolean;
} & ComponentProps<typeof View>;

/**
 * Props for CardAction component.
 */
export type CardActionProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  blurred?: boolean;
} & ComponentProps<typeof View>;

/**
 * Props for CardContent component.
 */
export type CardContentProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  blurred?: boolean;
} & ComponentProps<typeof View>;

/**
 * Props for CardFooter component.
 */
export type CardFooterProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  blurred?: boolean;
} & ComponentProps<typeof View>;

/**
 * Return type for the useCard hook.
 */
export type CardReturn = {
  componentProps: ComponentProps<typeof Pressable> | HTMLButtonElement;
  state: {
    isPressed: boolean;
    isDisabled: boolean;
    isFocusVisible: boolean;
  };
};

/**
 * The useCard hook provides accessibility props and state for pressable cards.
 * Uses React Aria's usePress for web and custom implementation for React Native.
 */
export const useCard = ({
  pressable = false,
  disabled = false,
  onPress,
  onPressStart,
  onPressEnd,
}: {
  pressable?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
}): CardReturn => {
  const [isPressed, setIsPressed] = useState(false);
  const cardRef = useRef<View>(null);

  const isDisabled = disabled;

  const {pressProps: ariaButtonProps} = usePress({
    onPress,
    onPressStart: () => {
      setIsPressed(true);
      onPressStart?.();
    },
    onPressEnd: () => {
      setIsPressed(false);
      onPressEnd?.();
    },
    isDisabled: disabled || !pressable,
  });

  const {isFocusVisible, focusProps} = useFocusRing();

  const shouldHandlePress = pressable && !isDisabled;

  return {
    componentProps: {
      ...(Platform.OS === "web" ? {...ariaButtonProps, ...focusProps} : {}),
      onPress: shouldHandlePress ? onPress : undefined,
      onPressIn: shouldHandlePress
        ? () => {
            setIsPressed(true);
            onPressStart?.();
          }
        : undefined,
      onPressOut: shouldHandlePress
        ? () => {
            setIsPressed(false);
            onPressEnd?.();
          }
        : undefined,
      accessibilityRole: pressable ? "button" : "group",
      accessibilityState:
        pressable && isDisabled ? {disabled: isDisabled} : undefined,
      accessible: true,
      ref: cardRef,
    },
    state: {
      isPressed,
      isDisabled,
      isFocusVisible,
    },
  };
};

/**
 * Card component styles using tailwind-variants.
 */
export const card = tv({
  base: "text-card-foreground flex flex-col gap-6 border py-6 shadow-sm",
  variants: {
    variant: {
      shadcn: "border-border bg-card",
      outline: "border-border bg-transparent",
      ghost: "border-transparent bg-transparent shadow-none",
    },
    radius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
    },
    blurred: {
      true: "blur",
    },
    pressed: {
      true: "opacity-90",
    },
    disabled: {
      true: "opacity-50",
    },
  },
  defaultVariants: {
    variant: "shadcn",
    radius: "xl",
    blurred: false,
    pressed: false,
    disabled: false,
  },
});

/**
 * Card header styles.
 */
export const cardHeader = tv({
  base: "flex flex-col space-y-1.5 p-6",
  variants: {
    blurred: {
      true: "blur",
      false: "",
    },
  },
  defaultVariants: {
    blurred: false,
  },
});

/**
 * Card title styles.
 */
export const cardTitle = tv({
  base: "font-semibold leading-none tracking-tight",
  variants: {
    blurred: {
      true: "blur",
      false: "",
    },
  },
  defaultVariants: {
    blurred: false,
  },
});

/**
 * Card description styles.
 */
export const cardDescription = tv({
  base: "text-sm text-muted-foreground",
  variants: {
    blurred: {
      true: "blur",
      false: "",
    },
  },
  defaultVariants: {
    blurred: false,
  },
});

/**
 * Card action styles.
 */
export const cardAction = tv({
  base: "flex items-center justify-end p-6 pt-0",
  variants: {
    blurred: {
      true: "blur",
      false: "",
    },
  },
  defaultVariants: {
    blurred: false,
  },
});

/**
 * Card content styles.
 */
export const cardContent = tv({
  base: "p-6 pt-0",
  variants: {
    blurred: {
      true: "blur",
      false: "",
    },
  },
  defaultVariants: {
    blurred: false,
  },
});

/**
 * Card footer styles.
 */
export const cardFooter = tv({
  base: "flex items-center p-6 pt-0",
  variants: {
    blurred: {
      true: "blur",
      false: "",
    },
  },
  defaultVariants: {
    blurred: false,
  },
});

/**
 * Main Card component with accessibility and styling support.
 */
export function Card({
  children,
  variant = "shadcn",
  radius = "xl",
  asChild = false,
  className,
  blurred = false,
  pressable = false,
  disabled = false,
  onPress,
  onPressStart,
  onPressEnd,
  testID,
  style,
  onLayout,
}: CardProps) {
  const cardState = useCard({
    pressable,
    disabled,
    onPress,
    onPressStart,
    onPressEnd,
  });

  const cardClassName = card({
    variant,
    radius,
    blurred,
    pressed: pressable && cardState.state.isPressed,
    disabled: disabled && pressable,
    className,
  });

  // Safe props that work with both Pressable and View
  const safeProps = {
    className: cardClassName,
    ...(testID && {testID}),
    style,
    onLayout,
  };

  if (asChild) {
    const renderProps = {...safeProps, ...cardState.componentProps};
    return React.cloneElement(children as React.ReactElement<any>, renderProps);
  }

  if (pressable) {
    const pressableProps = {...safeProps, ...cardState.componentProps};
    return <Pressable {...pressableProps}>{children}</Pressable>;
  }

  // For non-pressable View, only include React Native compatible props
  const componentProps = cardState.componentProps as ComponentProps<
    typeof View
  >;
  const viewProps = {
    ...safeProps,
    accessibilityRole: componentProps.accessibilityRole,
    accessibilityState: componentProps.accessibilityState,
    accessible: componentProps.accessible,
  };
  return <View {...viewProps}>{children}</View>;
}

/**
 * Card header component.
 */
export function CardHeader({
  children,
  asChild = false,
  className,
  blurred = false,
  testID,
  ...props
}: CardHeaderProps) {
  const headerClassName = cardHeader({blurred, className});

  const renderProps: ComponentProps<typeof View> = {
    ...props,
    className: headerClassName,
    ...(testID && {testID}),
  };

  return asChild ? (
    React.cloneElement(children as React.ReactElement<any>, renderProps)
  ) : (
    <View {...renderProps}>{children}</View>
  );
}

/**
 * Card title component.
 */
export function CardTitle({
  children,
  asChild = false,
  className,
  blurred = false,
  testID,
  ...props
}: CardTitleProps) {
  const titleClassName = cardTitle({blurred, className});

  const renderProps: ComponentProps<typeof View> = {
    ...props,
    className: titleClassName,
    accessibilityRole: "header",
    ...(testID && {testID}),
  };

  return asChild ? (
    React.cloneElement(children as React.ReactElement<any>, renderProps)
  ) : (
    <View {...renderProps}>{children}</View>
  );
}

/**
 * Card description component.
 */
export function CardDescription({
  children,
  asChild = false,
  className,
  blurred = false,
  testID,
  ...props
}: CardDescriptionProps) {
  const descriptionClassName = cardDescription({blurred, className});

  const renderProps: ComponentProps<typeof View> = {
    ...props,
    className: descriptionClassName,
    ...(testID && {testID}),
  };

  return asChild ? (
    React.cloneElement(
      children as React.ReactElement<{className: string}>,
      renderProps,
    )
  ) : (
    <View {...renderProps}>{children}</View>
  );
}

/**
 * Card action component.
 */
export function CardAction({
  children,
  asChild = false,
  className,
  blurred = false,
  testID,
  ...props
}: CardActionProps) {
  const actionClassName = cardAction({blurred, className});

  const renderProps: ComponentProps<typeof View> = {
    ...props,
    className: actionClassName,
    ...(testID && {testID}),
  };

  return asChild ? (
    React.cloneElement(
      children as React.ReactElement<{className: string}>,
      renderProps,
    )
  ) : (
    <View {...renderProps}>{children}</View>
  );
}

/**
 * Card content component.
 */
export function CardContent({
  children,
  asChild = false,
  className,
  blurred = false,
  testID,
  ...props
}: CardContentProps) {
  const contentClassName = cardContent({blurred, className});

  const renderProps: ComponentProps<typeof View> = {
    ...props,
    className: contentClassName,
    ...(testID && {testID}),
  };

  return asChild ? (
    React.cloneElement(children as React.ReactElement<any>, renderProps)
  ) : (
    <View {...renderProps}>{children}</View>
  );
}

/**
 * Card footer component.
 */
export function CardFooter({
  children,
  asChild = false,
  className,
  blurred = false,
  testID,
  ...props
}: CardFooterProps) {
  const footerClassName = cardFooter({blurred, className});

  const renderProps: ComponentProps<typeof View> = {
    ...props,
    className: footerClassName,
    ...(testID && {testID}),
  };

  return asChild ? (
    React.cloneElement(
      children as React.ReactElement<{className: string}>,
      renderProps,
    )
  ) : (
    <View {...renderProps}>{children}</View>
  );
}
