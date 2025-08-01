import React, {ComponentProps, ReactNode, useRef, useState} from "react";
import {View, Pressable, Platform, Text} from "react-native";
import {tv} from "tailwind-variants";
import {usePress} from "@react-aria/interactions";
import {useFocusRing} from "@react-aria/focus";

/**
 * Props for the main Card component.
 * @param children - React children to render inside the card
 * @param variant - The visual style variant of the card (shadcn, outline, ghost)
 * @param radius - Sets the border radius of the card (none, sm, md, lg, xl)
 * @param asChild - If true, merges props with first child element instead of rendering wrapper
 * @param blurred - When true, applies blur effect to the card
 * @param pressable - When true, makes the card interactive with press states
 * @param disabled - When true and pressable is enabled, disables interaction
 * @param onPress - Callback function called when card is pressed
 * @param onPressStart - Callback function called when press interaction starts
 * @param onPressEnd - Callback function called when press interaction ends
 * @param baseClassName - Custom tailwind classes to apply to the base card component. Takes priority over className
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
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * Props for CardHeader component.
 * @param children - React children to render inside the card header
 * @param asChild - If true, merges props with first child element instead of rendering wrapper
 * @param className - Additional CSS classes to apply
 * @param blurred - When true, applies blur effect to the header
 * @param baseClassName - Custom tailwind classes to apply to the base header component. Takes priority over className
 */
export type CardHeaderProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  blurred?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * Props for CardTitle component.
 * @param children - React children to render inside the card title
 * @param asChild - If true, merges props with first child element instead of rendering wrapper
 * @param className - Additional CSS classes to apply
 * @param blurred - When true, applies blur effect to the title
 * @param baseClassName - Custom tailwind classes to apply to the base title component. Takes priority over className
 */
export type CardTitleProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  blurred?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

/**
 * Props for CardDescription component.
 * @param children - React children to render inside the card description
 * @param asChild - If true, merges props with first child element instead of rendering wrapper
 * @param className - Additional CSS classes to apply
 * @param blurred - When true, applies blur effect to the description
 * @param baseClassName - Custom tailwind classes to apply to the base description component. Takes priority over className
 */
export type CardDescriptionProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  blurred?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

/**
 * Props for CardAction component.
 * @param children - React children to render inside the card action area
 * @param asChild - If true, merges props with first child element instead of rendering wrapper
 * @param className - Additional CSS classes to apply
 * @param blurred - When true, applies blur effect to the action area
 * @param baseClassName - Custom tailwind classes to apply to the base action component. Takes priority over className
 */
export type CardActionProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  blurred?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * Props for CardContent component.
 * @param children - React children to render inside the card content
 * @param asChild - If true, merges props with first child element instead of rendering wrapper
 * @param className - Additional CSS classes to apply
 * @param blurred - When true, applies blur effect to the content
 * @param baseClassName - Custom tailwind classes to apply to the base content component. Takes priority over className
 */
export type CardContentProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  blurred?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

/**
 * Props for CardFooter component.
 * @param children - React children to render inside the card footer
 * @param asChild - If true, merges props with first child element instead of rendering wrapper
 * @param className - Additional CSS classes to apply
 * @param blurred - When true, applies blur effect to the footer
 * @param baseClassName - Custom tailwind classes to apply to the base footer component. Takes priority over className
 */
export type CardFooterProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  blurred?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

/**
 * Return type for the useCard hook.
 * @param componentProps - Accessibility and interaction props to pass to the card component
 * @param state - Current state of the card including press, disabled, and focus states
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
 * @param pressable - Whether the card should be interactive and respond to press events
 * @param disabled - Whether the card should be disabled and not respond to interactions
 * @param onPress - Callback function called when the card is pressed
 * @param onPressStart - Callback function called when press interaction starts
 * @param onPressEnd - Callback function called when press interaction ends
 * @returns Returns both the state and accessibility props to pass to the card component
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
 * Defines the visual appearance and styling for the main card container.
 * Includes variants for different visual styles, border radius options, and states.
 */
