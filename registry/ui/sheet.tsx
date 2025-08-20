import React, {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AriaDialogProps as AriaSheetProps,
  useDialog as useSheetAria,
} from "@react-aria/dialog";
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
import Reanimated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
} from "react-native-reanimated";

/**
 * Base props for the root `Sheet` component, context, and hook.
 * @param defaultOpen - Uncontrolled default open state of the sheet.
 * @param open - Controlled open state of the sheet.
 * @param onOpenChange - Callback function called when the sheet open state changes.
 * @param forceMount - Whether to force mount the sheet content even when closed.
 */
export type SheetProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  forceMount?: boolean;
};

/**
 * Return type for the `useSheet` hook.
 * @param state - The state of the sheet.
 * @param overlayProps - Props to pass to the sheet overlay component.
 */
export type SheetReturn = {
  state: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
  };
  overlayProps: ComponentProps<typeof TouchableWithoutFeedback>;
};

/**
 * Base props for the `SheetContent` component, context, and hook.
 * @param modal - Whether the sheet is modal (prevents interaction with elements outside the sheet).
 * @param onOpenAutoFocus - Callback function called when the sheet opens and auto-focus is triggered.
 * @param onCloseAutoFocus - Callback function called when the sheet closes and auto-focus is triggered.
 * @param onEscapeKeyDown - Callback function called when the Escape key is pressed.
 * @param onPointerDownOutside - Callback function called when a pointer event occurs outside the sheet.
 * @param onInteractOutside - Callback function called when an interaction occurs outside the sheet.
 * @param forceMount - Whether to force mount the sheet content even when closed.
 * @see SheetReturn
 * @see AriaSheetProps
 * @see ComponentProps
 */
export type SheetContentProps = {
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
} & Partial<SheetReturn> &
  AriaSheetProps &
  ComponentProps<typeof View>;

/**
 * Return type for the `useSheetContent` hook.
 * @param componentProps - Accessibility props to pass to the sheet content component.
 * @param titleProps - Accessibility props to pass to the sheet title component.
 * @param closeButtonProps - Accessibility props to pass to the sheet close button component.
 */
export type SheetContentReturn = {
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
  titleProps: ComponentProps<typeof View> | HTMLDivElement;
  closeButtonProps: ComponentProps<typeof View> | HTMLDivElement;
};

/**
 * Base props for the `SheetTrigger` component, context, and hook.
 * @param disabled - Whether the sheet trigger is disabled.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @see AriaButtonProps
 * @see SheetReturn
 * @see ComponentProps
 */
export type SheetTriggerProps = {
  disabled?: boolean;
  asChild?: boolean;
} & Omit<AriaButtonProps, "isDisabled"> &
  Partial<SheetReturn> &
  ComponentProps<typeof View>;

/**
 * Return type for the `useSheetTrigger` hook.
 * @param componentProps - Accessibility props to pass to the sheet trigger component.
 */
export type SheetTriggerReturn = {
  componentProps: ComponentProps<typeof View> | HTMLButtonElement;
};

/**
 * Props for the `Sheet` component.
 * @param children - The content to render inside the sheet.
 * @param modal - Whether the sheet is modal (prevents interaction with elements outside the sheet).
 * @see SheetProps
 */
export type SheetComponentProps = {
  children: React.ReactNode;
  modal?: boolean;
} & SheetProps;

/**
 * Props for the `SheetContent` component.
 * @param children - The content to render inside the sheet content.
 * @param borderRadius - Sets the border radius of the sheet content.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param className - Custom tailwind classes to apply to the sheet content component.
 * @param baseClassName - Custom tailwind classes to apply to the base sheet content component. Takes priority over the `className` prop.
 * @see SheetContentProps
 */
export type SheetContentComponentProps = {
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  asChild?: boolean;
  className?: string;
  baseClassName?: string;
} & SheetContentProps;

