import React, {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  View,
  Platform,
  Text,
  LayoutChangeEvent,
  ActivityIndicator,
} from "react-native";
import {useDisclosure as useAccordionAria} from "@react-aria/disclosure";
import {useButton} from "@react-aria/button";
import {useFocusRing} from "@react-aria/focus";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  AnimatedProps,
  ReduceMotion,
} from "react-native-reanimated";
import {ChevronDownIcon} from "lucide-react-native";
import {tv} from "tailwind-variants";
import {themes, ThemeContext} from "../theme";

export type AccordionProps = {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[] | null) => void;
  collapsible?: boolean;
  disabled?: boolean;
  /* Additional props */
  borderRadius?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  compact?: boolean;
  variant?: "shadcn" | "shadow" | "bordered" | "splitted";
};

export type AccordionReturn = {
  state: {
    expandedValue: string | string[] | null;
    setExpandedValue: (value: string | string[] | null) => void;
  };
  componentProps: React.ComponentProps<typeof View>;
};

export type AccordionContextValue = {
  props: AccordionProps;
} & AccordionReturn;

export type AccordionItemProps = {
  value: string;
  loading?: boolean;
  disabled?: boolean;
  props: AccordionProps;
} & AccordionReturn;

export type AccordionComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & AccordionProps &
  ComponentProps<typeof View>;

export type AccordionItemReturn = {
  componentProps: React.ComponentProps<typeof View> | HTMLDivElement;
  state: {
    isExpanded: boolean;
    isDisabled: boolean;
    isControlled: boolean;
    isFocusVisible: boolean;
  };
  triggerProps: React.ComponentProps<typeof Pressable> | HTMLButtonElement;
  contentProps: React.ComponentProps<typeof View> | HTMLDivElement;
};

export type AccordionItemComponentProps = {
  children: React.ReactNode;
  value: string;
  asChild?: boolean;
  startContent?: React.ReactNode;
  baseClassName?: string;
} & Partial<AccordionItemProps> &
  ComponentProps<typeof View>;

export type AccordionItemContextValue = AccordionItemReturn & {
  props: AccordionProps;
};

export type AccordionTriggerProps = {
  children: React.ReactNode;
  asChild?: boolean;
  startContent?: React.ReactNode;
  reanimatedProps?: AnimatedProps<typeof Reanimated.View>;
  indicator?: (isExpanded: boolean) => React.ReactNode;
  baseClassName?: string;
  indicatorIconClassName?: string;
  contentClassName?: string;
} & React.ComponentProps<typeof Text>;

export type AccordionContentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  reanimatedProps?: AnimatedProps<typeof Reanimated.View>;
  baseClassName?: string;
} & React.ComponentProps<typeof Text>;

export const useAccordion = ({
  type = "single",
  value,
  defaultValue,
  onValueChange,
  collapsible = true,
  disabled,
}: AccordionProps): AccordionReturn => {
  if (
    type === "single" &&
    (Array.isArray(value) || Array.isArray(defaultValue))
  ) {
    throw new Error("Value must be a string when type is single");
  }

  if (collapsible == null && type !== "single") {
    throw new Error("Collapsible is only supported for single type");
  }

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | string[] | null>(
    defaultValue ?? (type === "multiple" ? [] : null),
  );

  const expandedValue = isControlled ? value : internalValue;

  const setExpandedValue = (newValue: string | string[] | null) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return {
    state: {
      expandedValue,
      setExpandedValue: disabled ? () => {} : setExpandedValue,
    },
    componentProps: {
      accessibilityRole: type === "multiple" ? "list" : undefined,
    },
  };
};

export const useAccordionItem = ({
  value,
  disabled,
  state,
  props,
}: AccordionItemProps): AccordionItemReturn => {
  const {expandedValue, setExpandedValue} = state;
  const {type, collapsible, loading} = props;
  const isMultiple = type === "multiple";

  const controlled = () => {
    if (isMultiple && Array.isArray(props.value)) {
      return true;
    } else if (!isMultiple && props.value !== undefined) {
      return true;
    }
    return false;
  };
  const isControlled = controlled();

  const isDisabled =
    disabled ?? (props.disabled == null ? false : props.disabled);

  const isExpanded = isMultiple
    ? Array.isArray(expandedValue) && expandedValue.includes(value)
    : expandedValue === value;

  const handlePress = () => {
    if (isDisabled) return;
    if (isMultiple) {
      const newValues = Array.isArray(expandedValue)
        ? expandedValue.includes(value)
          ? expandedValue.filter((v) => v !== value)
          : [...expandedValue, value]
        : [value];
      setExpandedValue(newValues);
    } else {
      setExpandedValue(isExpanded && collapsible ? null : value);
    }
  };

  const updateIsExpanded = (shouldExpand: boolean) => {
    if (isControlled) {
      return;
    }
    if (isExpanded !== shouldExpand) {
      handlePress();
    }
  };

  const contentRef = useRef<View>(null);
  const triggerRef = useRef<View>(null);

  const {buttonProps: triggerProps, panelProps: contentProps} =
    useAccordionAria(
      {
        isDisabled: isControlled || loading || isDisabled,
        isExpanded,
      },
      {
        isExpanded,
        setExpanded: updateIsExpanded,
        expand: () => updateIsExpanded(true),
        collapse: () => updateIsExpanded(false),
        toggle: () => handlePress(),
      },
      contentRef,
    );

  const {buttonProps} = useButton(triggerProps, triggerRef);
  const {isFocusVisible, focusProps} = useFocusRing();

  return {
    componentProps: {
      "data-state": isExpanded ? "open" : "closed",
    },
    state: {
      isExpanded,
      isDisabled: isDisabled,
      isControlled: isControlled,
      isFocusVisible,
    },
    triggerProps: {
      ...(Platform.OS === "web" ? {...buttonProps, ...focusProps} : {}),
      onPress: handlePress,
      accessibilityRole: "button",
      accessibilityState: {isExpanded},
      accessibilityHint: isExpanded
        ? "Collapse the content"
        : "Expands the content",
    },
    contentProps: {
      ...(Platform.OS === "web" ? {...contentProps} : {}),
      accessible: true,
      accessibilityElementsHidden: !isExpanded,
      accessibilityLiveRegion: "polite",
    },
  };
};

