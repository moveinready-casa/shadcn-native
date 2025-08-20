import React, {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {Platform, Pressable, Text, View} from "react-native";
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import {tv} from "tailwind-variants";
import {AriaButtonProps, useButton} from "@react-aria/button";
import {useFocusRing} from "@react-aria/focus";

/**
 * Base props for the root `HoverCard` component, context, and hook.
 *
 * @param defaultOpen - Uncontrolled initial open state for the hover card.
 * @param open - Controlled open state for the hover card.
 * @param onOpenChange - Callback invoked when the open state is requested to change.
 */
export type HoverCardProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

/**
 * Return type for the `useHoverCard` hook.
 *
 * @param state - State bag containing the open state and helpers.
 * @param componentProps - Props to spread on the root hit box (the HoverCard container).
 */
export type HoverCardReturn = {
  state: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isControlled: boolean;
  };
  /**
   * Event props to spread on the root hit box (the HoverCard container).
   * Used to close the card when hover leaves the entire area.
   */
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
};

/**
 * Props for the `HoverCard` root component.
 *
 * @param children - Trigger and content elements. Typically composed of `HoverCardTrigger` and `HoverCardContent`.
 * @param baseClassName - Custom Tailwind classes to apply to the root hover card container. Takes priority over `className`.
 */
export type HoverCardComponentProps = HoverCardProps &
  ComponentProps<typeof View> & {
    children: React.ReactNode;
    baseClassName?: string;
  };

/**
 * Props for the `HoverCardTrigger` component.
 *
 * @param children - Content rendered inside the trigger.
 * @param asChild - If true, clones the only child and injects trigger props into it.
 * @param baseClassName - Custom Tailwind classes to apply to the trigger root. Takes priority over `className`.
 * @param textClassName - Custom Tailwind classes to apply to the trigger text.
 * @param disabled - Disables the trigger interactions.
 * @param loading - Marks the trigger as loading and disables interactions.
 */
export type HoverCardTriggerComponentProps = Omit<
  AriaButtonProps,
  "isDisabled"
> &
  ComponentProps<typeof Pressable> & {
    children: React.ReactNode;
    asChild?: boolean;
    baseClassName?: string;
    textClassName?: string;
    disabled?: boolean;
    loading?: boolean;
  };

/**
 * Props for the `HoverCardContent` component.
 *
 * @param children - Content rendered inside the hover card popover.
 * @param asChild - If true, clones the only child and injects content props into it.
 * @param baseClassName - Custom Tailwind classes to apply to the content container. Takes priority over `className`.
 * @param textClassName - Custom Tailwind classes to apply to the inner text.
 */
export type HoverCardContentComponentProps = ComponentProps<typeof View> & {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
  textClassName?: string;
};

/**
 * Props for the `useHoverCardTrigger` hook.
 *
 * @param disabled - Disables the trigger interactions.
 * @param loading - Marks the trigger as loading and disables interactions.
 * @param state - The hover card state bag returned by `useHoverCard`.
 */
export type HoverCardTriggerProps = Omit<AriaButtonProps, "isDisabled"> & {
  disabled?: boolean;
  loading?: boolean;
  state: HoverCardReturn["state"];
};

/**
 * Return type for the `useHoverCardTrigger` hook.
 *
 * @param componentProps - Props to spread on the trigger element.
 */
export type HoverCardTriggerReturn = {
  componentProps: ComponentProps<typeof Pressable> | HTMLButtonElement;
};

/**
 * Props for the `useHoverCardContent` hook.
 *
 * @param state - The hover card state bag returned by `useHoverCard`.
 */
export type HoverCardContentProps = {
  state: HoverCardReturn["state"];
};

/**
 * Return type for the `useHoverCardContent` hook.
 *
 * @param componentProps - Animated props and styles to spread on the content container.
 */
export type HoverCardContentReturn = {
  componentProps: ComponentProps<typeof Reanimated.View>;
};

