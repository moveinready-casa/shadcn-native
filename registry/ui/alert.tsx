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

/**
 * Base props for the Alert component, context, and hook.
 * @param variant - The variant of the alert.
 * @param radius - The border radius of the alert.
 * @param isVisible - Whether the alert is visible.
 * @param isClosable - Whether the alert can be closed.
 * @param hideIcon - Whether to hide the icon.
 * @param icon - Custom icon to display.
 * @param endContent - Content to display at the end of the alert.
 * @param onClose - Callback function called when the alert is closed.
 * @param onVisibleChange - Callback function called when the visibility changes.
 * @param closeButtonProps - Props to pass to the close button.
 */
export type AlertProps = {
  variant?: "default" | "success" | "warning" | "destructive";
  radius?: "none" | "sm" | "md" | "lg" | "xl";
  isVisible?: boolean;
  isVisibleDefault?: boolean;
  isClosable?: boolean;
  hideIcon?: boolean;
  icon?: React.ReactNode;
  endContent?: React.ReactNode;
  onClose?: () => void;
  onVisibleChange?: (isVisible: boolean) => void;
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
  closeButtonProps: React.ComponentProps<typeof Pressable> | HTMLButtonElement;
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
  closeButtonProps?: ComponentProps<typeof Pressable> | HTMLButtonElement;
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
  isVisible,
  isVisibleDefault = true,
  isClosable = false,
  onClose,
  onVisibleChange,
}: AlertProps): AlertReturn => {
  const isControlled = isVisible != null;
  const [internalIsVisible, setInternalIsVisible] = useState<boolean>(
    isControlled ? isVisible : isVisibleDefault,
  );

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

  const closeButtonRef = React.useRef<View>(null);
  const {buttonProps: ariaButtonProps} = useButton(
    {
      onPress: handleClose,
      isDisabled: !isClosable,
      "aria-label": "Close alert",
    },
    closeButtonRef,
  );
  const {isFocusVisible, focusProps} = useFocusRing();

  return {
    state: {
      isVisible: isControlled ? isVisible : internalIsVisible,
      setIsVisible,
      isClosable,
      isFocusVisible,
    },
    componentProps: {
      ...(Platform.OS === "web"
        ? {
            role: "alert",
            "aria-live": "polite",
            "aria-atomic": true,
          }
        : {}),
      accessibilityRole: "alert" as const,
      accessibilityLiveRegion: "polite" as const,
      accessible: true,
    },
    closeButtonProps: {
      ...(Platform.OS === "web" ? {...ariaButtonProps, ...focusProps} : {}),
      onPress: () => handleClose(),
      accessibilityRole: "button" as const,
      accessibilityLabel: "Close alert",
      accessibilityHint: "Dismiss this alert",
      accessible: true,
      ref: closeButtonRef,
    },
  };
};

/**
 * A context wrapper containing the global state of the alert.
 * @see AlertContextValue
 */
export const AlertContext = createContext<AlertContextValue | null>(null);

/**
 * Conditional classes for the alert component.
 * @see AlertComponentProps
 */
export const alert = tv({
  slots: {
    base: "relative w-full rounded-lg border border-border px-4 py-3 text-sm flex flex-row items-start gap-3 bg-card",
    iconWrapper: "flex-shrink-0 pt-0.5",
    icon: "size-4 text-card-foreground",
    content: "flex-1 flex flex-col gap-0.5",
    closeButton:
      "absolute top-2 right-2 p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity",
    closeIcon: "size-4",
  },
  variants: {
    variant: {
      default: {
        icon: "text-card-foreground",
        closeIcon: "text-card-foreground",
      },
      success: {
        icon: "text-success",
        closeIcon: "text-success",
      },
      warning: {
        icon: "text-warning",
        closeIcon: "text-warning",
      },
      destructive: {
        icon: "text-destructive",
        closeIcon: "text-destructive",
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
      xl: {
        base: "rounded-xl",
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
  },
  defaultVariants: {
    variant: "default",
    radius: "lg",
    isClosable: false,
    hideIcon: false,
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
  radius = "lg",
  isVisible,
  isVisibleDefault = true,
  isClosable = false,
  hideIcon = false,
  icon,
  endContent,
  onClose,
  onVisibleChange,
  closeButtonProps,
  baseClassName,
  ...props
}: AlertComponentProps) {
  const alertState = useAlert({
    isVisible,
    isVisibleDefault,
    isClosable,
    onClose,
    onVisibleChange,
  });

  const {
    base,
    iconWrapper,
    content,
    closeButton,
    closeIcon,
    icon: iconClass,
  } = alert();

  const getDefaultIcon = (variant: AlertProps["variant"]) => {
    switch (variant) {
      case "destructive":
        return <AlertCircleIcon className={iconClass()} />;
      case "success":
        return <CheckCircle2Icon className={iconClass()} />;
      case "warning":
        return <AlertTriangleIcon className={iconClass()} />;
      case "default":
      default:
        return <InfoIcon className={iconClass()} />;
    }
  };

  const renderProps = {
    ...alertState.componentProps,
    ...props,
    className: base({
      variant,
      radius,
      isClosable,
      hideIcon,
      className: baseClassName || props.className,
    }),
  };

  const contextValue: AlertContextValue = {
    ...alertState,
    props: {
      variant,
      radius,
      isVisible,
      isVisibleDefault,
      isClosable,
      hideIcon,
      icon,
      endContent,
      onClose,
      onVisibleChange,
    },
  };

  return alertState.state.isVisible ? (
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
          {hideIcon ? null : (
            <View className={iconWrapper()}>
              <View>{icon || getDefaultIcon(variant)}</View>
            </View>
          )}
          <View className={content()}>{children}</View>
          {endContent}
          {alertState.state.isClosable && (
            <Pressable
              {...alertState.closeButtonProps}
              className={closeButton()}
              {...closeButtonProps}
            >
              <XIcon className={closeIcon()} />
            </Pressable>
          )}
        </View>
      )}
    </AlertContext.Provider>
  ) : null;
}

/**
 * Conditional classes for the alert title component.
 * @see AlertTitleProps
 */
export const alertTitle = tv({
  base: "line-clamp-1 min-h-4 font-medium tracking-tight text-card-foreground",
  variants: {
    variant: {
      default: "",
      success: "text-success",
      warning: "text-warning",
      destructive: "text-destructive",
    },
  },
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

  const renderProps = {
    ...props,
    className: alertTitle({
      variant: alertContext.props.variant,
      className: baseClassName || props.className,
    }),
  };

  return asChild ? (
    React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          ...renderProps,
        });
      }
      return child;
    })
  ) : (
    <Text {...renderProps}>{children}</Text>
  );
}

/**
 * Conditional classes for the alert description component.
 * @see AlertDescriptionProps
 */
export const alertDescription = tv({
  base: "text-muted-foreground flex flex-col gap-1 text-sm [&_p]:leading-relaxed",
  variants: {
    variant: {
      default: {},
      success: "text-success",
      warning: "text-warning",
      destructive: "text-destructive",
    },
  },
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

  const renderProps = {
    ...props,
    className: alertDescription({
      variant: alertContext.props.variant,
      className: baseClassName || props.className,
    }),
  };

  return asChild ? (
    React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          ...renderProps,
        });
      }
      return child;
    })
  ) : (
    <Text {...renderProps}>{children}</Text>
  );
}
