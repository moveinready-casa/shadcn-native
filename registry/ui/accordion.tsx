// TODO: Add themes
import React, {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {Pressable, View, Platform, Text, LayoutChangeEvent} from "react-native";
import {useDisclosure as useAccordionAria} from "@react-aria/disclosure";
import {useButton} from "@react-aria/button";
import {useFocusRing} from "@react-aria/focus";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  AnimatedProps,
} from "react-native-reanimated";
import {ChevronDownIcon} from "lucide-react-native";
import {tv} from "tailwind-variants";

export type AccordionState = {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[] | null) => void;
  collapsible?: boolean;
  disabled?: boolean;
  /*Additional props */
  compact?: boolean;
  variant?: "shadcn" | "shadow" | "bordered" | "splitted";
};

export type AccordionReturn = {
  state: {
    expandedValue: string | string[] | null;
    setExpandedValue: (value: string | string[] | null) => void;
  };
  props: Omit<AccordionState, "onValueChange">;
  componentProps: React.ComponentProps<typeof View>;
};

export const useAccordion = ({
  type = "single",
  value,
  defaultValue,
  onValueChange,
  collapsible = true,
  disabled,
  compact,
  variant,
}: AccordionState): AccordionReturn => {
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
    props: {
      type,
      value,
      defaultValue,
      collapsible,
      disabled,
      compact,
      variant,
    },
    componentProps: {
      accessibilityRole: type === "multiple" ? "list" : undefined,
    },
  };
};

export type AccordionItemState = {
  value: string;
  disabled?: boolean;
} & AccordionReturn;

export type AccordionItemReturn = {
  componentProps: React.ComponentProps<typeof View> | HTMLDivElement;
  props: AccordionReturn["props"];
  state: {
    isExpanded: boolean;
    isDisabled: boolean;
    isControlled: boolean;

    isFocusVisible: boolean;
  };
  triggerProps: React.ComponentProps<typeof Pressable> | HTMLButtonElement;
  contentProps: React.ComponentProps<typeof View> | HTMLDivElement;
};

export const useAccordionItem = ({
  value,
  disabled,
  state,
  props,
}: AccordionItemState): AccordionItemReturn => {
  const {expandedValue, setExpandedValue} = state;
  const {type, collapsible, compact, variant} = props;
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
        isDisabled: isControlled || isDisabled,
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
    props: {
      type,
      collapsible,
      compact,
      variant,
    },
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

export const AccordionContext = createContext<AccordionReturn | null>(null);

export type AccordionProps = {
  children: React.ReactNode;
  asChild?: boolean;
} & AccordionState &
  ComponentProps<typeof View>;

export const accordion = tv({
  slots: {
    root: "p-2 rounded",
  },
  variants: {
    variant: {
      shadcn: {},
      shadow: {
        root: "bg-slate-100 shadow-sm",
      },
      bordered: {
        root: "border",
      },
      splitted: {},
    },
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
  compact,
  variant,
  ...props
}: AccordionProps) {
  const accordionState = useAccordion({
    type,
    value,
    defaultValue,
    onValueChange,
    collapsible,
    disabled,
    compact,
    variant,
  });

  const {root} = accordion();

  return (
    <AccordionContext.Provider value={accordionState}>
      {asChild ? (
        React.cloneElement(
          React.Children.toArray(children)[0] as React.ReactElement<unknown>,
          {
            ...accordionState.componentProps,
            className: root({variant}),
            ...props,
          },
        )
      ) : (
        <View
          {...accordionState.componentProps}
          {...props}
          className={root({variant})}
        >
          {children}
        </View>
      )}
    </AccordionContext.Provider>
  );
}

export const AccordionItemContext = createContext<AccordionItemReturn | null>(
  null,
);

export type AccordionItemProps = {
  children: React.ReactNode;
  value: string;
  asChild?: boolean;
  startContent?: React.ReactNode;
} & Partial<AccordionItemState> &
  ComponentProps<typeof View>;

export const accordionItem = tv({
  slots: {
    root: "border-b last:border-b-0",
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
        root: "bg-slate-100 rounded border-none m-2 p-1",
      },
    },
  },
  compoundVariants: [
    {
      variant: "splitted",
      compact: true,
      className: "m-1",
    },
  ],
});