/**
 * The `useHoverCard` hook manages controlled/uncontrolled open state and root hover-out closing.
 *
 * @param param0 - Configuration for controlled/uncontrolled state management.
 * @returns State management and component props for the root container.
 * @see HoverCardProps
 */
export const useHoverCard = ({
  defaultOpen,
  open,
  onOpenChange,
}: HoverCardProps): HoverCardReturn => {
  if (open != null && defaultOpen != null) {
    throw new Error("Cannot set both open and defaultOpen");
  }

  const isControlled = open != null;
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isOpen = isControlled ? open : internalOpen;

  const setIsOpen = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  return {
    state: {isOpen, setIsOpen, isControlled},
    componentProps: {
      onMouseLeave: () => {
        setIsOpen(false);
      },
    },
  };
};

/**
 * Hook that composes web a11y props for the `HoverCardTrigger`.
 *
 * @param param0 - Trigger configuration including disabled/loading states and hover card state.
 * @returns Props to spread on the trigger element.
 * @see HoverCardTriggerProps
 */
export function useHoverCardTrigger({
  disabled,
  loading,
  state,
  ...props
}: HoverCardTriggerProps): HoverCardTriggerReturn {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const ariaProps: AriaButtonProps = {
    ...props,
    isDisabled: disabled || loading,
  };
  const {buttonProps} = useButton(ariaProps, ref);
  const {focusProps} = useFocusRing();

  const componentProps = {
    ...(Platform.OS === "web" ? {...buttonProps, ...focusProps} : {}),
    onMouseEnter: () => {
      state.setIsOpen(true);
    },
    accessibilityRole: "button",
    accessibilityState: {disabled: disabled || loading},
    focusable: true,
    onFocus: () => {
      state.setIsOpen(true);
    },
    onFocusCapture: () => {
      state.setIsOpen(true);
    },
  };

  return {componentProps};
}

/**
 * Hook that composes animation and positioning logic for the `HoverCardContent`.
 *
 * @param param0 - Content configuration including hover card state.
 * @returns Props to spread on the content element with animation styles.
 * @see HoverCardContentProps
 */