export const AccordionContext = createContext<AccordionContextValue | null>(
  null,
);

export const accordion = tv({
  slots: {
    base: "p-2",
  },
  variants: {
    variant: {
      shadcn: {},
      shadow: {
        base: "bg-background shadow-sm",
      },
      bordered: {
        base: "border border-border",
      },
      splitted: {},
    },
    borderRadius: {
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
  },
  defaultVariants: {
    variant: "shadcn",
  },
});

export function Accordion({
  children,
  asChild = false,
  type = "single",
  value,
  defaultValue,
  onValueChange,
  collapsible,
  disabled = false,
  loading = false,
  compact,
  variant = "shadcn",
  borderRadius = "md",
  baseClassName,
  ...props
}: AccordionComponentProps) {
  const AccordionProps = useAccordion({
    type,
    value,
    defaultValue,
    onValueChange,
    collapsible,
    disabled,
    loading,
  });

  const {base} = accordion();
  const renderProps = {
    ...AccordionProps.componentProps,
    ...props,
    className: base({
      variant,
      borderRadius,
      className: baseClassName || props.className,
    }),
  };

  const contextValue = {
    ...AccordionProps,
    props: {
      type,
      collapsible,
      loading,
      borderRadius,
      compact,
      variant,
    },
  };

  return (
    <AccordionContext.Provider value={contextValue}>
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
        <View {...renderProps}>{children}</View>
      )}
    </AccordionContext.Provider>
  );
}

export const AccordionItemContext =
  createContext<AccordionItemContextValue | null>(null);

export const accordionItem = tv({
  slots: {
    base: "border-border border-b last:border-b-0",
  },
  variants: {
    compact: {
      true: {},
    },
    variant: {
      shadcn: {},
      shadow: {},
      bordered: {},
      splitted: {
        base: "bg-background rounded border-none m-2 p-1",
      },
    },
    loading: {
      true: {
        base: "animate-pulse opacity-50",
      },
    },
    borderRadius: {
      sm: {},
      md: {},
      lg: {},
      xl: {},
    },
  },
  compoundVariants: [
    {
      variant: "splitted",
      compact: true,
      className: "m-1",
    },
    {
      variant: "splitted",
      borderRadius: "sm",
      className: {
        base: "rounded-sm",
      },
    },
    {
      variant: "splitted",
      borderRadius: "md",
      className: {
        base: "rounded-md",
      },
    },
    {
      variant: "splitted",
      borderRadius: "lg",
      className: {
        base: "rounded-lg",
      },
    },
    {
      variant: "splitted",
      borderRadius: "xl",
      className: {
        base: "rounded-xl",
      },
    },
  ],
  defaultVariants: {
    variant: "shadcn",
    compact: false,
    loading: false,
  },
});

export function AccordionItem({
  children,
  asChild = false,
  value,
  disabled,
  loading,
  state,
  props: itemProps,
  baseClassName,
  ...props
}: AccordionItemComponentProps) {
  const {base} = accordionItem();
  const accordionContext = useContext(AccordionContext);

  if (!accordionContext) {
    throw new Error("AccordionItem must be used within an Accordion");
  }

  const mergedAccordionProps: AccordionProps = {
    ...accordionContext.props,
    ...itemProps,
  };

  const itemReturn = useAccordionItem({
    ...accordionContext,
    value,
    disabled,
    loading,
    state: {
      ...accordionContext.state,
      ...(state ?? {}),
    },
    props: mergedAccordionProps,
  });

  const itemState: AccordionItemContextValue = {
    ...itemReturn,
    props: mergedAccordionProps,
  };

  const renderProps = {
    ...itemState,
    className: base({
      variant: itemState.props.variant,
      className: baseClassName || props.className,
    }),
  };

  return (
    <AccordionItemContext.Provider value={itemState}>
      {asChild ? (
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              ...renderProps,
              className: renderProps.className,
            });
          }
          return child;
        })
      ) : (
        <View {...renderProps}>{children}</View>
      )}
    </AccordionItemContext.Provider>
  );
}

