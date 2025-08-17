import React, {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {AriaDialogProps, useDialog as useDialogAria} from "@react-aria/dialog";
import {AriaButtonProps, useButton as useAriaButton} from "@react-aria/button";
import {useFocusRing} from "@react-aria/focus";
import {
  GestureResponderEvent,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Reanimated, {FadeIn, FadeOut} from "react-native-reanimated";
import {tv} from "tailwind-variants";
import {button as buttonTV} from "./button";

export type AlertDialogProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  forceMount?: boolean;
};

export type AlertDialogReturn = {
  state: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
  };
};

export type AlertDialogComponentProps = {
  children: React.ReactNode;
  modal?: boolean;
} & AlertDialogProps;

export const useAlertDialog = ({
  defaultOpen,
  open,
  onOpenChange,
}: AlertDialogProps): AlertDialogReturn => {
  if (open && defaultOpen) {
    throw new Error("Cannot set both open and defaultOpen");
  }

  const [isOpen, setIsOpen] = useState(defaultOpen || open || false);

  useEffect(() => {
    if (isOpen) {
      onOpenChange?.(true);
    }
  }, [isOpen]);

  return {
    state: {
      isOpen,
      setIsOpen,
    },
  };
};

export const AlertDialogContext = createContext<
  AlertDialogReturn & {props: Partial<AlertDialogComponentProps>}
>({
  state: {isOpen: false, setIsOpen: () => {}},
  props: {},
});

export function AlertDialog({
  children,
  defaultOpen,
  open,
  ...props
}: AlertDialogComponentProps) {
  const hook = useAlertDialog({
    defaultOpen,
    open,
    onOpenChange: props.onOpenChange,
  });
  return (
    <AlertDialogContext.Provider value={{...hook, props}}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export type AlertDialogTriggerProps = {
  disabled?: boolean;
  asChild?: boolean;
} & Omit<AriaButtonProps, "isDisabled"> &
  Partial<AlertDialogReturn> &
  ComponentProps<typeof View>;

export type AlertDialogTriggerReturn = {
  componentProps: ComponentProps<typeof View> | HTMLButtonElement;
};

export const useAlertDialogTrigger = ({
  state,
  disabled,
  ...props
}: AlertDialogTriggerProps): AlertDialogTriggerReturn => {
  if (!state) {
    throw new Error("useAlertDialogTrigger must be used within an AlertDialog");
  }

  const ref = useRef<HTMLButtonElement>(null);
  const {buttonProps} = useAriaButton({...props, isDisabled: disabled}, ref);

  return {
    componentProps: {
      ...(Platform.OS === "web" ? buttonProps : {}),
      accessibilityRole: "button",
      onPress: () => state.setIsOpen(true),
      ...props,
    },
  };
};

export function AlertDialogTrigger({
  children,
  asChild = false,
  ...props
}: AlertDialogTriggerProps) {
  const dialog = useContext(AlertDialogContext);
  const {componentProps} = useAlertDialogTrigger({...dialog, ...props});

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      {
        ...(componentProps as ComponentProps<typeof Pressable>),
      },
    )
  ) : (
    <Pressable {...(componentProps as ComponentProps<typeof Pressable>)}>
      {typeof children === "string" ? <Text>{children}</Text> : children}
    </Pressable>
  );
}

export type AlertDialogOverlayReturn = {
  overlayProps: ComponentProps<typeof TouchableWithoutFeedback>;
};

export const useAlertDialogOverlay = ({
  state,
  forceMount,
}: Partial<AlertDialogReturn> & {
  forceMount?: boolean;
}): AlertDialogOverlayReturn => {
  if (!state) {
    throw new Error("useAlertDialogOverlay must be used within an AlertDialog");
  }
  return {
    overlayProps: {
      onPress: () => {
        if (!forceMount) {
          state.setIsOpen(false);
        }
      },
    },
  };
};

export type AlertDialogPortalComponentProps = {
  children: React.ReactNode;
} & ComponentProps<typeof View>;

export function AlertDialogPortal({
  children,
  ...props
}: AlertDialogPortalComponentProps) {
  return <View {...props}>{children}</View>;
}

export const alertDialogOverlay = tv({
  base: "fixed inset-0 z-50 bg-black opacity-80",
});