/**
 * Props for the `SheetDescription` component.
 * @param children - The content to render inside the sheet description.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base sheet description component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type SheetDescriptionComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

/**
 * Props for the `SheetTitle` component.
 * @param children - The content to render inside the sheet title.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base sheet title component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type SheetTitleComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

/**
 * Props for the `SheetHeader` component.
 * @param children - The content to render inside the sheet header.
 * @param baseClassName - Custom tailwind classes to apply to the base sheet header component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type SheetHeaderComponentProps = {
  children: React.ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * Props for the `SheetFooter` component.
 * @param children - The content to render inside the sheet footer.
 * @param baseClassName - Custom tailwind classes to apply to the base sheet footer component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type SheetFooterComponentProps = {
  children: React.ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * Props for the `SheetClose` component.
 * @param children - The content to render inside the sheet close button.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base sheet close component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type SheetCloseComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Pressable>;

/**
 * Props for the `SheetPortal` component.
 * @param children - The content to render inside the sheet portal.
 * @see ComponentProps
 */
export type SheetPortalComponentProps = {
  children: React.ReactNode;
} & ComponentProps<typeof View>;

/**
 * Props for the `SheetOverlay` component.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base sheet overlay component. Takes priority over the `className` prop.
 * @see ComponentProps
 */
