import React from "react";
import ActionSheet, {
  ActionSheetRef,
  SheetProvider,
} from "react-native-actions-sheet";
import {AriaButtonProps, useButton} from "@react-aria/button";
import {useFocusRing} from "@react-aria/focus";
import {
  ComponentProps,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  GestureResponderEvent,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  View,
  Text,
  useColorScheme,
} from "react-native";
import {tv} from "tailwind-variants";
import tw from "twrnc";
import Reanimated, {FadeIn, FadeOut} from "react-native-reanimated";
import Theme, {ThemeContext} from "../theme";
// export type DrawerContentComponentProps = {
//   children: ReactNode;
//   className?: string;
//   baseClassName?: string;
//   handleClassName?: string;
// } & ComponentProps<typeof ActionSheet>;

// export type DrawerReturn = {
//   state: {
//     isOpen: boolean;
//     setIsOpen: (open: boolean) => void;
//   };
// };

// export type DrawerTriggerProps = {
//   disabled?: boolean;
//   state?: DrawerReturn["state"];
// } & ComponentProps<typeof Pressable>;

// export type DrawerTriggerReturn = {
//   componentProps: ComponentProps<typeof Pressable>;
// };

// export type DrawerCloseProps = {
//   children?: ReactNode;
//   disabled?: boolean;
// } & ComponentProps<typeof Pressable>;

// export type DrawerCloseReturn = {
//   componentProps: ComponentProps<typeof Pressable>;
// };

// export type DrawerPortalComponentProps = {
//   baseClassName?: string;
// } & ComponentProps<typeof View>;

// export type DrawerOverlayProps = {
//   forceMount?: boolean;
//   baseClassName?: string;
// } & Omit<ComponentProps<typeof TouchableWithoutFeedback>, "children">;

// export type DrawerOverlayReturn = {
//   componentProps: ComponentProps<typeof TouchableWithoutFeedback>;
// };

// export type DrawerHeaderComponentProps = {
//   baseClassName?: string;
// } & ComponentProps<typeof View>;

// export type DrawerFooterComponentProps = {
//   baseClassName?: string;
// } & ComponentProps<typeof View>;

// export type DrawerTitleComponentProps = {
//   baseClassName?: string;
// } & ComponentProps<typeof Text>;

// export type DrawerDescriptionComponentProps = {
//   baseClassName?: string;
// } & ComponentProps<typeof Text>;

export type DrawerReturn = {
  state: {
    expand: () => void;
    collapse: () => void;
  };
  componentProps: ComponentProps<typeof ActionSheet>;
};

/**
 * The core hook/state contract for the drawer component.
 * @property state - Public API to control the drawer programmatically.
 * @property state.expand - Expands/opens the drawer.
 * @property state.collapse - Collapses/closes the drawer.
 * @property componentProps - Props to spread on the underlying `ActionSheet` component.
 */
export const useDrawer = (): DrawerReturn => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  return {
    state: {
      expand: () => {
        actionSheetRef.current?.show();
      },
      collapse: () => {
        actionSheetRef.current?.hide();
      },
    },
    componentProps: {ref: actionSheetRef},
  };
};

/**
 * Props for the root `Drawer` component.
 * @param children - Content that will have access to the drawer context and controls.
 */
export type DrawerComponentProps = {
  children: ReactNode;
} & ComponentProps<typeof ActionSheet>;

/**
 * Conditional classes for the drawer content container (the sheet itself).
 * It includes variant support for light and dark color schemes.
 */
export const drawerContent = tv({
  base: "z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border min-h-[200px]",
  variants: {
    // Variable colors not supported at runtime, therefore they are hardcoded
    colorScheme: {
      light: "bg-[#ffffff] border-[#e5e5e5]",
      dark: "bg-[#0a0a0a] border-[#ffffff1a]",
    },
  },
});

/**
 * Conditional classes for the drawer header container.
 */
export const drawerHeader = tv({
  base: "p-4 justify-center",
});

/**
 * Conditional classes for the drawer footer container.
 */
export const drawerFooter = tv({
  base: "mt-auto flex flex-col gap-2 p-4",
});

/**
 * Conditional classes for the drawer title text.
 */
export const drawerTitle = tv({
  base: "text-lg text-foreground font-semibold leading-none tracking-tight",
});

