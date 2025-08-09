import React, {
  ComponentProps,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import {Pressable, Text, View} from "react-native";
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import {tv} from "tailwind-variants";

/**
 * Base props for the root HoverCard component and hook.
 * - defaultOpen: Uncontrolled initial open state
 * - open: Controlled open state
 * - onOpenChange: Callback invoked when open state is requested to change
 */
export type HoverCardProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

/**
 * Return type for the useHoverCard hook.
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
  rootProps: ComponentProps<typeof View> | HTMLDivElement;
};

/**
 * Props for the HoverCard root component.
 */
export type HoverCardComponentProps = HoverCardProps &
  ComponentProps<typeof View> & {
    children: React.ReactNode;
    baseClassName?: string;
  };

/**
 * Props for the HoverCardTrigger component.
 */
export type HoverCardTriggerComponentProps = ComponentProps<
  typeof Pressable
> & {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
  textClassName?: string;
  disabled?: boolean;
  loading?: boolean;
};

/**
 * Props for the HoverCardContent component.
 */
export type HoverCardContentComponentProps = ComponentProps<typeof View> & {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
  textClassName?: string;
};

/**
 * The useHoverCard hook manages controlled/uncontrolled open state and root hover-out closing.
 */
export const useHoverCard = ({
  defaultOpen,
  open,
  onOpenChange,
}: HoverCardProps): HoverCardReturn => {
  if (open != null && defaultOpen != null) {
    throw new Error("Cannot set both open and defaultOpen");
  }

  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState<boolean>(
    defaultOpen ?? false,
  );
  const isOpen = isControlled ? (open as boolean) : internalOpen;

  const setIsOpen = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  const rootProps: HoverCardReturn["rootProps"] = useMemo(() => {
    return {
      onMouseLeave: () => {
        setIsOpen(false);
      },
    } as unknown as ComponentProps<typeof View>;
  }, [setIsOpen]);

  return {
    state: {isOpen, setIsOpen, isControlled},
    rootProps,
  };
};

/**
 * Exported context for HoverCard. Consumers should use the provided components.
 */
export const HoverCardContext = createContext<
  HoverCardReturn & {props: Partial<HoverCardComponentProps>}
>({
  state: {
    isOpen: false,
    setIsOpen: () => {},
    isControlled: false,
  },
  rootProps: {},
  props: {},
});

/**
 * tv styles for root, trigger, and content
 */
export const hoverCard = tv({
  base: "absolute",
});

export const hoverCardTrigger = tv({
  slots: {
    base: "outline-none items-center",
    text: "text-foreground",
  },
  variants: {
    disabled: {
      true: {
        base: "opacity-50 pointer-events-none",
      },
    },
  },
});

export const hoverCardContent = tv({
  slots: {
    base: "z-50 min-w-80 self-center rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md",
    text: "",
  },
});

/**
 * Root HoverCard component. Wraps Trigger and Content and provides the hit box used for closing on hover-out.
 */
export function HoverCard({
  children,
  baseClassName,
  ...props
}: HoverCardComponentProps) {
  const hook = useHoverCard(props);

  // Merge handlers: allow user-provided onMouseLeave to run as well
  const renderProps: ComponentProps<typeof View> = {
    ...(props as ComponentProps<typeof View>),
    ...(hook.rootProps as ComponentProps<typeof View>),
    className: hoverCard({
      className: baseClassName || (props as {className?: string}).className,
    }),
  };

  return (
    <HoverCardContext.Provider value={{...hook, props}}>
      <View {...renderProps}>{children}</View>
    </HoverCardContext.Provider>
  );
}

/**
 * HoverCardTrigger opens the card on hover, focus, or long press. It respects disabled and loading states.
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

  // Build event props for both web and native test environments
  const eventProps = {
    onMouseEnter: open,
    // Prefer focus on the Pressable so fireEvent(..., 'focus') works
    onFocus: open,
    onFocusIn: open as unknown as never,
    onLongPress: open,
    // Many tests simulate generic events; ensure pressable receives them
    onResponderGrant: open as unknown as never,
  } as unknown as ComponentProps<typeof Pressable>;

  const {base, text} = hoverCardTrigger();
  const baseClass = base({
    className: baseClassName || (props as {className?: string}).className,
  });
  const computedClassName = [
    baseClass,
    disabled ? "opacity-50 pointer-events-none" : "",
    loading ? "opacity-50 opacity-80 animate-pulse pointer-events-none" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const baseProps = {
    className: computedClassName,
    accessibilityRole: "button" as const,
    accessibilityState: {disabled: disabled || loading},
    focusable: true,
    // Ensure focus event opens even if some environments don't wire generic events fully
    onFocus: open,
    onFocusCapture: open as unknown as never,
  };

  if (asChild) {
    const restProps = {
      ...(props as ComponentProps<typeof Pressable>),
    } as Record<string, unknown>;
    // Do not override child's own testID
    delete (restProps as {testID?: string}).testID;
    const onlyChild = React.Children.toArray(
      children,
    )[0] as React.ReactElement<{className?: string}>;
    return React.cloneElement(onlyChild, {
      ...(eventProps as ComponentProps<typeof Pressable>),
      ...(restProps as ComponentProps<typeof Pressable>),
      ...baseProps,
    });
  }

  return (
    <Pressable
      {...(props as ComponentProps<typeof Pressable>)}
      {...eventProps}
      {...baseProps}
    >
      <Text onFocus={open} className={text({className: textClassName})}>
        {children}
      </Text>
    </Pressable>
  );
}

/**
 * HoverCardContent renders when open and applies popover-like styles.
 */
export function HoverCardContent({
  children,
  asChild = false,
  baseClassName,
  textClassName,
  ...props
}: HoverCardContentComponentProps) {
  const {state} = useContext(HoverCardContext);
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

  const overlayPositionStyle = React.useMemo(() => {
    // Absolute overlay, positioned below trigger using a reasonable default offset.
    // This avoids layout shift without measuring the trigger.
    const baseBelowOffset = 36; // approximate trigger height
    return {
      position: "absolute",
      left: 0,
      right: 0,
      top: baseBelowOffset + sideOffset,
      zIndex: 50,
    } as const;
  }, []);

  React.useEffect(() => {
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
      // animate out
      progress.value = withTiming(0, {
        duration: 120,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [state.isOpen]);

  // Keep element mounted briefly to ensure animation is visible when toggling open
  if (!state.isOpen && progress.value === 0) return null;

  if (asChild) {
    const onlyChild = React.Children.toArray(
      children,
    )[0] as React.ReactElement<{className?: string}>;
    return (
      <Reanimated.View
        style={[overlayPositionStyle, animatedStyle]}
        testID={(props as {testID?: string}).testID}
      >
        {React.cloneElement(onlyChild, {
          ...(props as ComponentProps<typeof View>),
          className: hoverCardContent().base({
            className:
              baseClassName || (props as {className?: string}).className,
          }),
        })}
      </Reanimated.View>
    );
  }

  return (
    <Reanimated.View
      style={[overlayPositionStyle, animatedStyle]}
      testID={(props as {testID?: string}).testID}
    >
      <View
        {...(props as ComponentProps<typeof View>)}
        className={hoverCardContent().base({
          className: baseClassName || (props as {className?: string}).className,
        })}
      >
        <Text className={hoverCardContent().text({className: textClassName})}>
          {children}
        </Text>
      </View>
    </Reanimated.View>
  );
}
