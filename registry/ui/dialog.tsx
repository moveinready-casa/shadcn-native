import {AriaButtonProps, useButton} from "@react-aria/button";
import {AriaDialogProps, useDialog as useDialogAria} from "@react-aria/dialog";
import {useFocusRing} from "@react-aria/focus";
import {XIcon} from "lucide-react-native";
import React, {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  GestureResponderEvent,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Reanimated, {FadeIn, FadeOut} from "react-native-reanimated";
import {tv} from "tailwind-variants";
import {ThemeContext, themes} from "../theme";

/**
 * Base props for the root `Dialog` component, context, and hook.
 * @param defaultOpen - Uncontrolled default open state of the dialog.
 * @param open - Controlled open state of the dialog.
 * @param onOpenChange - Callback function called when the dialog open state changes.
 * @param forceMount - Whether to force mount the dialog content even when closed.
 */
export type DialogProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  forceMount?: boolean;
};

/**
 * Return type for the `useDialog` hook.
 * @param state - The state of the dialog.
 * @param overlayProps - Props to pass to the dialog overlay component.
 */
export type DialogReturn = {
  state: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    controlledOpen: boolean | "uncontrolled";
  };
  overlayProps: ComponentProps<typeof TouchableWithoutFeedback>;
};

/**
 * Base props for the `DialogContent` component, context, and hook.
 * @param modal - Whether the dialog is modal (prevents interaction with elements outside the dialog).
 * @param onOpenAutoFocus - Callback function called when the dialog opens and auto-focus is triggered.
 * @param onCloseAutoFocus - Callback function called when the dialog closes and auto-focus is triggered.
 * @param onEscapeKeyDown - Callback function called when the Escape key is pressed.
 * @param onPointerDownOutside - Callback function called when a pointer event occurs outside the dialog.
 * @param onInteractOutside - Callback function called when an interaction occurs outside the dialog.
 * @param forceMount - Whether to force mount the dialog content even when closed.
 * @see DialogReturn
 * @see AriaDialogProps
 * @see ComponentProps
 */
export type DialogContentProps = {
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
} & Partial<DialogReturn> &
  AriaDialogProps &
  ComponentProps<typeof View>;

/**
 * Return type for the `useDialogContent` hook.
 * @param componentProps - Accessibility props to pass to the dialog content component.
 * @param titleProps - Accessibility props to pass to the dialog title component.
 * @param closeButtonProps - Accessibility props to pass to the dialog close button component.
 */
export type DialogContentReturn = {
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
  titleProps: ComponentProps<typeof View> | HTMLDivElement;
  closeButtonProps: ComponentProps<typeof View> | HTMLDivElement;
};

/**
 * Base props for the `DialogTrigger` component, context, and hook.
 * @param disabled - Whether the dialog trigger is disabled.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @see AriaButtonProps
 * @see DialogReturn
 * @see ComponentProps
 */
export type DialogTriggerProps = {
  disabled?: boolean;
  asChild?: boolean;
} & Omit<AriaButtonProps, "isDisabled"> &
  Partial<DialogReturn> &
  ComponentProps<typeof View>;

/**
 * Return type for the `useDialogTrigger` hook.
 * @param componentProps - Accessibility props to pass to the dialog trigger component.
 */
export type DialogTriggerReturn = {
  componentProps: ComponentProps<typeof View> | HTMLButtonElement;
};

/**
 * Props for the `Dialog` component.
 * @param children - The content to render inside the dialog.
 * @param modal - Whether the dialog is modal (prevents interaction with elements outside the dialog).
 * @see DialogProps
 */
export type DialogComponentProps = {
  children: React.ReactNode;
  modal?: boolean;
} & DialogProps;

/**
 * Props for the `DialogContent` component.
 * @param children - The content to render inside the dialog content.
 * @param borderRadius - Sets the border radius of the dialog content.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param className - Custom tailwind classes to apply to the dialog content component.
 * @param baseClassName - Custom tailwind classes to apply to the base dialog content component. Takes priority over the `className` prop.
 * @see DialogContentProps
 */
export type DialogContentComponentProps = {
  children: React.ReactNode;
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
  asChild?: boolean;
  className?: string;
  baseClassName?: string;
} & DialogContentProps;

/**
 * Props for the `DialogDescription` component.
 * @param children - The content to render inside the dialog description.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base dialog description component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type DialogDescriptionComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

/**
 * Props for the `DialogTitle` component.
 * @param children - The content to render inside the dialog title.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base dialog title component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type DialogTitleComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

/**
 * Props for the `DialogHeader` component.
 * @param children - The content to render inside the dialog header.
 * @param baseClassName - Custom tailwind classes to apply to the base dialog header component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type DialogHeaderComponentProps = {
  children: React.ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * Props for the `DialogFooter` component.
 * @param children - The content to render inside the dialog footer.
 * @param baseClassName - Custom tailwind classes to apply to the base dialog footer component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type DialogFooterComponentProps = {
  children: React.ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * Props for the `DialogClose` component.
 * @param children - The content to render inside the dialog close button.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base dialog close component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type DialogCloseComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Pressable>;

/**
 * Props for the `DialogPortal` component.
 * @param children - The content to render inside the dialog portal.
 * @see ComponentProps
 */
