import React, {
  ComponentProps,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import {Pressable, View, Platform, Text} from "react-native";
import {useButton} from "@react-aria/button";
import {useFocusRing} from "@react-aria/focus";
import {
  XIcon,
  InfoIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  AlertCircleIcon,
} from "lucide-react-native";
import {tv} from "tailwind-variants";
import {themes, ThemeContext} from "../theme";

/**
 * Base props for the Alert component.
 * @param variant - The variant of the alert (shadcn inspired).
 * @param color - The color of the alert (HeroUI inspired).
 * @param radius - The border radius of the alert.
 * @param isVisible - Whether the alert is visible.
 * @param isClosable - Whether the alert can be closed.
 * @param hideIcon - Whether to hide the icon.
 * @param hideIconWrapper - Whether to hide the icon wrapper.
 * @param icon - Custom icon to display.
 * @param startContent - Content to display at the start of the alert.
 * @param endContent - Content to display at the end of the alert.
 * @param onClose - Callback function called when the alert is closed.
 * @param onVisibleChange - Callback function called when the visibility changes.
 * @param closeButtonProps - Props to pass to the close button.
 */
export type AlertProps = {
  variant?: "default" | "destructive";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  isVisible?: boolean;
  isClosable?: boolean;
  hideIcon?: boolean;
  hideIconWrapper?: boolean;
  icon?: React.ReactNode;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  onClose?: () => void;
  onVisibleChange?: (isVisible: boolean) => void;
  closeButtonProps?: ComponentProps<typeof Pressable>;
};

/**
 * Return type for the `useAlert` hook.
 * @param state - The state of the alert.
 * @param componentProps - Accessibility props to pass to the alert component.
 * @param closeButtonProps - Props to pass to the close button.
 */
export type AlertReturn = {
  state: {
    /**
     * Whether the alert is visible.
     */
    isVisible: boolean;
    /**
     * Function to set the visibility of the alert.
     */
    setIsVisible: (visible: boolean) => void;
    /**
     * Whether the alert is closable.
     */
    isClosable: boolean;
    /**
     * Whether the alert is focused.
     */
    isFocusVisible: boolean;
  };
  componentProps: React.ComponentProps<typeof View>;
  closeButtonProps: React.ComponentProps<typeof Pressable>;
};

/**
 * Props for the `Alert` component.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base alert component. Takes priority over the `className` prop.
 */
export type AlertComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & AlertProps &
  ComponentProps<typeof View>;

/**
 * Context value for the `Alert` component.
 * @param props - Props from the Alert component.
 */
export type AlertContextValue = {
  props: AlertProps;
} & AlertReturn;

/**
 * Props for the `AlertTitle` component.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base alert title component. Takes priority over the `className` prop.
 */
export type AlertTitleProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & React.ComponentProps<typeof Text>;

/**
 * Props for the `AlertDescription` component.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base alert description component. Takes priority over the `className` prop.
 */
export type AlertDescriptionProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & React.ComponentProps<typeof Text>;

/**
 * The use alert hook is the backbone of the alert component.
 * @param param0 - Props to configure the behavior of the alert. @see AlertProps
 * @returns Returns both the state and the accessibility props to pass to the alert component. @see AlertReturn
 */
export const useAlert = ({
  isVisible = true,
  isClosable = false,
  onClose,
  onVisibleChange,
  closeButtonProps,
}: AlertProps): AlertReturn => {
  const [internalIsVisible, setInternalIsVisible] = useState(isVisible);
  const isControlled = isVisible !== undefined;

  const currentIsVisible = isControlled ? isVisible : internalIsVisible;

  const handleClose = () => {
    if (!isControlled) {
      setInternalIsVisible(false);
    }
    onClose?.();
    onVisibleChange?.(false);
  };

  const setIsVisible = (visible: boolean) => {
    if (!isControlled) {
      setInternalIsVisible(visible);
    }
    onVisibleChange?.(visible);
  };

  useEffect(() => {
    if (isControlled) {
      setInternalIsVisible(isVisible);
    }
  }, [isVisible, isControlled]);

  const {buttonProps} = useButton(
    {
      onPress: handleClose,
      isDisabled: !isClosable,
      ...closeButtonProps,
    },
    React.useRef<View>(null),
  );

  const {isFocusVisible, focusProps} = useFocusRing();

  return {
    state: {
      isVisible: currentIsVisible,
      setIsVisible,
      isClosable: isClosable || false,
      isFocusVisible,
    },
    componentProps: {
      accessibilityRole: "alert" as const,
      accessibilityLiveRegion: "polite" as const,
    },
    closeButtonProps: {
      ...(Platform.OS === "web" ? {...buttonProps, ...focusProps} : {}),
      onPress: handleClose,
      accessibilityRole: "button" as const,
      accessibilityLabel: "Close",
      accessibilityHint: "Close the alert",
    },
  };
};

/**
 * A context wrapper containing the global state of the alert.
 * @see AlertContextValue
 */
export const AlertContext = createContext<AlertContextValue | null>(null);

/**
 * Get the default icon based on the color variant.
 */
const getDefaultIcon = (
  color: AlertProps["color"],
  variant: AlertProps["variant"],
) => {
  if (variant === "destructive" || color === "danger") {
    return <AlertCircleIcon />;
  }

  switch (color) {
    case "success":
      return <CheckCircle2Icon />;
    case "warning":
      return <AlertTriangleIcon />;
    case "primary":
    case "secondary":
    case "default":
    default:
      return <InfoIcon />;
  }
};

/**
 * Conditional classes for the alert component.
 * @see AlertComponentProps
 */
export const alert = tv({
  slots: {
    base: "relative w-full rounded-lg border px-4 py-3 text-sm flex flex-row items-start gap-3",
    iconWrapper: "flex-shrink-0",
    icon: "size-4 mt-0.5",
    content: "flex-1 flex flex-col gap-1",
    closeButton:
      "absolute top-2 right-2 p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity",
    closeIcon: "size-4",
  },
  variants: {
    variant: {
      default: {
        base: "bg-background text-foreground border-border",
      },
      destructive: {
        base: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    color: {
      default: {
        base: "bg-background text-foreground border-border",
      },
      primary: {
        base: "bg-primary/10 text-primary border-primary/20 [&>svg]:text-primary",
      },
      secondary: {
        base: "bg-secondary text-secondary-foreground border-secondary/20",
      },
      success: {
        base: "bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-50 dark:border-green-800 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
      },
      warning: {
        base: "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-50 dark:border-yellow-800 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400",
      },
      danger: {
        base: "bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-50 dark:border-red-800 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
      },
    },
    radius: {
      none: {
        base: "rounded-none",
      },
      sm: {
        base: "rounded-sm",
      },
      md: {
        base: "rounded-md",
      },
      lg: {
        base: "rounded-lg",
      },
      full: {
        base: "rounded-full",
      },
    },
    isClosable: {
      true: {
        base: "pr-12",
      },
    },
    hideIcon: {
      true: {
        iconWrapper: "hidden",
      },
    },
    hideIconWrapper: {
      true: {
        iconWrapper: "contents",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    color: "default",
    radius: "lg",
    isClosable: false,
    hideIcon: false,
    hideIconWrapper: false,
  },
});

/**
 * The Alert component displays a callout for user attention.
 * @example
 * ```tsx
 * <Alert>
 *   <AlertTitle>Heads up!</AlertTitle>
 *   <AlertDescription>
 *     You can add components to your app using the cli.
 *   </AlertDescription>
 * </Alert>
 * ```
 * @param param0 - Props to configure the behavior of the alert. @see AlertComponentProps
 * @returns Returns an alert component with context for child components. @see AlertContextValue
 */
export function Alert({
  children,
  asChild = false,
  variant = "default",
  color = "default",
  radius = "lg",
  isVisible = true,
  isClosable = false,
  hideIcon = false,
  hideIconWrapper = false,
  icon,
  startContent,
  endContent,
  onClose,
  onVisibleChange,
  closeButtonProps,
  baseClassName,
  ...props
}: AlertComponentProps) {
  const alertState = useAlert({
    isVisible,
    isClosable,
    onClose,
    onVisibleChange,
    closeButtonProps,
  });

  const {
    base,
    iconWrapper,
    icon: iconClass,
    content,
    closeButton,
    closeIcon,
  } = alert();

  // Don't render if not visible
  if (!alertState.state.isVisible) {
    return null;
  }

  const renderProps = {
    ...alertState.componentProps,
    ...props,
    className: base({
      variant,
      color,
      radius,
      isClosable,
      hideIcon,
      hideIconWrapper,
      className: baseClassName || props.className,
    }),
  };

  const contextValue: AlertContextValue = {
    ...alertState,
    props: {
      variant,
      color,
      radius,
      isVisible,
      isClosable,
      hideIcon,
      hideIconWrapper,
      icon,
      startContent,
      endContent,
      onClose,
      onVisibleChange,
      closeButtonProps,
    },
  };

  const IconElement = () => {
    if (hideIcon) return null;

    return (
      <View className={iconWrapper({hideIconWrapper})}>
        <View className={iconClass()}>
          {icon || getDefaultIcon(color, variant)}
        </View>
      </View>
    );
  };

  const CloseButton = () => {
    if (!isClosable) return null;

    return (
      <Pressable
        {...alertState.closeButtonProps}
        className={closeButton()}
        {...closeButtonProps}
      >
        <XIcon className={closeIcon()} />
      </Pressable>
    );
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {asChild ? (
        React.cloneElement(
          React.Children.toArray(children)[0] as React.ReactElement<{
            className: string;
          }>,
          {
            ...renderProps,
            className: renderProps.className,
          },
        )
      ) : (
        <View {...renderProps}>
          {startContent}
          <IconElement />
          <View className={content()}>{children}</View>
          {endContent}
          <CloseButton />
        </View>
      )}
    </AlertContext.Provider>
  );
}

/**
 * Conditional classes for the alert title component.
 * @see AlertTitleProps
 */
export const alertTitle = tv({
  base: "mb-1 font-medium leading-none tracking-tight",
});

/**
 * The AlertTitle component displays the title of an alert.
 * @param param0 - Props to configure the alert title. @see AlertTitleProps
 * @returns Returns an alert title component.
 */
export function AlertTitle({
  children,
  asChild = false,
  baseClassName,
  ...props
}: AlertTitleProps) {
  const alertContext = useContext(AlertContext);

  if (!alertContext) {
    throw new Error("AlertTitle must be used within an Alert");
  }

  const titleClass = alertTitle({
    className: baseClassName || props.className,
  });

  return asChild ? (
    React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          ...props,
          className: titleClass,
        });
      }
      return child;
    })
  ) : (
    <Text {...props} className={titleClass}>
      {children}
    </Text>
  );
}

/**
 * Conditional classes for the alert description component.
 * @see AlertDescriptionProps
 */
export const alertDescription = tv({
  base: "text-sm [&_p]:leading-relaxed",
});

/**
 * The AlertDescription component displays the description of an alert.
 * @param param0 - Props to configure the alert description. @see AlertDescriptionProps
 * @returns Returns an alert description component.
 */
export function AlertDescription({
  children,
  asChild = false,
  baseClassName,
  ...props
}: AlertDescriptionProps) {
  const alertContext = useContext(AlertContext);

  if (!alertContext) {
    throw new Error("AlertDescription must be used within an Alert");
  }

  const descriptionClass = alertDescription({
    className: baseClassName || props.className,
  });

  return asChild ? (
    React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          ...props,
          className: descriptionClass,
        });
      }
      return child;
    })
  ) : (
    <Text {...props} className={descriptionClass}>
      {children}
    </Text>
  );
}