export function useHoverCardContent({
  state,
}: HoverCardContentProps): HoverCardContentReturn {
  const progress = useSharedValue(0);

  const sideOffset = 8;
  const start = {x: 0, y: -sideOffset};

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        {scale: 0.95 + 0.05 * progress.value},
        {translateX: start.x * (1 - progress.value)},
        {translateY: start.y * (1 - progress.value)},
      ],
    };
  });

  const baseBelowOffset = 36;
  const overlayPositionStyle = {
    position: "absolute" as const,
    left: 0,
    right: 0,
    top: baseBelowOffset + sideOffset,
    zIndex: 50,
  };

  useEffect(() => {
    if (state.isOpen) {
      progress.value = 0;
      progress.value = withDelay(
        100,
        withTiming(1, {
          duration: 150,
          easing: Easing.out(Easing.cubic),
        }),
      );
    } else {
      progress.value = withTiming(0, {
        duration: 120,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [state.isOpen]);

  return {
    componentProps: {
      style: [overlayPositionStyle, animatedStyle],
    },
  };
}

/**
 * Exported context for `HoverCard`. Consumers should use the provided components.
 * Provides state management and component props to child components.
 * @see HoverCardComponentProps
 */
export const HoverCardContext = createContext<
  HoverCardReturn & {props: Partial<HoverCardComponentProps>}
>({
  state: {
    isOpen: false,
    setIsOpen: () => {},
    isControlled: false,
  },
  componentProps: {},
  props: {},
});

/**
 * Conditional classes for the root hover card container.
 */
export const hoverCard = tv({
  base: "absolute",
});

/**
 * Conditional classes for the hover card trigger element.
 * Includes variant support for `disabled` and `loading` states.
 */
export const hoverCardTrigger = tv({
  slots: {
    base: "outline-none items-center focus:ring-2 focus:ring-ring",
    text: "text-foreground",
  },
  variants: {
    disabled: {
      true: {
        base: "opacity-50 pointer-events-none",
      },
    },
    loading: {
      true: {
        base: "opacity-80 animate-pulse pointer-events-none",
      },
    },
  },
});

/**
 * Conditional classes for the hover card content container.
 * Applies popover-like styling with proper z-index and positioning.
 */
export const hoverCardContent = tv({
  slots: {
    base: "z-50 min-w-80 self-center rounded-md border border-border bg-popover p-4 shadow-md",
    text: "text-popover-foreground ",
  },
});

/**
 * Root `HoverCard` component. Wraps `HoverCardTrigger` and `HoverCardContent` and provides the hit box used for closing on hover-out.
 *
 * @param param0 - Root configuration and children components.
 * @returns The hover card container with context provider.
 * @see HoverCardComponentProps
 */
export function HoverCard({
  children,
  baseClassName,
  ...props
}: HoverCardComponentProps) {
  const hook = useHoverCard(props);

  const renderProps: ComponentProps<typeof View> = {
    ...(props as ComponentProps<typeof View>),
    ...(hook.componentProps as ComponentProps<typeof View>),
    className: hoverCard({
      className: baseClassName || props.className,
    }),
  };

  return (
    <HoverCardContext.Provider value={{...hook, props}}>
      <View {...renderProps}>{children}</View>
    </HoverCardContext.Provider>
  );
}

/**
 * `HoverCardTrigger` opens the card on hover, focus, or long press. It respects disabled and loading states.
 * If `asChild` is true, clones the first child and injects trigger props.
 *
 * @param param0 - Trigger children and configuration.
 * @returns The trigger element with proper accessibility and interaction props.
 * @see HoverCardTriggerComponentProps
 */
export function HoverCardTrigger({
  children,
  asChild = false,
  baseClassName,
  textClassName,
  disabled = false,
  loading = false,
  ...props
}: HoverCardTriggerComponentProps) {
  const {state} = useContext(HoverCardContext);

  const open = () => {
    if (disabled || loading) return;
    state.setIsOpen(true);
  };

  const {componentProps} = useHoverCardTrigger({
    ...props,
    disabled,
    loading,
    state,
  });

  const {base, text} = hoverCardTrigger({disabled, loading});
  const baseClass = base({
    className: baseClassName || props.className,
  });

  return asChild && React.isValidElement(children) ? (
    React.cloneElement(children as React.ReactElement<{className?: string}>, {
      ...componentProps,
      className: baseClass,
    })
  ) : (
    <Pressable {...props} {...componentProps} className={baseClass}>
      <Text onFocus={open} className={text({className: textClassName})}>
        {children}
      </Text>
    </Pressable>
  );
}

/**
 * `HoverCardContent` renders when open and applies popover-like styles.
 * If `asChild` is true, clones the first child and injects content props.
 *
 * @param param0 - Content children and configuration.
 * @returns The animated content container with proper styling.
 * @see HoverCardContentComponentProps
 */
export function HoverCardContent({
  children,
  asChild = false,
  baseClassName,
  textClassName,
  ...props
}: HoverCardContentComponentProps) {
  const {state} = useContext(HoverCardContext);
  const {componentProps} = useHoverCardContent({
    state,
  });
  const {text, base} = hoverCardContent();

  const renderProps = {
    ...componentProps,
    className: base({
      className: baseClassName || props.className,
    }),
    ...props,
  };

  if (!state.isOpen) return null;

  return asChild ? (
    (() => {
      const onlyChild = React.Children.toArray(
        children,
      )[0] as React.ReactElement<{className?: string}>;
      return (
        <Reanimated.View {...componentProps}>
          <View className={renderProps.className}>
            {React.cloneElement(onlyChild, renderProps)}
          </View>
        </Reanimated.View>
      );
    })()
  ) : (
    <Reanimated.View {...renderProps}>
      <View className={renderProps.className}>
        <Text className={text({className: textClassName})}>{children}</Text>
      </View>
    </Reanimated.View>
  );
}
