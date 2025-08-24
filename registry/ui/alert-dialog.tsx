import {AriaButtonProps, useButton as useAriaButton} from "@react-aria/button";
import {AriaDialogProps, useDialog as useDialogAria} from "@react-aria/dialog";
import {useFocusRing} from "@react-aria/focus";
import React, {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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

/**
 * Base props for the root `AlertDialog` component, context, and hook.
 * @param defaultOpen - Uncontrolled default open state of the alert dialog.
 * @param open - Controlled open state of the alert dialog.
 * @param onOpenChange - Callback function called when the alert dialog open state changes.
 * @param forceMount - Whether to force mount the alert dialog content even when closed.
 */
export type AlertDialogProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  forceMount?: boolean;
};

/**
 * Return type for the `useAlertDialog` hook.
 * @param state - The state of the alert dialog.
 */
export type AlertDialogReturn = {
  state: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
  };
};

/**
 * Base props for the `AlertDialogContent` component, context, and hook.
 * @param modal - Whether the alert dialog is modal (prevents interaction with elements outside the dialog).
 * @param onOpenAutoFocus - Callback function called when the alert dialog opens and auto-focus is triggered.
 * @param onCloseAutoFocus - Callback function called when the alert dialog closes and auto-focus is triggered.
 * @param onEscapeKeyDown - Callback function called when the Escape key is pressed.
 * @param onPointerDownOutside - Callback function called when a pointer event occurs outside the dialog.
 * @param onInteractOutside - Callback function called when an interaction occurs outside the dialog.
 * @param forceMount - Whether to force mount the alert dialog content even when closed.
 * @see AlertDialogReturn
 * @see AriaDialogProps
 * @see ComponentProps
 */
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

/**
 * Return type for the `useAlertDialogContent` hook.
 * @param componentProps - Accessibility props to pass to the alert dialog content component.
 * @param titleProps - Accessibility props to pass to the alert dialog title component.
 */
export type AlertDialogContentReturn = {
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
  titleProps: ComponentProps<typeof View> | HTMLDivElement;
};

/**
 * Base props for the `AlertDialogTrigger` component, context, and hook.
 * @param disabled - Whether the alert dialog trigger is disabled.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @see AriaButtonProps
 * @see AlertDialogReturn
 * @see ComponentProps
 */
export type AlertDialogTriggerProps = {
  disabled?: boolean;
  asChild?: boolean;
} & Omit<AriaButtonProps, "isDisabled"> &
  Partial<AlertDialogReturn> &
  ComponentProps<typeof View>;

/**
 * Return type for the `useAlertDialogTrigger` hook.
 * @param componentProps - Accessibility props to pass to the alert dialog trigger component.
 */
export type AlertDialogTriggerReturn = {
  componentProps: ComponentProps<typeof View> | HTMLButtonElement;
};

/**
 * Return type for the `useAlertDialogOverlay` hook.
 * @param overlayProps - Props to pass to the alert dialog overlay component.
 */
export type AlertDialogOverlayReturn = {
  overlayProps: ComponentProps<typeof TouchableWithoutFeedback>;
};

/**
 * Props for the `AlertDialog` component.
 * @param children - The content to render inside the alert dialog.
 * @param modal - Whether the alert dialog is modal (prevents interaction with elements outside the dialog).
 * @see AlertDialogProps
 */
export type AlertDialogComponentProps = {
  children: React.ReactNode;
  modal?: boolean;
} & AlertDialogProps;

/**
 * Props for the `AlertDialogContent` component.
 * @param children - The content to render inside the alert dialog content.
 * @param borderRadius - Sets the border radius of the alert dialog content.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param className - Custom tailwind classes to apply to the alert dialog content component.
 * @param baseClassName - Custom tailwind classes to apply to the base alert dialog content component. Takes priority over the `className` prop.
 * @see AlertDialogContentProps
 */
export type AlertDialogContentComponentProps = {
  children: React.ReactNode;
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
  asChild?: boolean;
  className?: string;
  baseClassName?: string;
} & AlertDialogContentProps;

/**
 * Props for the `AlertDialogDescription` component.
 * @param children - The content to render inside the alert dialog description.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base alert dialog description component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type AlertDialogDescriptionComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

/**
 * Props for the `AlertDialogTitle` component.
 * @param children - The content to render inside the alert dialog title.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base alert dialog title component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type AlertDialogTitleComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

/**
 * Props for the `AlertDialogHeader` component.
 * @param children - The content to render inside the alert dialog header.
 * @param baseClassName - Custom tailwind classes to apply to the base alert dialog header component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type AlertDialogHeaderComponentProps = {
  children: React.ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * Props for the `AlertDialogFooter` component.
 * @param children - The content to render inside the alert dialog footer.
 * @param baseClassName - Custom tailwind classes to apply to the base alert dialog footer component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type AlertDialogFooterComponentProps = {
  children: React.ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * Props for the `AlertDialogPortal` component.
 * @param children - The content to render inside the alert dialog portal.
 * @see ComponentProps
 */
export type AlertDialogPortalComponentProps = {
  children: React.ReactNode;
} & ComponentProps<typeof View>;