export const accordionTrigger = tv({
  slots: {
    base: "flex flex-row items-center justify-between rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline",
    content: "flex flex-row items-center gap-4 flex-1 text-foreground",
    indicatorIcon:
      "text-muted-foreground pointer-events-none size-4 shrink-0 flex justify-center items-center",
  },
  variants: {
    focused: {
      true: {
        base: "border border-ring",
      },
    },
    disabled: {
      true: {
        base: "pointer-events-none opacity-50",
      },
    },
    controlled: {
      true: {
        base: "pointer-events-none",
      },
    },
    compact: {
      true: {
        base: "py-2",
      },
    },
  },
});

export function AccordionTrigger({
  children,
  asChild = false,
  startContent,
  indicator,
  baseClassName,
  indicatorIconClassName,
  contentClassName,
  reanimatedProps,
  ...props
}: AccordionTriggerProps) {
  const {base, content, indicatorIcon} = accordionTrigger();
  const {colorScheme} = useContext(ThemeContext);
  const itemState = useContext(AccordionItemContext);
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(itemState?.state.isExpanded ? 180 : 0, {
      duration: 300,
      reduceMotion: ReduceMotion.System,
    });
  }, [itemState?.state.isExpanded]);

  const animatedIndicatorIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${rotation.value}deg`}],
    };
  });

  const Indicator = () => (
    <View className={indicatorIcon({className: indicatorIconClassName})}>
      {typeof indicator === "function" ? (
        indicator(itemState?.state.isExpanded ?? false)
      ) : itemState?.props.loading ? (
        <ActivityIndicator color={themes[colorScheme].foreground} />
      ) : (
        <Reanimated.View
          style={animatedIndicatorIconStyle}
          {...reanimatedProps}
        >
          <ChevronDownIcon />
        </Reanimated.View>
      )}
    </View>
  );

  const baseProps = {
    className: base({
      disabled: props.disabled || itemState?.state.isDisabled || false,
      focused: itemState?.state.isFocusVisible,
      controlled: itemState?.state.isControlled,
      compact: itemState?.props.compact,
      className: baseClassName || props.className,
    }),
  };

  return asChild ? (
    <View {...baseProps}>
      <View className={content({className: contentClassName})}>
        {React.cloneElement(
          React.Children.toArray(children)[0] as React.ReactElement<{
            className: string;
          }>,
          {
            ...itemState?.triggerProps,
            ...props,
          },
        )}
      </View>
      <Indicator />
    </View>
  ) : (
    <Pressable {...itemState?.triggerProps} {...baseProps}>
      <Text className={content()}>
        {startContent && <View>{startContent}</View>}
        <Text {...props}>{children}</Text>
      </Text>
      <Indicator />
    </Pressable>
  );
}

export const accordionContent = tv({
  slots: {
    base: "overflow-hidden",
    text: "text-sm text-foreground",
  },
  variants: {
    compact: {
      true: {
        base: "py-1",
      },
    },
  },
});

export function AccordionContent({
  children,
  asChild = false,
  reanimatedProps,
  baseClassName,
  ...props
}: AccordionContentProps) {
  const {base, text} = accordionContent();

  const itemState = useContext(AccordionItemContext);
  const height = useSharedValue(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized && contentHeight > 0) {
      height.value = withTiming(
        itemState?.state.isExpanded ? contentHeight : 0,
        {duration: 300, reduceMotion: ReduceMotion.System},
      );
    }
  }, [itemState?.state.isExpanded, contentHeight, hasInitialized]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      overflow: "hidden",
    };
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const {height: measuredHeight} = event.nativeEvent.layout;
    if (measuredHeight > 0 && !hasInitialized) {
      setContentHeight(measuredHeight);
      setHasInitialized(true);
      // Set initial height based on expanded state
      height.value = itemState?.state.isExpanded ? measuredHeight : 0;
    }
  };

  const Content = () =>
    asChild ? (
      React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...itemState?.contentProps,
            className: base({compact: itemState?.props.compact}),
            ...props,
          });
        }
        return child;
      })
    ) : (
      <View {...itemState?.contentProps}>
        <Text {...props} className={text()}>
          {children}
        </Text>
      </View>
    );

  return (
    <>
      <View
        style={{position: "absolute", opacity: 0, zIndex: -1}}
        onLayout={handleLayout}
        className={base({
          compact: itemState?.props.compact,
          className: baseClassName || props.className,
        })}
      >
        <Content />
      </View>
      <Reanimated.View style={animatedStyle} {...reanimatedProps}>
        <Content />
      </Reanimated.View>
    </>
  );
}
