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

export type DrawerComponentProps = {
  children: ReactNode;
} & ComponentProps<typeof ActionSheet>;

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

export const drawerHeader = tv({
  base: "p-4 justify-center",
});

export const drawerFooter = tv({
  base: "mt-auto flex flex-col gap-2 p-4",
});

export const drawerTitle = tv({
  base: "text-lg text-foreground font-semibold leading-none tracking-tight",
});

export const drawerDescription = tv({
  base: "text-sm text-muted-foreground",
});

export const DrawerContext = createContext<DrawerReturn>({
  state: {
    expand: () => {},
    collapse: () => {},
  },
  componentProps: {},
} as unknown as DrawerReturn);

export function Drawer({children}: DrawerComponentProps) {
  const {state, componentProps} = useDrawer();
  return (
    <DrawerContext.Provider value={{state, componentProps}}>
      {children}
    </DrawerContext.Provider>
  );
}

export type DrawerTriggerProps = {
  disabled?: boolean;
  asChild?: boolean;
} & Omit<AriaButtonProps, "isDisabled"> &
  Partial<{state: DrawerReturn["state"]}> &
  ComponentProps<typeof View>;

export type DrawerTriggerReturn = {
  componentProps: ComponentProps<typeof View> | HTMLButtonElement;
};

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

export type DrawerTriggerComponentProps = ComponentProps<typeof Pressable> &
  DrawerTriggerProps;

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

export type DrawerContentComponentProps = {
  children: ReactNode;
  baseClassName?: string;
  handleClassName?: string;
  onClose?: () => void;
  snapPoints?: number[];
  initialSnapIndex?: number;
} & ComponentProps<typeof View>;

export const DrawerContentContext = createContext<{onClose?: () => void}>({});

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

export type DrawerCloseProps = {
  children?: ReactNode;
  disabled?: boolean;
  asChild?: boolean;
} & ComponentProps<typeof Pressable>;

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

export type DrawerHeaderComponentProps = {
  children: ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof View>;

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

export type DrawerFooterComponentProps = {
  children: ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof View>;

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

export type DrawerTitleComponentProps = {
  children: ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

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

export type DrawerDescriptionComponentProps = {
  children: ReactNode;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

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