/**
 * Props for the `AlertDialogOverlay` component.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base alert dialog overlay component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type AlertDialogOverlayComponentProps = {
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * Props for the `AlertDialogAction` component.
 * @param children - The content to render inside the alert dialog action button.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base alert dialog action component. Takes priority over the `className` prop.
 * @param variant - The variant of the button.
 * @param size - The size of the button.
 * @param borderRadius - Sets the border radius of the button.
 * @see ComponentProps
 */
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
  size?: "md" | "sm" | "lg" | "icon";
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
} & ComponentProps<typeof Pressable>;

/**
 * Props for the `AlertDialogCancel` component.
 * @see AlertDialogActionComponentProps
 */
export type AlertDialogCancelComponentProps = AlertDialogActionComponentProps;

/**
 * Props for the `useDialogAction` hook.
 * @param state - The state of the alert dialog.
 * @param forceMount - Whether to force mount the alert dialog content even when closed.
 * @param disabled - Whether the button is disabled.
 * @see AriaButtonProps
 */
export type DialogActionHookProps = {
  state?: AlertDialogReturn["state"];
  forceMount?: boolean;
} & Omit<AriaButtonProps, "isDisabled"> & {disabled?: boolean};

/**
 * Return type for the `useDialogAction` hook.
 * @param componentProps - Accessibility props to pass to the button component.
 */
export type DialogActionHookReturn = {
  componentProps: ComponentProps<typeof Pressable> | HTMLButtonElement;
};

/**
 * The use alert dialog hook is the backbone of the alert dialog component.
 * @param param0 - Props to configure the behavior of the alert dialog. @see AlertDialogProps
 * @returns Returns the state of the alert dialog. @see AlertDialogReturn
 */
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

/**
 * The use alert dialog trigger hook is the backbone of the alert dialog trigger component.
 * @param param0 - Props to configure the behavior of the alert dialog trigger. @see AlertDialogTriggerProps
 * @returns Returns accessibility props to pass to the alert dialog trigger component. @see AlertDialogTriggerReturn
 */
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

/**
 * The use alert dialog overlay hook is the backbone of the alert dialog overlay component.
 * @param param0 - Props to configure the behavior of the alert dialog overlay.
 * @returns Returns props to pass to the alert dialog overlay component. @see AlertDialogOverlayReturn
 */
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

/**
 * The use alert dialog content hook is the backbone of the alert dialog content component.
 * @param param0 - Props to configure the behavior of the alert dialog content. @see AlertDialogContentProps
 * @returns Returns accessibility props for the alert dialog content and title components. @see AlertDialogContentReturn
 */
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

/**
 * The use dialog action hook is the backbone of the alert dialog action component.
 * @param param0 - Props to configure the behavior of the dialog action. @see DialogActionHookProps
 * @returns Returns accessibility props to pass to the button component. @see DialogActionHookReturn
 */
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

/**
 * A context wrapper containing the global state of the alert dialog.
 * @see AlertDialogReturn
 * @see AlertDialogComponentProps
 */
export const AlertDialogContext = createContext<
  AlertDialogReturn & {props: Partial<AlertDialogComponentProps>}
>({
  state: {isOpen: false, setIsOpen: () => {}},
  props: {},
});

/**
 * A context wrapper containing the global state of the alert dialog content.
 * @see AlertDialogContentReturn
 */
export const AlertDialogContentContext = createContext<
  Pick<AlertDialogContentReturn, "componentProps" | "titleProps">
>({
  componentProps: {},
  titleProps: {},
});

/**
 * Conditional classes for the alert dialog overlay component.
 * @see AlertDialogOverlayComponentProps
 */
export const alertDialogOverlay = tv({
  base: "fixed inset-0 z-50 bg-black opacity-80",
});

/**
 * Conditional classes for the alert dialog content component.
 * It includes the following slots:
 * - base: The base styles for the alert dialog content.
 * @see AlertDialogContentComponentProps
 */
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

/**
 * Conditional classes for the alert dialog header component.
 * @see AlertDialogHeaderComponentProps
 */
export const alertDialogHeader = tv({
  base: "flex justify-center sm:justify-start w-full",
});

/**
 * Conditional classes for the alert dialog title component.
 * @see AlertDialogTitleComponentProps
 */
export const alertDialogTitle = tv({
  base: "text-lg font-semibold leading-none tracking-tight text-foreground",
});

/**
 * Conditional classes for the alert dialog description component.
 * @see AlertDialogDescriptionComponentProps
 */
export const alertDialogDescription = tv({
  base: "text-sm text-muted-foreground",
});

/**
 * Conditional classes for the alert dialog footer component.
 * @see AlertDialogFooterComponentProps
 */
export const alertDialogFooter = tv({
  base: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
});

