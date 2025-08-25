import {useButton} from "@react-aria/button";
import {useDisclosure as useAccordionAria} from "@react-aria/disclosure";
import {useFocusRing} from "@react-aria/focus";
import {ChevronDownIcon} from "lucide-react-native";
import React, {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import Reanimated, {
  AnimatedProps,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {tv} from "tailwind-variants";
import {ThemeContext, themes} from "../theme";

/**
 * Base props for the root `Accordion` component, context, and hook.
 * @param type - The type of accordion to render. Single only allows one item to be expanded at a time, multiple allows any number of items to be expanded at a time.
 * @param value - Controlled value for the accordion (which items are expanded).
 * @param defaultValue - Uncontrolled default value for the accordion (which items are expanded).
 * @param onValueChange - Callback function called when the accordion value changes.
 * @param collapsible - Whether an accordion item can be collapsed manually. Use on the top level `Accordion` component.
 * @param disabled - Whether all accordion items are disabled. Available on the top level `Accordion` component and on the `AccordionItem` component.
 * @param borderRadius - Sets the border radius of the accordion.
 * @param loading - Whether all accordion items are loading. Available on the top level `Accordion` component and on the `AccordionItem` component.
 * @param compact - Whether the accordion is in compact mode.
 * @param variant - The variant of the accordion.
 */
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

/**
 * Return type for the `useAccordion` hook.
 * @param state - The state of the accordion.
 * @param componentProps - Accessibility props to pass to the accordion component.
 */
export type AccordionReturn = {
  state: {
    /**
     * Expanded value of the accordion.
     */
    expandedValue: string | string[] | null;
    /**
     * Function to set the expanded value of the accordion.
     */
    setExpandedValue: (value: string | string[] | null) => void;
  };
  componentProps: React.ComponentProps<typeof View>;
};

/**
 * Props for the `Accordion` component.
 * @param asChild - If true clones the child and passes all accesibility and functionality props to it. Avalible on any exported component.
 * @param baseClassName - Custom tailwind classes to apply to the base accordion component. Takes priority over the `className` prop.
 */
export type AccordionComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & AccordionProps &
  ComponentProps<typeof View>;

/**
 * Context value for the `Accordion` component.
 * @param props - Props from the top-level Accordion component.
 */
export type AccordionContextValue = {
  props: AccordionProps;
} & AccordionReturn;

/**
 * Base props for the `AccordionItem` component, context, and hook.
 * @param value - The value of the accordion item (think of this as an id).
 * @param loading - Whether the accordion item is loading. This can override the loading state of the top-level Accordion component.
 * @param disabled - Whether the accordion item is disabled. This can override the disabled state of the top-level Accordion component.
 * @param props - Props from the top-level Accordion component. **You probably don't need to pass this!**
 * @see AccordionProps
 */
export type AccordionItemProps = {
  value: string;
  loading?: boolean;
  disabled?: boolean;
  props: AccordionProps;
} & AccordionReturn;

/**
 * Return type for the `useAccordionItem` hook.
 * @param componentProps - Accessibility props to pass to the accordion item component.
 * @param state - The state of the accordion item.
 * @param triggerProps - Props to pass to the accordion trigger component.
 * @param contentProps - Props to pass to the accordion content component.
 */
export type AccordionItemReturn = {
  componentProps: React.ComponentProps<typeof View> | HTMLDivElement;
  state: {
    /**
     * Whether the accordion item is expanded.
     */
    isExpanded: boolean;
    /**
     * Whether the accordion item is disabled.
     */
    isDisabled: boolean;
    /**
     * Whether the accordion item is controlled.
     */
    isControlled: boolean;
    /**
     * Whether the accordion item is focused.
     */
    isFocusVisible: boolean;
  };
  triggerProps: React.ComponentProps<typeof Pressable> | HTMLButtonElement;
  contentProps: React.ComponentProps<typeof View> | HTMLDivElement;
};

/**
 * Props for the `AccordionItem` component.
 * @param asChild - If true clones the child and passes all accesibility and functionality props to it. Avalible on any exported component.
 * @param startContent - Start content (ReactNode) to display in accordion triggers.
 * @param baseClassName - Custom tailwind classes to apply to the base accordion item component. Takes priority over the `className` prop.
 * @see AccordionItemProps
 */
export type AccordionItemComponentProps = {
  children: React.ReactNode;
  value: string;
  asChild?: boolean;
  startContent?: React.ReactNode;
  baseClassName?: string;
} & Partial<AccordionItemProps> &
  ComponentProps<typeof View>;

/**
 * Context value for the `AccordionItem` component.
 * @param props - Props from the top-level Accordion component.
 * @see AccordionItemReturn
 * @see AccordionItemProps
 */
export type AccordionItemContextValue = AccordionItemReturn & {
  props: AccordionProps;
};

/**
 * Props for the `AccordionTrigger` component.
 * @param asChild - If true clones the child and passes all accesibility and functionality props to it. Avalible on any exported component.
 * @param startContent - Start content (ReactNode) to display in accordion triggers.
 * @param reanimatedProps - Props to pass to the reanimated view.
 * @param indicator - Function that allows you to return a custom indicator ReactNode: (isExpanded: boolean) => React.ReactNode.
 * @param baseClassName - Custom tailwind classes to apply to the base accordion trigger component. Takes priority over the `className` prop.
 * @param indicatorIconClassName - Custom tailwind classes to apply to the indicator icon.
 * @param contentClassName - Custom tailwind classes to apply to the accordion content.
 */
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

/**
 * Props for the `AccordionContent` component.
 * @param asChild - If true clones the child and passes all accesibility and functionality props to it. Avalible on any exported component.
 * @param reanimatedProps - Props to pass to the reanimated view.
 * @param baseClassName - Custom tailwind classes to apply to the base accordion content component. Takes priority over the `className` prop.
 * @param textClassName - Custom tailwind classes to apply to the content text.
 */
export type AccordionContentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  reanimatedProps?: AnimatedProps<typeof Reanimated.View>;
  baseClassName?: string;
  textClassName?: string;
} & React.ComponentProps<typeof Text>;

/**
 * The use accordion hook is the backbone of the accordion component.
 * @param param0 - Props to configure the behavior of the accordion. @see AccordionProps
 * @returns Returns both the state and the accessibility props to pass to the accordion component. @see AccordionReturn
 */
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

/**
 * The use accordion item hook is the backbone of the accordion item component.
 * @param param0 - Props to configure the behavior of the accordion item. This should be passed down from context. @see AccordionItemProps
 * @returns Returns state and accessibility props for both the trigger and content components. @see AccordionItemReturn
 */
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

/**
 * A context wrapper containing the global state of the accordion.
 * @see AccordionContextValue
 */
export const AccordionContext = createContext<AccordionContextValue | null>(
  null,
);

/**
 * A context wrapper containing the global state of the accordion item.
 * @see AccordionItemContextValue
 */
export const AccordionItemContext =
  createContext<AccordionItemContextValue | null>(null);

/**
 * Conditional classes for the root accordion component.
 * @see AccordionComponentProps
 */
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

/**
 * Conditional classes for the accordion item component.
 * @see AccordionItemComponentProps
 */
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

/**
 * Conditional classes for the accordion trigger component.
 * It includes the following slots:
 * - base: The base styles for the accordion trigger.
 * - content: The content styles for the accordion trigger.
 * - indicatorIcon: The indicator icon styles for the accordion trigger.
 * @see AccordionTriggerProps
 */
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

/**
 * Conditional classes for the accordion content component.
 * @see AccordionContentProps
 */
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

/**
 * The root accordion component. This should be supplied once per accordion group. It is required for all accordions.
 * @example
 * ```tsx
 * <Accordion>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Product Information</AccordionTrigger>
 *     <AccordionContent className="flex flex-col gap-4 text-balance">
 *       <Text>
 *         Our flagship product combines cutting-edge technology with sleek
 *         design. Built with premium materials, it offers unparalleled
 *         performance and reliability.
 *       </Text>
 *       <Text>
 *         Key features include advanced processing capabilities, and an
 *         intuitive user interface designed for both beginners and experts.
 *       </Text>
 *     </AccordionContent>
 *   </AccordionItem>
 *   <AccordionItem value="item-2">
 *     <AccordionTrigger>Shipping Details</AccordionTrigger>
 *     <AccordionContent className="flex flex-col gap-4 text-balance">
 *       <Text>
 *         We offer worldwide shipping through trusted courier partners.
 *         Standard delivery takes 3-5 business days, while express shipping
 *         ensures delivery within 1-2 business days.
 *       </Text>
 *       <Text>
 *         All orders are carefully packaged and fully insured. Track your
 *         shipment in real-time through our dedicated tracking portal.
 *       </Text>
 *     </AccordionContent>
 *   </AccordionItem>
 *   <AccordionItem value="item-3">
 *     <AccordionTrigger>Return Policy</AccordionTrigger>
 *     <AccordionContent className="flex flex-col gap-4 text-balance">
 *       <Text>
 *         We stand behind our products with a comprehensive 30-day return
 *         policy. If you're not completely satisfied, simply return the
 *         item in its original condition.
 *       </Text>
 *       <Text>
 *         Our hassle-free return process includes free return shipping and
 *         full refunds processed within 48 hours of receiving the returned
 *         item.
 *       </Text>
 *     </AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 * @param param0 - Props to configure the behavior of the accordion. @see AccordionComponentProps
 * @returns Returns a context wrapper containing the global state of the accordion. @see AccordionContextValue
 */
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

/**
 * The accordion item component. This does not render anything, it is primarily used to provide context to the accordion item and set the layout.
 * @param param0 - Props to configure the behavior of the accordion item. @see AccordionItemComponentProps
 * @returns Returns a context wrapper containing the global state of the accordion item. @see AccordionItemContextValue
 */
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

/**
 * The accordion trigger component. It also container an indicator with an option to render start content.
 * @param param0 - Props to configure the behavior of the accordion trigger. @see AccordionTriggerProps
 * @returns Returns a `Pressable` which is used to toggle the content. It also container an indicator with an option to render start content.
 */
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
        <ActivityIndicator color={themes[colorScheme]["--foreground"]} />
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
      <Text className={content({className: contentClassName})}>
        {startContent && <View>{startContent}</View>}
        <Text {...props}>{children}</Text>
      </Text>
      <Indicator />
    </Pressable>
  );
}

export function AccordionContent({
  children,
  asChild = false,
  reanimatedProps,
  baseClassName,
  textClassName,
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
        <Text {...props} className={text({className: textClassName})}>
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