/**
 * Conditional classes for the drawer description text.
 */
export const drawerDescription = tv({
  base: "text-sm text-muted-foreground",
});

/**
 * A context wrapper containing the global state and action-sheet props for the drawer.
 * @see DrawerReturn
 */
export const DrawerContext = createContext<DrawerReturn>({
  state: {
    expand: () => {},
    collapse: () => {},
  },
  componentProps: {},
} as unknown as DrawerReturn);

/**
 * The root drawer component. Provides state and handlers to children via context.
 * Typically used together with `DrawerTrigger` and `DrawerContent`.
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger>
 *     <Text>Open Drawer</Text>
 *   </DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Title</DrawerTitle>
 *       <DrawerDescription>Description</DrawerDescription>
 *     </DrawerHeader>
 *     <DrawerFooter>
 *       <DrawerClose>
 *         <Text>Close</Text>
 *       </DrawerClose>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 * @param param0 - Props for the root drawer. Children get access to the drawer controls.
 */
export function Drawer({children}: DrawerComponentProps) {
  const {state, componentProps} = useDrawer();
  return (
    <DrawerContext.Provider value={{state, componentProps}}>
      {children}
    </DrawerContext.Provider>
  );
}

/**
 * Props for the `useDrawerTrigger` hook and `DrawerTrigger` component.
 * @param disabled - Whether the trigger is disabled.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 * @param state - Optional drawer state; when using `DrawerTrigger` inside `Drawer`, this is injected from context.
 */
export type DrawerTriggerProps = {
  disabled?: boolean;
  asChild?: boolean;
} & Omit<AriaButtonProps, "isDisabled"> &
  Partial<{state: DrawerReturn["state"]}> &
  ComponentProps<typeof View>;

/**
 * Return type for `useDrawerTrigger`.
 * @property componentProps - Props to spread onto the trigger element (`Pressable` on native or `button` on web).
 */
export type DrawerTriggerReturn = {
  componentProps: ComponentProps<typeof View> | HTMLButtonElement;
};

/**
 * Hook that returns proper accessibility and interaction props for a drawer trigger.
 * @param param0 - Trigger configuration and optional drawer state.
 * @returns Props to spread on a pressable/button element that opens the drawer.
 */
export function useDrawerTrigger({
  state,
  disabled,
  ...props
}: DrawerTriggerProps): DrawerTriggerReturn {
  if (!state) {
    throw new Error("useDrawerTrigger must be used within a Drawer");
  }

  const ref = useRef<HTMLButtonElement>(null);
  const {buttonProps} = useButton({...props, isDisabled: disabled}, ref);

  return {
    componentProps: {
      ...(Platform.OS === "web" ? buttonProps : {}),
      accessibilityRole: "button",
      accessibilityState: {disabled: !!disabled},
      disabled,
      onPress: () => {
        if (disabled) return;
        state.expand();
      },
      ...props,
    },
  };
}

/**
 * Props for the `DrawerTrigger` component.
 */
export type DrawerTriggerComponentProps = ComponentProps<typeof Pressable> &
  DrawerTriggerProps;

/**
 * The trigger component that opens the drawer.
 * If `asChild` is true, clones the first child and injects trigger props.
 * @param param0 - Trigger children and configuration.
 */
export function DrawerTrigger({
  children,
  asChild = false,
  ...props
}: DrawerTriggerComponentProps) {
  const {state} = useContext(DrawerContext);
  const {componentProps} = useDrawerTrigger({state, ...props});

  return asChild ? (
    (React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      componentProps as ComponentProps<typeof Pressable>,
    ) as React.ReactElement)
  ) : (
    <Pressable {...(componentProps as ComponentProps<typeof Pressable>)}>
      {children}
    </Pressable>
  );
}

/**
 * Props for the `DrawerContent` component.
 * @param baseClassName - Custom tailwind classes to apply to the base container. Takes priority over `className`.
 * @param handleClassName - Custom classes for the action sheet handle.
 * @param onClose - Optional callback fired when `DrawerClose` is pressed.
 * @param snapPoints - Snap points to configure the sheet's height.
 * @param initialSnapIndex - The initial snap index for the sheet.
 */
export type DrawerContentComponentProps = {
  children: ReactNode;
  baseClassName?: string;
  handleClassName?: string;
  onClose?: () => void;
  snapPoints?: number[];
  initialSnapIndex?: number;
} & ComponentProps<typeof View>;