export type SheetOverlayComponentProps = {
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * The use sheet hook is the backbone of the sheet component.
 * @param param0 - Props to configure the behavior of the sheet. @see SheetProps
 * @returns Returns both the state and the accessibility props to pass to the sheet component. @see SheetReturn
 */
export const useSheet = ({
  defaultOpen,
  open,
  forceMount,
  onOpenChange,
}: SheetProps): SheetReturn => {
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

/**
 * The use sheet trigger hook is the backbone of the sheet trigger component.
 * @param param0 - Props to configure the behavior of the sheet trigger. @see SheetTriggerProps
 * @returns Returns accessibility props to pass to the sheet trigger component. @see SheetTriggerReturn
 */
export const useSheetTrigger = ({
  state,
  disabled,
  ...props
}: SheetTriggerProps): SheetTriggerReturn => {
  if (!state) {
    throw new Error("useSheetTrigger must be used within a Sheet");
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

/**
 * The use sheet content hook is the backbone of the sheet content component.
 * @param param0 - Props to configure the behavior of the sheet content. @see SheetContentProps
 * @returns Returns accessibility props for the sheet content, title, and close button components. @see SheetContentReturn
 */
export const useSheetContent = ({
  modal,
  state,
  forceMount,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  ...props
}: SheetContentProps): SheetContentReturn => {
  const sheetRef = useRef<View | HTMLDivElement>(null);
  const sheetAria = useSheetAria({...props}, sheetRef);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const {buttonProps} = useButton(props, buttonRef);
  const {focusProps} = useFocusRing();

  if (!state) {
    throw new Error("useSheetContent must be used within a Sheet");
  }

  return {
    componentProps: {
      ...(Platform.OS === "web" ? sheetAria.dialogProps : {}),
      ref: sheetRef,
      accessibile: true,
      focusable: true,
      onFocus: (e) => {
        onOpenAutoFocus?.(e);
        onInteractOutside?.(e);
      },
      onBlur: (e) => {
        onCloseAutoFocus?.(e);
      },
      accessibilityRole: "sheet",
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
      ...(Platform.OS === "web" ? sheetAria.titleProps : {}),
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

/**
 * A context wrapper containing the global state of the sheet.
 * @see SheetReturn
 * @see SheetComponentProps
 */
export const SheetContext = createContext<
  SheetReturn & {props: Partial<SheetComponentProps>}
>({
  state: {
    isOpen: false,
    setIsOpen: () => {},
  },
  overlayProps: {},
  props: {},
});

/**
 * The root sheet component. This should be supplied once per sheet group. It is required for all sheets.
 * @example
 * ```tsx
 * <Sheet>
 *   <SheetTrigger>Open Sheet</SheetTrigger>
 *   <SheetContent>
 *     <SheetHeader>
 *       <SheetTitle>Edit Profile</SheetTitle>
 *       <SheetDescription>
 *         Make changes to your profile here. Click save when you're done.
 *       </SheetDescription>
 *     </SheetHeader>
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
 *     <SheetFooter>
 *       <SheetClose>Save changes</SheetClose>
 *     </SheetFooter>
 *   </SheetContent>
 * </Sheet>
 * ```
 * @param param0 - Props to configure the behavior of the sheet. @see SheetComponentProps
 * @returns Returns a context wrapper containing the global state of the sheet.
 */
export function Sheet({
  children,
  forceMount,
  defaultOpen,
  open,
  ...props
}: SheetComponentProps) {
  const hookProps = useSheet({...props, forceMount, defaultOpen, open});
  return (
    <SheetContext.Provider value={{...hookProps, props}}>
      {children}
    </SheetContext.Provider>
  );
}

/**
 * The sheet trigger component. This component is used to open the sheet.
 * @param param0 - Props to configure the behavior of the sheet trigger. @see SheetTriggerProps
 * @returns Returns a `Pressable` which is used to open the sheet.
 */
export function SheetTrigger({
  children,
  asChild = false,
  ...props
}: SheetTriggerProps) {
  const state = useContext(SheetContext);
  const {componentProps} = useSheetTrigger({...state, ...props});

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
 * A context wrapper containing the global state of the sheet content.
 * @see SheetContentReturn
 */
export const SheetContentContext = createContext<SheetContentReturn>({
  componentProps: {},
  titleProps: {},
  closeButtonProps: {},
});

/**
 * The sheet portal component. The portal is not used in this library as there is no body element in React Native, it is only here for compatibility with the Radix UI and Shadcn UI and can be removed if not used.
 * @param param0 - Props to configure the behavior of the sheet portal. @see SheetPortalComponentProps
 * @returns Returns a `View` which wraps the sheet content.
 */
export function SheetPortal({children, ...props}: SheetPortalComponentProps) {
  return <View {...props}>{children}</View>;
}

/**
 * Conditional classes for the sheet overlay component.
 * @see SheetOverlayComponentProps
 */
export const sheetOverlay = tv({
  base: "fixed inset-0 z-50 bg-black opacity-80",
});

/**
 * The sheet overlay component. This component is used to render the backdrop of the sheet.
 * @param param0 - Props to configure the behavior of the sheet overlay. @see SheetOverlayComponentProps
 * @returns Returns a `TouchableWithoutFeedback` which is used to close the sheet when clicked outside.
 */
export function SheetOverlay({
  asChild = false,
  baseClassName,
  ...props
}: SheetOverlayComponentProps) {
  const {state, overlayProps, props: sheetProps} = useContext(SheetContext);

  if (sheetProps.modal === false) {
    return;
  }

  return asChild
    ? React.cloneElement(
        React.Children.toArray(props.children)[0] as React.ReactElement<{
          className: string;
        }>,
        {
          ...overlayProps,
          className: sheetOverlay({
            className: baseClassName || props.className,
          }),
        },
      )
    : state.isOpen && (
        <Reanimated.View entering={FadeIn} exiting={FadeOut}>
          <TouchableWithoutFeedback {...overlayProps}>
            <View
              {...props}
              className={sheetOverlay({
                className: baseClassName || props.className,
              })}
            />
          </TouchableWithoutFeedback>
        </Reanimated.View>
      );
}

/**
 * Conditional classes for the sheet content component.
 * It includes the following slots:
 * - base: The base styles for the sheet content.
 * - closeButton: The close button styles for the sheet content.
 * @see SheetContentComponentProps
 */
export const sheetContent = tv({
  slots: {
    base: "fixed z-50 w-full gap-4 border border-border bg-background p-6 shadow-lg",
    closeButton:
      "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
  },
  variants: {
    side: {
      top: {base: "inset-x-0 top-0 border border-b w-full max-h-lg"},
      bottom: {base: "inset-x-0 bottom-0 border border-t w-full max-h-lg"},
      left: {base: "inset-y-0 left-0 border border-r h-full max-w-lg"},
      right: {base: "inset-y-0 right-0 border border-l h-full max-w-lg"},
    },
  },
  defaultVariants: {
    side: "right",
  },
});

/**
 * The sheet content component. This component is used to render the main content of the sheet.
 * @param param0 - Props to configure the behavior of the sheet content. @see SheetContentComponentProps
 * @returns Returns a `View` which contains the sheet content and a close button.
 */
export function SheetContent({
  children,
  asChild = false,
  side,
  forceMount,
  baseClassName,
  ...props
}: SheetContentComponentProps) {
  const {state} = useContext(SheetContext);
  const contextProps = useSheetContent({...props, state, forceMount});

  const {base, closeButton} = sheetContent({side});

  let entering;
  switch (side) {
    case "top":
      entering = SlideInUp;
      break;
    case "bottom":
      entering = SlideInDown;
      break;
    case "left":
      entering = SlideInLeft;
      break;
    case "right":
    default:
      entering = SlideInRight;
      break;
  }

  let exiting;
  switch (side) {
    case "top":
      exiting = SlideOutUp;
      break;
    case "bottom":
      exiting = SlideOutDown;
      break;
    case "left":
      exiting = SlideOutLeft;
      break;
    case "right":
    default:
      exiting = SlideOutRight;
      break;
  }

  return (
    <SheetContentContext.Provider value={contextProps}>
      <Reanimated.View entering={entering} exiting={exiting}>
        {state.isOpen &&
          (asChild ? (
            React.cloneElement(
              React.Children.toArray(children)[0] as React.ReactElement<{
                className: string;
                ref: React.RefObject<View | null>;
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
              <SheetClose className={closeButton()}>
                <XIcon />
                <Text className="sr-only">Close</Text>
              </SheetClose>
            </View>
          ))}
      </Reanimated.View>
    </SheetContentContext.Provider>
  );
}

/**
 * The sheet close component. This component is used to close the sheet.
 * @param param0 - Props to configure the behavior of the sheet close button. @see SheetCloseComponentProps
 * @returns Returns a `Pressable` which is used to close the sheet.
 */
export function SheetClose({
  children,
  asChild = false,
  baseClassName,
  ...props
}: SheetCloseComponentProps) {
  const {closeButtonProps} = useContext(SheetContentContext);

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
 * Conditional classes for the sheet header component.
 * @see SheetHeaderComponentProps
 */
export const sheetHeader = tv({
  base: "flex justify-center sm:justify-start w-full",
});

/**
 * The sheet header component. This component is used to render the header section of the sheet.
 * @param param0 - Props to configure the behavior of the sheet header. @see SheetHeaderComponentProps
 * @returns Returns a `View` which contains the sheet header content.
 */
export function SheetHeader({
  children,
  baseClassName,
  ...props
}: SheetHeaderComponentProps) {
  return (
    <View
      {...props}
      className={sheetHeader({className: baseClassName || props.className})}
    >
      {children}
    </View>
  );
}

/**
 * Conditional classes for the sheet title component.
 * @see SheetTitleComponentProps
 */
export const sheetTitle = tv({
  base: "text-lg font-semibold leading-none tracking-tight text-foreground",
});

/**
 * The sheet title component. This component is used to render the title of the sheet.
 * @param param0 - Props to configure the behavior of the sheet title. @see SheetTitleComponentProps
 * @returns Returns a `Text` component which contains the sheet title.
 */
export function SheetTitle({
  children,
  asChild = false,
  baseClassName,
  ...props
}: SheetTitleComponentProps) {
  const {titleProps} = useContext(SheetContentContext);

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      {
        ...(titleProps as ComponentProps<typeof Text>),
        className: sheetTitle({className: baseClassName || props.className}),
      },
    )
  ) : (
    <Text
      {...(titleProps as ComponentProps<typeof Text>)}
      {...props}
      className={sheetTitle({className: baseClassName || props.className})}
    >
      {children}
    </Text>
  );
}

/**
 * Conditional classes for the sheet footer component.
 * @see SheetFooterComponentProps
 */
export const sheetFooter = tv({
  base: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
});

/**
 * The sheet footer component. This component is used to render the footer section of the sheet.
 * @param param0 - Props to configure the behavior of the sheet footer. @see SheetFooterComponentProps
 * @returns Returns a `View` which contains the sheet footer content.
 */
export function SheetFooter({
  children,
  baseClassName,
  ...props
}: SheetFooterComponentProps) {
  return (
    <View
      {...props}
      className={sheetFooter({className: baseClassName || props.className})}
    >
      {children}
    </View>
  );
}

/**
 * Conditional classes for the sheet description component.
 * @see SheetDescriptionComponentProps
 */
export const sheetDescription = tv({
  base: "text-sm text-muted-foreground",
});

/**
 * The sheet description component. This component is used to render the description of the sheet.
 * @param param0 - Props to configure the behavior of the sheet description. @see SheetDescriptionComponentProps
 * @returns Returns a `Text` component which contains the sheet description.
 */
export function SheetDescription({
  children,
  asChild = false,
  baseClassName,
  ...props
}: SheetDescriptionComponentProps) {
  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      {
        className: sheetDescription({
          className: baseClassName || props.className,
        }),
      },
    )
  ) : (
    <Text
      {...props}
      className={sheetDescription({
        className: baseClassName || props.className,
      })}
    >
      {children}
    </Text>
  );
}