export type AlertDialogOverlayComponentProps = {
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof View>;

export function AlertDialogOverlay({
  asChild = false,
  baseClassName,
  ...props
}: AlertDialogOverlayComponentProps) {
  const {state, props: rootProps} = useContext(AlertDialogContext);
  const {overlayProps} = useAlertDialogOverlay({state});

  if (rootProps.modal === false) {
    return;
  }

  return asChild
    ? React.cloneElement(
        React.Children.toArray(props.children)[0] as React.ReactElement<{
          className: string;
        }>,
        {
          ...overlayProps,
          className: alertDialogOverlay({
            className: baseClassName || props.className,
          }),
        },
      )
    : state.isOpen && (
        <Reanimated.View entering={FadeIn} exiting={FadeOut}>
          <TouchableWithoutFeedback {...overlayProps}>
            <View
              {...props}
              className={alertDialogOverlay({
                className: baseClassName || props.className,
              })}
            />
          </TouchableWithoutFeedback>
        </Reanimated.View>
      );
}

export type AlertDialogContentProps = {
  modal?: boolean;
  onOpenAutoFocus?: (e: React.FocusEvent<Element, Element>) => void;
  onCloseAutoFocus?: (e: React.FocusEvent<Element, Element>) => void;
  onEscapeKeyDown?: (e: React.KeyboardEvent<Element>) => void;
  onPointerDownOutside?: (
    e: GestureResponderEvent | React.FocusEvent<Element, Element>,
  ) => void;
  onInteractOutside?: (
    e: GestureResponderEvent | React.FocusEvent<Element, Element>,
  ) => void;
  forceMount?: boolean;
} & Partial<AlertDialogReturn> &
  AriaDialogProps &
  ComponentProps<typeof View>;

export type AlertDialogContentReturn = {
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
  titleProps: ComponentProps<typeof View> | HTMLDivElement;
};

export const useAlertDialogContent = ({
  modal,
  state,
  forceMount,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  ...props
}: AlertDialogContentProps): AlertDialogContentReturn => {
  if (!state) {
    throw new Error("useAlertDialogContent must be used within an AlertDialog");
  }

  const dialogRef = useRef<View | HTMLDivElement>(null);
  const dialogAria = useDialogAria({...props}, dialogRef);

  return {
    componentProps: {
      ...(Platform.OS === "web" ? dialogAria.dialogProps : {}),
      ref: dialogRef,
      accessible: true,
      focusable: true,
      onFocus: (e) => {
        onOpenAutoFocus?.(e);
        onInteractOutside?.(e);
      },
      onBlur: (e) => {
        onCloseAutoFocus?.(e);
      },
      accessibilityRole: "dialog",
      accessibilityLiveRegion: "polite",
      accessibilityViewIsModal: modal,
      onKeyDown: (e) => {
        if (forceMount) return;
        if ((e as any).key === "Escape") {
          state.setIsOpen(false);
          onEscapeKeyDown?.(e as any);
        }
      },
      onPress: (e: GestureResponderEvent) => {
        onPointerDownOutside?.(e);
        onInteractOutside?.(e);
      },
      ...props,
    },
    titleProps: {
      ...(Platform.OS === "web" ? dialogAria.titleProps : {}),
      accessibilityRole: "heading",
    },
  };
};

export type AlertDialogContentComponentProps = {
  children: React.ReactNode;
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
  asChild?: boolean;
  className?: string;
  baseClassName?: string;
} & AlertDialogContentProps;

export const alertDialogContent = tv({
  slots: {
    base: "fixed left-[50%] top-[50%] z-50  w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg rounded-lg",
  },
  variants: {
    borderRadius: {
      none: {base: "rounded-none"},
      sm: {base: "rounded-sm"},
      md: {base: "rounded-md"},
      lg: {base: "rounded-lg"},
      xl: {base: "rounded-xl"},
    },
  },
});

export const AlertDialogContentContext = createContext<
  Pick<AlertDialogContentReturn, "componentProps" | "titleProps">
>({
  componentProps: {},
  titleProps: {},
});

export function AlertDialogContent({
  children,
  asChild = false,
  forceMount,
  borderRadius,
  baseClassName,
  ...props
}: AlertDialogContentComponentProps) {
  const {state} = useContext(AlertDialogContext);
  const contextProps = useAlertDialogContent({...props, state, forceMount});
  const {base} = alertDialogContent({borderRadius});
  const shouldRender = state.isOpen || !!forceMount;

  return (
    <AlertDialogContentContext.Provider value={contextProps}>
      {shouldRender &&
        (asChild ? (
          React.cloneElement(
            React.Children.toArray(children)[0] as React.ReactElement<{
              className: string;
            }>,
            {
              ...contextProps.componentProps,
              className: base({className: baseClassName || props.className}),
            },
          )
        ) : (
          <View
            {...props}
            {...contextProps.componentProps}
            className={base({className: baseClassName || props.className})}
          >
            <View>{children}</View>
          </View>
        ))}
    </AlertDialogContentContext.Provider>
  );
}

export type AlertDialogHeaderComponentProps = {
  children: React.ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof View>;

export const alertDialogHeader = tv({
  base: "flex justify-center sm:justify-start w-full",
});

export function AlertDialogHeader({
  children,
  baseClassName,
  ...props
}: AlertDialogHeaderComponentProps) {
  return (
    <View
      {...props}
      className={alertDialogHeader({
        className: baseClassName || props.className,
      })}
    >
      {children}
    </View>
  );
}

export type AlertDialogTitleComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

export const alertDialogTitle = tv({
  base: "text-lg font-semibold leading-none tracking-tight text-foreground",
});

export function AlertDialogTitle({
  children,
  asChild = false,
  baseClassName,
  ...props
}: AlertDialogTitleComponentProps) {
  const {titleProps} = useContext(AlertDialogContentContext);
  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      {
        ...(titleProps as ComponentProps<typeof Text>),
        className: alertDialogTitle({
          className: baseClassName || props.className,
        }),
      },
    )
  ) : (
    <Text
      {...(titleProps as ComponentProps<typeof Text>)}
      {...props}
      className={alertDialogTitle({
        className: baseClassName || props.className,
      })}
    >
      {children}
    </Text>
  );
}