export const card = tv({
  base: "text-card-foreground flex flex-col border shadow-sm p-6 gap-6",
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
      true: "opacity-90 backdrop-blur-md",
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
 * Card header styles using tailwind-variants.
 * Defines the styling for the card header section with optional blur effect.
 */
export const cardHeader = tv({
  base: "flex flex-col gap-1.5",
  variants: {
    blurred: {
      true: "opacity-90 backdrop-blur-md",
    },
  },
  defaultVariants: {
    blurred: false,
  },
});

/**
 * Card title styles using tailwind-variants.
 * Defines the typography and styling for the card title with optional blur effect.
 */
export const cardTitle = tv({
  base: "text-foreground font-semibold leading-none tracking-tight",
  variants: {
    blurred: {
      true: "opacity-90 backdrop-blur-md",
    },
  },
  defaultVariants: {
    blurred: false,
  },
});

/**
 * Card description styles using tailwind-variants.
 * Defines the typography and styling for the card description with optional blur effect.
 */
export const cardDescription = tv({
  base: "text-sm text-muted-foreground",
  variants: {
    blurred: {
      true: "opacity-90 backdrop-blur-md",
    },
  },
  defaultVariants: {
    blurred: false,
  },
});

/**
 * Card action styles using tailwind-variants.
 * Defines the layout and styling for the card action area with optional blur effect.
 */
export const cardAction = tv({
  base: "flex items-center justify-end",
  variants: {
    blurred: {
      true: "opacity-90 backdrop-blur-md",
    },
  },
  defaultVariants: {
    blurred: false,
  },
});

/**
 * Card content styles using tailwind-variants.
 * Defines the styling for the main card content area with optional blur effect.
 */
export const cardContent = tv({
  base: "text-muted-foreground",
  variants: {
    blurred: {
      true: "opacity-90 backdrop-blur-md",
    },
  },
  defaultVariants: {
    blurred: false,
  },
});

/**
 * Card footer styles using tailwind-variants.
 * Defines the layout and styling for the card footer section with optional blur effect.
 */
export const cardFooter = tv({
  base: "flex items-center",
  variants: {
    blurred: {
      true: "opacity-90 backdrop-blur-md",
    },
  },
  defaultVariants: {
    blurred: false,
  },
});

/**
 * Main Card component with accessibility and styling support.
 * A flexible container component that displays content in a visually appealing card format.
 * Supports multiple variants, customizable border radius, blur effects, and optional press interactions.
 * Built with accessibility in mind and fully compatible with both React Native and web platforms.
 *
 * @example
 * ```tsx
 * <Card variant="shadcn" radius="lg" pressable onPress={() => console.log('pressed')}>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description text</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Main card content goes here
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 * @see CardProps
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
  baseClassName,
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
    className: baseClassName || className,
  });

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
 * Card header component for displaying title and description content.
 * Typically used at the top of a card to provide context and hierarchy.
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Important Update</CardTitle>
 *   <CardDescription>Please review the following information</CardDescription>
 * </CardHeader>
 * ```
 * @see CardHeaderProps
 */
export function CardHeader({
  children,
  asChild = false,
  className,
  blurred = false,
  baseClassName,
  testID,
  ...props
}: CardHeaderProps) {
  const headerClassName = cardHeader({
    blurred,
    className: baseClassName || className,
  });

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
 * Card title component for displaying the main heading of a card.
 * Includes proper accessibility semantics with header role.
 *
 * @example
 * ```tsx
 * <CardTitle>Product Information</CardTitle>
 * ```
 * @see CardTitleProps
 */
export function CardTitle({
  children,
  asChild = false,
  className,
  blurred = false,
  baseClassName,
  testID,
  ...props
}: CardTitleProps) {
  const titleClassName = cardTitle({
    blurred,
    className: baseClassName || className,
  });

  const renderProps: ComponentProps<typeof Text> = {
    ...props,
    className: titleClassName,
    accessibilityRole: "header",
    ...(testID && {testID}),
  };

  return asChild ? (
    React.cloneElement(children as React.ReactElement<any>, renderProps)
  ) : (
    <Text {...renderProps}>{children}</Text>
  );
}

/**
 * Card description component for displaying supplementary text below the title.
 * Provides additional context or details about the card content.
 *
 * @example
 * ```tsx
 * <CardDescription>A brief description of the card content</CardDescription>
 * ```
 * @see CardDescriptionProps
 */
export function CardDescription({
  children,
  asChild = false,
  className,
  blurred = false,
  baseClassName,
  testID,
  ...props
}: CardDescriptionProps) {
  const descriptionClassName = cardDescription({
    blurred,
    className: baseClassName || className,
  });

  const renderProps: ComponentProps<typeof Text> = {
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
    <Text {...renderProps}>{children}</Text>
  );
}

/**
 * Card action component for displaying action buttons or controls.
 * Typically used to contain buttons or interactive elements aligned to the right.
 *
 * @example
 * ```tsx
 * <CardAction>
 *   <Button variant="outline">Cancel</Button>
 *   <Button>Confirm</Button>
 * </CardAction>
 * ```
 * @see CardActionProps
 */
export function CardAction({
  children,
  asChild = false,
  className,
  blurred = false,
  baseClassName,
  testID,
  ...props
}: CardActionProps) {
  const actionClassName = cardAction({
    blurred,
    className: baseClassName || className,
  });

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
 * Card content component for displaying the main body content of the card.
 * Contains the primary information or content that the card is meant to display.
 *
 * @example
 * ```tsx
 * <CardContent>
 *   <Text>Main content of the card goes here.</Text>
 *   <Image source={{uri: 'image-url'}} />
 * </CardContent>
 * ```
 * @see CardContentProps
 */
export function CardContent({
  children,
  asChild = false,
  className,
  blurred = false,
  baseClassName,
  testID,
  ...props
}: CardContentProps) {
  const contentClassName = cardContent({
    blurred,
    className: baseClassName || className,
  });

  const renderProps: ComponentProps<typeof Text> = {
    ...props,
    className: contentClassName,
    ...(testID && {testID}),
  };

  return asChild ? (
    React.cloneElement(children as React.ReactElement<any>, renderProps)
  ) : (
    <Text {...renderProps}>{children}</Text>
  );
}

/**
 * Card footer component for displaying supplementary information or actions.
 * Typically used at the bottom of a card for additional details or secondary actions.
 *
 * @example
 * ```tsx
 * <CardFooter>
 *   <Text>Last updated: 2 hours ago</Text>
 *   <Button size="sm">Learn More</Button>
 * </CardFooter>
 * ```
 *
 * @param children - React children to render in the footer
 * @param asChild - If true, merges props with first child instead of rendering wrapper
 * @param className - Additional CSS classes to apply
 * @param blurred - When true, applies blur effect to the footer
 * @param testID - Test identifier for testing
 * @param baseClassName - Custom tailwind classes that take priority over className
 * @returns A styled footer component with flex layout for content alignment
 */
export function CardFooter({
  children,
  asChild = false,
  className,
  blurred = false,
  baseClassName,
  testID,
  ...props
}: CardFooterProps) {
  const footerClassName = cardFooter({
    blurred,
    className: baseClassName || className,
  });

  const renderProps: ComponentProps<typeof Text> = {
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
    <Text {...renderProps}>{children}</Text>
  );
}