export type DialogPortalComponentProps = {
  children: React.ReactNode;
} & ComponentProps<typeof View>;

/**
 * Props for the `DialogOverlay` component.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base dialog overlay component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type DialogOverlayComponentProps = {
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * The use dialog hook is the backbone of the dialog component.
 * @param param0 - Props to configure the behavior of the dialog. @see DialogProps
 * @returns Returns both the state and the accessibility props to pass to the dialog component. @see DialogReturn
 */
export const useDialog = ({
  defaultOpen,
  open,
  forceMount,
  onOpenChange,
}: DialogProps): DialogReturn => {
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
      controlledOpen:
        forceMount || open === true
          ? true
          : open == null
            ? "uncontrolled"
            : false,
    },
    overlayProps: {
      onPress: () => {
        if (forceMount || open) {
          return;
        }
        setIsOpen(false);
      },
    },
  };
};

/**
 * The use dialog trigger hook is the backbone of the dialog trigger component.
 * @param param0 - Props to configure the behavior of the dialog trigger. @see DialogTriggerProps
 * @returns Returns accessibility props to pass to the dialog trigger component. @see DialogTriggerReturn
 */
export const useDialogTrigger = ({
  state,
  disabled,
  ...props
}: DialogTriggerProps): DialogTriggerReturn => {
  if (!state) {
    throw new Error("useDialogTrigger must be used within a Dialog");
  }

  const ref = useRef<HTMLButtonElement>(null);
  const {buttonProps} = useButton({...props, isDisabled: disabled}, ref);

  return {
    componentProps: {
      ...(Platform.OS === "web" ? buttonProps : {}),
      accessibilityRole: "button",
      onPress: () => {
        if (state.controlledOpen !== "uncontrolled") {
          return;
        }

        state.setIsOpen(true);
      },
      ...props,
    },
  };
};

/**
 * The use dialog content hook is the backbone of the dialog content component.
 * @param param0 - Props to configure the behavior of the dialog content. @see DialogContentProps
 * @returns Returns accessibility props for the dialog content, title, and close button components. @see DialogContentReturn
 */