export function AccordionItem({
  children,
  asChild = false,
  value,
  disabled,
  state,
  props: itemProps,
  ...props
}: AccordionItemProps) {
  const {root} = accordionItem();
  const accordionState = useContext(AccordionContext);

  if (!accordionState) {
    throw new Error("AccordionItem must be used within an Accordion");
  }

  const itemState = useAccordionItem({
    ...accordionState,
    value,
    disabled,
    state: {...state, ...accordionState.state},
    props: {...itemProps, ...accordionState.props},
  });

  return (
    <AccordionItemContext.Provider value={itemState}>
      {asChild ? (
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              ...itemState.componentProps,
              ...props,
              className: root({
                variant: itemState.props.variant,
                className: props.className,
              }),
            });
          }
          return child;
        })
      ) : (
        <View
          {...itemState.componentProps}
          {...props}
          className={root({
            variant: itemState.props.variant,
            className: props.className,
          })}
        >
          {children}
        </View>
      )}
    </AccordionItemContext.Provider>
  );
}

export type AccordionTriggerProps = {
  children: React.ReactNode;
  asChild?: boolean;
  startContent?: React.ReactNode;
  reanimatedProps?: AnimatedProps<typeof Reanimated.View>;
  indicator?: (isExpanded: boolean) => React.ReactNode;
} & React.ComponentProps<typeof Text>;

export const accordionTrigger = tv({
  slots: {
    root: "flex flex-row items-center justify-between rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline",
    content: "flex flex-row items-center gap-4 flex-1",
    chevron: "text-muted-foreground pointer-events-none size-4 shrink-0",
  },
  variants: {
    focused: {
      true: {
        root: "border-ring ring-ring/50",
      },
    },
    disabled: {
      true: {
        root: "pointer-events-none opacity-50",
      },
    },
    controlled: {
      true: {
        root: "pointer-events-none",
      },
    },
    compact: {
      true: {
        root: "py-2",
      },
    },
  },
});

export function AccordionTrigger({
  children,
  asChild = false,
  startContent,
  indicator,
  reanimatedProps,
  ...props
}: AccordionTriggerProps) {
  const {root, content, chevron} = accordionTrigger();
  const itemState = useContext(AccordionItemContext);
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(itemState?.state.isExpanded ? 180 : 0, {
      duration: 300,
    });
  }, [itemState?.state.isExpanded]);

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${rotation.value}deg`}],
    };
  });

  return asChild ? (
    <View
      className={root({
        disabled: props.disabled || itemState?.state.isDisabled || false,
        focused: itemState?.state.isFocusVisible,
        controlled: itemState?.state.isControlled,
        compact: itemState?.props.compact,
      })}
    >
      <View className={content()}>
        {React.cloneElement(
          React.Children.toArray(children)[0] as React.ReactElement<unknown>,
          {
            ...itemState?.triggerProps,
            ...props,
          },
        )}
      </View>
      <View className={chevron()}>
        {typeof indicator === "function" ? (
          indicator(itemState?.state.isExpanded ?? false)
        ) : (
          <Reanimated.View style={animatedChevronStyle} {...reanimatedProps}>
            <ChevronDownIcon />
          </Reanimated.View>
        )}
      </View>
    </View>
  ) : (
    <Pressable
      {...itemState?.triggerProps}
      className={root({
        disabled: props.disabled || itemState?.state.isDisabled || false,
        focused: itemState?.state.isFocusVisible,
        controlled: itemState?.state.isControlled,
        compact: itemState?.props.compact,
      })}
    >
      <View className={content()}>
        {startContent && <View>{startContent}</View>}
        <Text {...props}>{children}</Text>
      </View>
      <View className={chevron()}>
        {typeof indicator === "function" ? (
          indicator(itemState?.state.isExpanded ?? false)
        ) : (
          <Reanimated.View style={animatedChevronStyle} {...reanimatedProps}>
            <ChevronDownIcon />
          </Reanimated.View>
        )}
      </View>
    </Pressable>
  );
}

export type AccordionContentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  reanimatedProps?: AnimatedProps<typeof Reanimated.View>;
} & React.ComponentProps<typeof Text>;

export const accordionContent = tv({
  slots: {
    root: "overflow-hidden",
    text: "text-sm",
  },
  variants: {
    compact: {
      true: {
        root: "py-1",
      },
    },
  },
});

export function AccordionContent({
  children,
  asChild = false,
  reanimatedProps,
  ...props
}: AccordionContentProps) {
  const {root, text} = accordionContent();

  const itemState = useContext(AccordionItemContext);
  const height = useSharedValue(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized && contentHeight > 0) {
      height.value = withTiming(
        itemState?.state.isExpanded ? contentHeight : 0,
        {duration: 300},
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

  const contentComponent = asChild ? (
    React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          ...itemState?.contentProps,
          className: root({compact: itemState?.props.compact}),
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
        className={root({compact: itemState?.props.compact})}
      >
        {contentComponent}
      </View>
      <Reanimated.View style={animatedStyle} {...reanimatedProps}>
        {contentComponent}
      </Reanimated.View>
    </>
  );
}
