import React, {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {AriaDialogProps, useDialog as useDialogAria} from "@react-aria/dialog";
import {
  View,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  GestureResponderEvent,
} from "react-native";
import {AriaButtonProps, useButton} from "@react-aria/button";
import {useFocusRing} from "@react-aria/focus";
import {XIcon} from "lucide-react-native";
import {tv} from "tailwind-variants";
import Reanimated, {FadeIn, FadeOut} from "react-native-reanimated";

export type DialogProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  forceMount?: boolean;
};
export type DialogReturn = {
  state: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
  };
  overlayProps: ComponentProps<typeof TouchableWithoutFeedback>;
};

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
export type DialogContentReturn = {
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
  titleProps: ComponentProps<typeof View> | HTMLDivElement;
  closeButtonProps: ComponentProps<typeof View> | HTMLDivElement;
};

export type DialogTriggerProps = {
  disabled?: boolean;
} & Omit<AriaButtonProps, "isDisabled"> &
  Partial<DialogReturn> &
  ComponentProps<typeof View>;
export type DialogTriggerReturn = {
  componentProps: ComponentProps<typeof View> | HTMLButtonElement;
};

export type DialogComponentProps = {
  children: React.ReactNode;
  modal?: boolean;
} & DialogProps;

export type DialogContentComponentProps = {
  children: React.ReactNode;
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
  asChild?: boolean;
  className?: string;
  baseClassName?: string;
} & DialogContentProps;

export type DialogDescriptionComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

export type DialogTitleComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

export type DialogHeaderComponentProps = {
  children: React.ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof View>;

export type DialogFooterComponentProps = {
  children: React.ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof View>;

export type DialogCloseComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Pressable>;

export type DialogPortalComponentProps = {
  children: React.ReactNode;
} & ComponentProps<typeof View>;

export type DialogOverlayComponentProps = {
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof View>;

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
    },
    overlayProps: {
      onPress: () => {
        if (!forceMount) {
          setIsOpen(false);
        }
      },
    },
  };
};

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
        state.setIsOpen(true);
      },
      ...props,
    },
  };
};

export const useDialogContent = ({
  modal,
  state,
  forceMount,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  ...props
}: DialogContentProps): DialogContentReturn => {
  const dialogRef = useRef<View | HTMLDivElement>(null);
  const dialogAria = useDialogAria({...props}, dialogRef);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const {buttonProps} = useButton(props, buttonRef);
  const {focusProps} = useFocusRing();

  if (!state) {
    throw new Error("useDialogContent must be used within a Dialog");
  }

  return {
    componentProps: {
      ...(Platform.OS === "web" ? dialogAria.dialogProps : {}),
      ref: dialogRef,
      accessibile: true,
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
        if (forceMount) {
          return;
        }

        if (e.key === "Escape") {
          state.setIsOpen(false);
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
      onPress: () => {
        if (!forceMount) {
          state.setIsOpen(false);
        }
      },
    },
  };
};

export const DialogContext = createContext<
  DialogReturn & {props: Partial<DialogComponentProps>}
>({
  state: {
    isOpen: false,
    setIsOpen: () => {},
  },
  overlayProps: {},
  props: {},
});

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

export function DialogTrigger({children, ...props}: DialogTriggerProps) {
  const state = useContext(DialogContext);
  const {componentProps} = useDialogTrigger({...state, ...props});

  return (
    <Pressable {...(componentProps as ComponentProps<typeof Pressable>)}>
      {children}
    </Pressable>
  );
}

export const DialogContentContext = createContext<DialogContentReturn>({
  componentProps: {},
  titleProps: {},
  closeButtonProps: {},
});

// The portal is not used in this library as there is no body element in React Native, it is only here for compatibility with the Radix UI and Shadcn UI and can be removed if not used.
export function DialogPortal({children, ...props}: DialogPortalComponentProps) {
  return <View {...props}>{children}</View>;
}

export const dialogOverlay = tv({
  base: "fixed inset-0 z-50 bg-black opacity-80",
});

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

export const dialogContent = tv({
  slots: {
    base: "fixed left-[50%] top-[50%] z-50  w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg rounded-lg",
    closeButton:
      "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
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

  const {base, closeButton} = dialogContent({borderRadius});

  return (
    <DialogContentContext.Provider value={contextProps}>
      {state.isOpen &&
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
            <DialogClose className={closeButton()}>
              <XIcon />
              <Text className="sr-only">Close</Text>
            </DialogClose>
          </View>
        ))}
    </DialogContentContext.Provider>
  );
}

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

export const dialogHeader = tv({
  base: "flex justify-center sm:justify-start w-full",
});

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

export const dialogTitle = tv({
  base: "text-lg font-semibold leading-none tracking-tight text-foreground",
});

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

export const dialogFooter = tv({
  base: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
});

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

export const dialogDescription = tv({
  base: "text-sm text-muted-foreground",
});

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