export const useDialogContent = ({
  modal,
  state,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  ...props
}: DialogContentProps): DialogContentReturn => {
  const dialogRef = useRef<View | HTMLDivElement>(null);

  const dialogAria = useDialogAria(
    {...(Platform.OS === "web" ? props : {})},
    Platform.OS === "web" ? dialogRef : {current: null},
  );

  const buttonRef = useRef<HTMLButtonElement>(null);
  const {buttonProps} = useButton(props, buttonRef);
  const {focusProps} = useFocusRing();

  if (!state) {
    throw new Error("useDialogContent must be used within a Dialog");
  }

  const handleClose = () => {
    if (state.controlledOpen === true) {
      return;
    }
    state.setIsOpen(false);
  };

  return {
    componentProps: {
      ...(Platform.OS === "web" ? dialogAria.dialogProps : {}),
      ref: dialogRef,
      accessibile: true,
      focusable: true,
      onFocus: (e: React.FocusEvent<Element, Element>) => {
        onOpenAutoFocus?.(e);
        onInteractOutside?.(e);
      },
      onBlur: (e: React.FocusEvent<Element, Element>) => {
        onCloseAutoFocus?.(e);
      },
      accessibilityRole: "dialog",
      accessibilityLiveRegion: "polite",
      accessibilityViewIsModal: modal,
      onKeyDown: (e: React.KeyboardEvent<Element>) => {
        if (e.key === "Escape") {
          handleClose();
          onEscapeKeyDown?.(e);
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
    closeButtonProps: {
      ...(Platform.OS === "web" ? buttonProps : {}),
      ...(Platform.OS === "web" ? focusProps : {}),
      accessibilityRole: "button",
      onPress: () => handleClose(),
    },
  };
};

/**
 * A context wrapper containing the global state of the dialog.
 * @see DialogReturn
 * @see DialogComponentProps
 */
export const DialogContext = createContext<
  DialogReturn & {props: Partial<DialogComponentProps>}
>({
  state: {
    isOpen: false,
    setIsOpen: () => {},
    controlledOpen: false,
  },
  overlayProps: {},
  props: {},
});

/**
 * A context wrapper containing the global state of the dialog content.
 * @see DialogContentReturn
 */
export const DialogContentContext = createContext<DialogContentReturn>({
  componentProps: {},
  titleProps: {},
  closeButtonProps: {},
});

/**
 * Conditional classes for the dialog overlay component.
 * @see DialogOverlayComponentProps
 */
export const dialogOverlay = tv({
  base: "fixed inset-0 z-50 bg-black opacity-80",
});

/**
 * Conditional classes for the dialog content component.
 * It includes the following slots:
 * - base: The base styles for the dialog content.
 * - closeButton: The close button styles for the dialog content.
 * @see DialogContentComponentProps
 */
export const dialogContent = tv({
  slots: {
    base: "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg rounded-lg",
    closeButton:
      "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
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
 * Conditional classes for the dialog header component.
 * @see DialogHeaderComponentProps
 */
export const dialogHeader = tv({
  base: "flex justify-center sm:justify-start w-full",
});

/**
 * Conditional classes for the dialog title component.
 * @see DialogTitleComponentProps
 */
export const dialogTitle = tv({
  base: "text-lg font-semibold leading-none tracking-tight text-foreground",
});

/**
 * Conditional classes for the dialog footer component.
 * @see DialogFooterComponentProps
 */
export const dialogFooter = tv({
  base: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
});

/**
 * Conditional classes for the dialog description component.
 * @see DialogDescriptionComponentProps
 */
export const dialogDescription = tv({
  base: "text-sm text-muted-foreground",
});

/**
 * The root dialog component. This should be supplied once per dialog group. It is required for all dialogs.
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger>Open Dialog</DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Edit Profile</DialogTitle>
 *       <DialogDescription>
 *         Make changes to your profile here. Click save when you're done.
 *       </DialogDescription>
 *     </DialogHeader>
 *     <View className="grid gap-4 py-4">
 *       <View className="grid grid-cols-4 items-center gap-4">
 *         <Text className="text-right">Name</Text>
 *         <Text className="col-span-3">John Doe</Text>
 *       </View>
 *       <View className="grid grid-cols-4 items-center gap-4">
 *         <Text className="text-right">Username</Text>
 *         <Text className="col-span-3">@johndoe</Text>
 *       </View>
 *     </View>
 *     <DialogFooter>
 *       <DialogClose>Save changes</DialogClose>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 * @param param0 - Props to configure the behavior of the dialog. @see DialogComponentProps
 * @returns Returns a context wrapper containing the global state of the dialog.
 */
export function Dialog({
  children,
  forceMount,
  defaultOpen,
  open,
  ...props
}: DialogComponentProps) {
  const hookProps = useDialog({...props, forceMount, defaultOpen, open});
  return (
    <DialogContext.Provider value={{...hookProps, props}}>
      {children}
    </DialogContext.Provider>
  );
}

/**
 * The dialog trigger component. This component is used to open the dialog.
 * @param param0 - Props to configure the behavior of the dialog trigger. @see DialogTriggerProps
 * @returns Returns a `Pressable` which is used to open the dialog.
 */
export function DialogTrigger({
  children,
  asChild = false,
  ...props
}: DialogTriggerProps) {
  const state = useContext(DialogContext);
  const {componentProps} = useDialogTrigger({...state, ...props});

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
      {children}
    </Pressable>
  );
}

/**
 * The dialog portal component. The portal is not used in this library as there is no body element in React Native, it is only here for compatibility with the Radix UI and Shadcn UI and can be removed if not used.
 * @param param0 - Props to configure the behavior of the dialog portal. @see DialogPortalComponentProps
 * @returns Returns a `View` which wraps the dialog content.
 */
export function DialogPortal({children, ...props}: DialogPortalComponentProps) {
  return <View {...props}>{children}</View>;
}

/**
 * The dialog overlay component. This component is used to render the backdrop of the dialog.
 * @param param0 - Props to configure the behavior of the dialog overlay. @see DialogOverlayComponentProps
 * @returns Returns a `TouchableWithoutFeedback` which is used to close the dialog when clicked outside.
 */
export function DialogOverlay({
  asChild = false,
  baseClassName,
  ...props
}: DialogOverlayComponentProps) {
  const {state, overlayProps, props: dialogProps} = useContext(DialogContext);

  if (dialogProps.modal === false) {
    return;
  }

  return asChild
    ? React.cloneElement(
        React.Children.toArray(props.children)[0] as React.ReactElement<{
          className: string;
        }>,
        {
          ...overlayProps,
          className: dialogOverlay({
            className: baseClassName || props.className,
          }),
        },
      )
    : state.isOpen && (
        <Reanimated.View entering={FadeIn} exiting={FadeOut}>
          <TouchableWithoutFeedback {...overlayProps}>
            <View
              {...props}
              className={dialogOverlay({
                className: baseClassName || props.className,
              })}
            />
          </TouchableWithoutFeedback>
        </Reanimated.View>
      );
}

/**
 * The dialog content component. This component is used to render the main content of the dialog.
 * @param param0 - Props to configure the behavior of the dialog content. @see DialogContentComponentProps
 * @returns Returns a `View` which contains the dialog content and a close button.
 */
export function DialogContent({
  children,
  asChild = false,
  forceMount,
  borderRadius,
  baseClassName,
  ...props
}: DialogContentComponentProps) {
  const {state} = useContext(DialogContext);
  const contextProps = useDialogContent({...props, state, forceMount});
  const {colorScheme} = useContext(ThemeContext);

  const {base, closeButton} = dialogContent({borderRadius});

  const renderProps = {
    ...contextProps.componentProps,
    ...props,
    style:
      Platform.OS !== "web"
        ? {
            top: Dimensions.get("window").height / 4,
          }
        : {},
    className: base({className: baseClassName || props.className}),
  };

  return (
    <DialogContentContext.Provider value={contextProps}>
      {state.isOpen &&
        (asChild ? (
          React.cloneElement(
            React.Children.toArray(children)[0] as React.ReactElement<{
              className: string;
            }>,
            renderProps,
          )
        ) : (
          <View
            {...renderProps}
            className={base({className: baseClassName || props.className})}
          >
            <View>{children}</View>
            <DialogClose className={closeButton()}>
              <XIcon color={themes[colorScheme]["--foreground"]} />
              <Text className="sr-only">Close</Text>
            </DialogClose>
          </View>
        ))}
    </DialogContentContext.Provider>
  );
}

/**
 * The dialog close component. This component is used to close the dialog.
 * @param param0 - Props to configure the behavior of the dialog close button. @see DialogCloseComponentProps
 * @returns Returns a `Pressable` which is used to close the dialog.
 */
export function DialogClose({
  children,
  asChild = false,
  baseClassName,
  ...props
}: DialogCloseComponentProps) {
  const {closeButtonProps} = useContext(DialogContentContext);

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      {
        ...(closeButtonProps as ComponentProps<typeof Pressable>),
        ...props,
        className: baseClassName || props.className,
      },
    )
  ) : (
    <Pressable
      {...(closeButtonProps as ComponentProps<typeof Pressable>)}
      {...props}
      className={baseClassName || props.className}
    >
      {children}
    </Pressable>
  );
}

/**
 * The dialog header component. This component is used to render the header section of the dialog.
 * @param param0 - Props to configure the behavior of the dialog header. @see DialogHeaderComponentProps
 * @returns Returns a `View` which contains the dialog header content.
 */
export function DialogHeader({
  children,
  baseClassName,
  ...props
}: DialogHeaderComponentProps) {
  return (
    <View
      {...props}
      className={dialogHeader({className: baseClassName || props.className})}
    >
      {children}
    </View>
  );
}

/**
 * The dialog title component. This component is used to render the title of the dialog.
 * @param param0 - Props to configure the behavior of the dialog title. @see DialogTitleComponentProps
 * @returns Returns a `Text` component which contains the dialog title.
 */
export function DialogTitle({
  children,
  asChild = false,
  baseClassName,
  ...props
}: DialogTitleComponentProps) {
  const {titleProps} = useContext(DialogContentContext);

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      {
        ...(titleProps as ComponentProps<typeof Text>),
        className: dialogTitle({className: baseClassName || props.className}),
      },
    )
  ) : (
    <Text
      {...(titleProps as ComponentProps<typeof Text>)}
      {...props}
      className={dialogTitle({className: baseClassName || props.className})}
    >
      {children}
    </Text>
  );
}

/**
 * The dialog footer component. This component is used to render the footer section of the dialog.
 * @param param0 - Props to configure the behavior of the dialog footer. @see DialogFooterComponentProps
 * @returns Returns a `View` which contains the dialog footer content.
 */
export function DialogFooter({
  children,
  baseClassName,
  ...props
}: DialogFooterComponentProps) {
  return (
    <View
      {...props}
      className={dialogFooter({className: baseClassName || props.className})}
    >
      {children}
    </View>
  );
}

/**
 * The dialog description component. This component is used to render the description of the dialog.
 * @param param0 - Props to configure the behavior of the dialog description. @see DialogDescriptionComponentProps
 * @returns Returns a `Text` component which contains the dialog description.
 */
export function DialogDescription({
  children,
  asChild = false,
  baseClassName,
  ...props
}: DialogDescriptionComponentProps) {
  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      {
        className: dialogDescription({
          className: baseClassName || props.className,
        }),
      },
    )
  ) : (
    <Text
      {...props}
      className={dialogDescription({
        className: baseClassName || props.className,
      })}
    >
      {children}
    </Text>
  );
}