export type AlertDialogDescriptionComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

export const alertDialogDescription = tv({
  base: "text-sm text-muted-foreground",
});

export function AlertDialogDescription({
  children,
  asChild = false,
  baseClassName,
  ...props
}: AlertDialogDescriptionComponentProps) {
  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      {
        className: alertDialogDescription({
          className: baseClassName || props.className,
        }),
      },
    )
  ) : (
    <Text
      {...props}
      className={alertDialogDescription({
        className: baseClassName || props.className,
      })}
    >
      {children}
    </Text>
  );
}

export type AlertDialogFooterComponentProps = {
  children: React.ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof View>;

export const alertDialogFooter = tv({
  base: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
});

export function AlertDialogFooter({
  children,
  baseClassName,
  ...props
}: AlertDialogFooterComponentProps) {
  return (
    <View
      {...props}
      className={alertDialogFooter({
        className: baseClassName || props.className,
      })}
    >
      {children}
    </View>
  );
}

export type DialogActionHookProps = {
  state?: AlertDialogReturn["state"];
  forceMount?: boolean;
} & Omit<AriaButtonProps, "isDisabled"> & {disabled?: boolean};

export type DialogActionHookReturn = {
  componentProps: ComponentProps<typeof Pressable> | HTMLButtonElement;
};

export const useDialogAction = ({
  state,
  disabled,
  onPress,
  ...props
}: DialogActionHookProps): DialogActionHookReturn => {
  if (!state) {
    throw new Error("useDialogAction must be used within an AlertDialog");
  }

  const ref = useRef<HTMLButtonElement>(null);
  const {buttonProps} = useAriaButton({...props, isDisabled: disabled}, ref);
  const {focusProps} = useFocusRing();

  return {
    componentProps: {
      ...(Platform.OS === "web" ? {...buttonProps, ...focusProps} : {}),
      accessibilityRole: "button",
      onPress: (e: any) => {
        onPress?.(e as any);
        state.setIsOpen(false);
      },
    },
  };
};

export type AlertDialogActionComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
} & ComponentProps<typeof Pressable>;

export type AlertDialogCancelComponentProps = AlertDialogActionComponentProps;

export function AlertDialogAction({
  children,
  asChild = false,
  baseClassName,
  variant = "destructive",
  size = "default",
  borderRadius = "md",
  ...props
}: AlertDialogActionComponentProps) {
  const {state} = useContext(AlertDialogContext);
  const {componentProps} = useDialogAction({state});
  const className = buttonTV({
    variant,
    size,
    borderRadius,
    className: baseClassName || props.className,
  });

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<any>,
      {
        ...(componentProps as ComponentProps<typeof Pressable>),
        ...props,
        className,
      },
    )
  ) : (
    <Pressable
      {...(componentProps as ComponentProps<typeof Pressable>)}
      {...props}
      className={className}
    >
      <Text className="text-foreground">{children}</Text>
    </Pressable>
  );
}

export function AlertDialogCancel({
  children,
  asChild = false,
  baseClassName,
  variant = "outline",
  size = "default",
  borderRadius = "md",
  ...props
}: AlertDialogCancelComponentProps) {
  const {state} = useContext(AlertDialogContext);
  const {componentProps} = useDialogAction({state});
  const className = buttonTV({
    variant,
    size,
    borderRadius,
    className: baseClassName || props.className,
  });

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<any>,
      {
        ...(componentProps as ComponentProps<typeof Pressable>),
        ...props,
        className,
      },
    )
  ) : (
    <Pressable
      {...(componentProps as ComponentProps<typeof Pressable>)}
      {...props}
      className={className}
    >
      <Text className="text-foreground">{children}</Text>
    </Pressable>
  );
}