/**
 * Context for the content area of the drawer, providing optional `onClose` callback to nested components.
 */
export const DrawerContentContext = createContext<{onClose?: () => void}>({});

/**
 * The content container that renders the underlying `ActionSheet`.
 * Wraps children with theme and applies styling.
 * @param param0 - Content configuration and action sheet options.
 */
export function DrawerContent({
  children,
  baseClassName,
  handleClassName,
  onClose,
  snapPoints,
  initialSnapIndex,
  ...props
}: DrawerContentComponentProps) {
  const {componentProps} = useContext(DrawerContext);
  const {colorScheme} = useContext(ThemeContext);

  return (
    <DrawerContentContext.Provider value={{onClose}}>
      <ActionSheet
        {...componentProps}
        snapPoints={snapPoints}
        initialSnapIndex={initialSnapIndex}
        gestureEnabled
        {...props}
        containerStyle={tw.style(
          drawerContent({colorScheme: colorScheme || "light"}),
        )}
      >
        <Theme colorScheme={colorScheme || "light"}>
          <View>{children}</View>
        </Theme>
      </ActionSheet>
    </DrawerContentContext.Provider>
  );
}

/**
 * Props for the `DrawerClose` component.
 * @param disabled - Whether the close action is disabled.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it.
 */
export type DrawerCloseProps = {
  children?: ReactNode;
  disabled?: boolean;
  asChild?: boolean;
} & ComponentProps<typeof Pressable>;

/**
 * A button that collapses the drawer. If `asChild` is true, clones the first child and injects close props.
 * Invokes the optional `onClose` from `DrawerContentContext` before collapsing.
 * @param param0 - Close button children and configuration.
 */
export function DrawerClose({
  children,
  disabled,
  asChild = false,
  ...props
}: DrawerCloseProps) {
  const {state} = useContext(DrawerContext);
  const {onClose} = useContext(DrawerContentContext);

  const closeButtonProps = {
    accessibilityRole: "button" as const,
    accessibilityState: {disabled: !!disabled},
    disabled,
    onPress: () => {
      if (disabled) return;
      onClose?.();
      state.collapse();
    },
    ...props,
  };

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      closeButtonProps as ComponentProps<typeof Pressable>,
    )
  ) : (
    <Pressable {...closeButtonProps}>{children}</Pressable>
  );
}

/**
 * Props for the `DrawerHeader` component.
 */
export type DrawerHeaderComponentProps = {
  children: ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * The header container for the drawer content.
 * @param param0 - Header children and optional class overrides.
 */
export function DrawerHeader({
  children,
  baseClassName,
  ...props
}: DrawerHeaderComponentProps) {
  return (
    <View
      {...props}
      className={drawerHeader({className: baseClassName || props.className})}
    >
      {children}
    </View>
  );
}

/**
 * Props for the `DrawerFooter` component.
 */
export type DrawerFooterComponentProps = {
  children: ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * The footer container for the drawer content.
 * @param param0 - Footer children and optional class overrides.
 */
export function DrawerFooter({
  children,
  baseClassName,
  ...props
}: DrawerFooterComponentProps) {
  return (
    <View
      {...props}
      className={drawerFooter({className: baseClassName || props.className})}
    >
      {children}
    </View>
  );
}

/**
 * Props for the `DrawerTitle` component.
 */
export type DrawerTitleComponentProps = {
  children: ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

/**
 * The title text for the drawer content.
 * @param param0 - Title children and optional class overrides.
 */
export function DrawerTitle({
  children,
  baseClassName,
  ...props
}: DrawerTitleComponentProps) {
  return (
    <Text
      {...props}
      className={drawerTitle({className: baseClassName || props.className})}
    >
      {children}
    </Text>
  );
}

/**
 * Props for the `DrawerDescription` component.
 */
export type DrawerDescriptionComponentProps = {
  children: ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

/**
 * The description text for the drawer content.
 * @param param0 - Description children and optional class overrides.
 */
export function DrawerDescription({
  children,
  baseClassName,
  ...props
}: DrawerDescriptionComponentProps) {
  return (
    <Text
      {...props}
      className={drawerDescription({
        className: baseClassName || props.className,
      })}
    >
      {children}
    </Text>
  );
}