/**
 * The root alert dialog component. This should be supplied once per alert dialog group. It is required for all alert dialogs.
 * @example
 * ```tsx
 * <AlertDialog>
 *   <AlertDialogTrigger>Open Alert Dialog</AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogHeader>
 *       <AlertDialogTitle>Are you sure?</AlertDialogTitle>
 *       <AlertDialogDescription>
 *         This action cannot be undone. This will permanently delete your account
 *         and remove your data from our servers.
 *       </AlertDialogDescription>
 *     </AlertDialogHeader>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel>Cancel</AlertDialogCancel>
 *       <AlertDialogAction>Continue</AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 * ```
 * @param param0 - Props to configure the behavior of the alert dialog. @see AlertDialogComponentProps
 * @returns Returns a context wrapper containing the global state of the alert dialog.
 */
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

/**
 * The alert dialog trigger component. This component is used to open the alert dialog.
 * @param param0 - Props to configure the behavior of the alert dialog trigger. @see AlertDialogTriggerProps
 * @returns Returns a `Pressable` which is used to open the alert dialog.
 */
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

/**
 * The alert dialog portal component. The portal is not used in this library as there is no body element in React Native, it is only here for compatibility with the Radix UI and Shadcn UI and can be removed if not used.
 * @param param0 - Props to configure the behavior of the alert dialog portal. @see AlertDialogPortalComponentProps
 * @returns Returns a `View` which wraps the alert dialog content.
 */
export function AlertDialogPortal({
  children,
  ...props
}: AlertDialogPortalComponentProps) {
  return <View {...props}>{children}</View>;
}

/**
 * The alert dialog overlay component. This component is used to render the backdrop of the alert dialog.
 * @param param0 - Props to configure the behavior of the alert dialog overlay. @see AlertDialogOverlayComponentProps
 * @returns Returns a `TouchableWithoutFeedback` which is used to close the alert dialog when clicked outside.
 */
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

/**
 * The alert dialog content component. This component is used to render the main content of the alert dialog.
 * @param param0 - Props to configure the behavior of the alert dialog content. @see AlertDialogContentComponentProps
 * @returns Returns a `View` which contains the alert dialog content.
 */
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

/**
 * The alert dialog header component. This component is used to render the header section of the alert dialog.
 * @param param0 - Props to configure the behavior of the alert dialog header. @see AlertDialogHeaderComponentProps
 * @returns Returns a `View` which contains the alert dialog header content.
 */
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

/**
 * The alert dialog title component. This component is used to render the title of the alert dialog.
 * @param param0 - Props to configure the behavior of the alert dialog title. @see AlertDialogTitleComponentProps
 * @returns Returns a `Text` component which contains the alert dialog title.
 */
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

/**
 * The alert dialog description component. This component is used to render the description of the alert dialog.
 * @param param0 - Props to configure the behavior of the alert dialog description. @see AlertDialogDescriptionComponentProps
 * @returns Returns a `Text` component which contains the alert dialog description.
 */
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

/**
 * The alert dialog footer component. This component is used to render the footer section of the alert dialog.
 * @param param0 - Props to configure the behavior of the alert dialog footer. @see AlertDialogFooterComponentProps
 * @returns Returns a `View` which contains the alert dialog footer content.
 */
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

/**
 * The alert dialog action component. This component is used to perform the primary action in the alert dialog.
 * @param param0 - Props to configure the behavior of the alert dialog action. @see AlertDialogActionComponentProps
 * @returns Returns a `Pressable` which is used to perform the primary action.
 */
export function AlertDialogAction({
  children,
  asChild = false,
  baseClassName,
  variant = "destructive",
  size = "md",
  borderRadius = "md",
  ...props
}: AlertDialogActionComponentProps) {
  const {state} = useContext(AlertDialogContext);
  const {componentProps} = useDialogAction({state});
  const {base, text} = buttonTV({
    variant,
    size,
    borderRadius,
  });

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<any>,
      {
        ...(componentProps as ComponentProps<typeof Pressable>),
        ...props,
        className: base({className: baseClassName || props.className}),
      },
    )
  ) : (
    <Pressable
      {...(componentProps as ComponentProps<typeof Pressable>)}
      {...props}
      className={base({className: baseClassName || props.className})}
    >
      <Text className={text({className: baseClassName || props.className})}>
        {children}
      </Text>
    </Pressable>
  );
}

/**
 * The alert dialog cancel component. This component is used to cancel the action in the alert dialog.
 * @param param0 - Props to configure the behavior of the alert dialog cancel. @see AlertDialogCancelComponentProps
 * @returns Returns a `Pressable` which is used to cancel the action.
 */
export function AlertDialogCancel({
  children,
  asChild = false,
  baseClassName,
  variant = "outline",
  size = "md",
  borderRadius = "md",
  ...props
}: AlertDialogCancelComponentProps) {
  const {state} = useContext(AlertDialogContext);
  const {componentProps} = useDialogAction({state});
  const {base, text} = buttonTV({
    variant,
    size,
    borderRadius,
  });

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<any>,
      {
        ...(componentProps as ComponentProps<typeof Pressable>),
        ...props,
        className: base({className: baseClassName || props.className}),
      },
    )
  ) : (
    <Pressable
      {...(componentProps as ComponentProps<typeof Pressable>)}
      {...props}
      className={base({className: baseClassName || props.className})}
    >
      <Text className={text({className: baseClassName || props.className})}>
        {children}
      </Text>
    </Pressable>
  );
}
