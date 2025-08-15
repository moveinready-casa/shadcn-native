import React, {
  ComponentProps,
  createContext,
  useContext,
  useState,
} from "react";
import {Pressable, View, Platform} from "react-native";
import {tv} from "tailwind-variants";

/**
 * Tabs root props and context
 */
export type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  /** md should be the default */
  size?: "sm" | "md" | "lg";
  /** visual style variant for the whole tabs group */
  variant?: "shadcn" | "underlined" | "outlined" | "ghost";
  /** border radius applied to the list container */
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
} & ComponentProps<typeof View>;

export type TabsComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & TabsProps;

export type TabsReturn = {
  state: {
    /** currently selected tab value */
    selectedValue: string | null;
    setSelectedValue: (value: string) => void;
    isControlled: boolean;
  };
  props: Pick<TabsProps, "orientation" | "size" | "variant" | "borderRadius">;
};

/**
 * TabsList props and context
 */
export type TabsListProps = {
  /** disables interaction with all triggers */
  disabled?: boolean;
} & ComponentProps<typeof View> &
  Partial<TabsReturn>;

export type TabsListComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & TabsListProps;

export type TabsListReturn = {
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
  disabledAll: boolean;
};

/**
 * Trigger props
 */
export type TabsTriggerHookProps = {
  value: string;
  disabled?: boolean;
} & ComponentProps<typeof View> &
  Partial<TabsReturn> &
  Partial<TabsListReturn>;

export type TabsTriggerReturn = {
  componentProps: ComponentProps<typeof Pressable> | HTMLButtonElement;
  isActive: boolean;
};

export type TabsTriggerComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  /** start adornment */
  startContent?: React.ReactNode;
  /** end adornment */
  endContent?: React.ReactNode;
  /** color variants similar to Badge */
  color?: "default" | "secondary" | "destructive" | "outline";
  baseClassName?: string;
} & TabsTriggerHookProps;

/**
 * Content props
 */
export type TabsContentHookProps = {
  value: string;
} & ComponentProps<typeof View> &
  Partial<TabsReturn>;

export type TabsContentReturn = {
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
  isSelected: boolean;
};

export type TabsContentComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & TabsContentHookProps;

/**
 * useTabs: manage controlled/uncontrolled state
 */
export const useTabs = ({
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  size = "md",
  variant = "shadcn",
  borderRadius = "md",
}: TabsProps): TabsReturn => {
  if (value != null && defaultValue != null) {
    throw new Error("Cannot set both value and defaultValue");
  }

  const isControlled = value != null;
  const [internalValue, setInternalValue] = useState<string | null>(
    defaultValue ?? null,
  );

  const selectedValue = isControlled ? (value ?? null) : internalValue;

  const setSelectedValue = (next: string) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  };

  return {
    state: {selectedValue, setSelectedValue, isControlled},
    props: {orientation, size, variant, borderRadius},
  };
};

/**
 * useTabsList: accessibility and merged props
 */
export const useTabsList = ({
  disabled,
  ...rest
}: TabsListProps): TabsListReturn => {
  return {
    componentProps: {
      ...(Platform.OS === "web" ? {role: "tablist"} : {}),
      accessibilityRole: "tablist",
      ...rest,
    },
    disabledAll: !!disabled,
  };
};

/**
 * useTabsTrigger: a11y + onPress behavior
 */
export const useTabsTrigger = ({
  value,
  disabled,
  state,
  disabledAll,
  ...rest
}: TabsTriggerHookProps): TabsTriggerReturn => {
  if (!state) {
    throw new Error("useTabsTrigger must be used within Tabs");
  }

  const isActive = state.selectedValue === value;
  const isDisabled = !!disabled || !!disabledAll;

  const onPress = () => {
    if (isDisabled || isActive) return;
    state.setSelectedValue(value);
  };

  return {
    componentProps: {
      ...(Platform.OS === "web"
        ? {role: "tab", "aria-selected": isActive}
        : {}),
      accessibilityRole: "tab",
      accessibilityState: {selected: isActive, disabled: isDisabled},
      onPress,
      ...rest,
    },
    isActive,
  };
};

/**
 * useTabsContent: a11y + visibility state
 */
export const useTabsContent = ({
  value,
  state,
  ...rest
}: TabsContentHookProps): TabsContentReturn => {
  if (!state) {
    throw new Error("useTabsContent must be used within Tabs");
  }
  const isSelected = state.selectedValue === value;

  return {
    componentProps: {
      ...(Platform.OS === "web" ? {role: "tabpanel", hidden: !isSelected} : {}),
      accessibilityState: {selected: isSelected},
      ...rest,
    },
    isSelected,
  };
};

/**
 * Contexts
 */
export const TabsContext = createContext<TabsReturn | null>(null);
export const TabsListContext = createContext<TabsListReturn | null>(null);

/**
 * Styling
 */
export const tabsList = tv({
  base: "flex flex-row w-fit items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
  variants: {
    orientation: {
      horizontal: "",
      vertical: "flex-col",
    },
    size: {
      sm: "h-9",
      md: "h-10",
      lg: "h-11",
    },
    radius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
    },
    variant: {
      shadcn: "",
      underlined: "bg-transparent",
      outlined: "bg-transparent border border-border",
      ghost: "bg-transparent",
    },
  },
  compoundVariants: [
    {
      orientation: "vertical",
      size: "sm",
      className: "items-start min-w-9 h-fit",
    },
    {
      orientation: "vertical",
      size: "md",
      className: "items-start min-w-10 max-w-fit h-fit",
    },
    {
      orientation: "vertical",
      size: "lg",
      className: "items-start min-w-11 max-w-fit h-fit",
    },
  ],
});

export const tabsTrigger = tv({
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  variants: {
    active: {
      true: "bg-background text-foreground shadow-sm",
      false: "",
    },
    variant: {
      shadcn: "",
      underlined: "bg-transparent rounded-none shadow-none",
      outlined: "",
      ghost: "",
    },
    color: {
      default: "",
      secondary: "secondary",
      destructive: "destructive",
      outline: "outline",
    },
    borderRadius: {
      none: "rounded-none",
      sm: "rounded-xs",
      md: "rounded-sm",
      lg: "rounded-md",
      xl: "rounded-lg",
    },
  },
  compoundVariants: [
    {
      variant: "underlined",
      active: true,
      className: "border-b-2 border-border",
    },
  ],
});

export const tabsContent = tv({
  base: "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
});

/**
 * Components
 */
export function Tabs({children, baseClassName, ...props}: TabsComponentProps) {
  const hook = useTabs(props);

  const renderProps = {
    ...props,
    className: baseClassName || props.className,
  };

  return (
    <TabsContext.Provider value={hook}>
      <View {...renderProps}>{children}</View>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  asChild = false,
  disabled,
  baseClassName,
  ...props
}: TabsListComponentProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsList must be used within Tabs");
  }

  const listHook = useTabsList({...props, ...context, disabled});

  const className = tabsList({
    orientation: context.props.orientation,
    size: context.props.size,
    radius: context.props.borderRadius,
    variant: context.props.variant,
    className: baseClassName || props.className,
  });

  const renderProps = {
    ...(listHook.componentProps as ComponentProps<typeof View>),
    className,
  };

  const provided = {
    ...listHook,
  };

  return (
    <TabsListContext.Provider value={provided}>
      {asChild ? (
        React.cloneElement(
          React.Children.toArray(children)[0] as React.ReactElement<{
            className: string;
          }>,
          {
            ...renderProps,
          },
        )
      ) : (
        <View {...renderProps}>{children}</View>
      )}
    </TabsListContext.Provider>
  );
}

export function TabsTrigger({
  children,
  value,
  asChild = false,
  disabled,
  startContent,
  endContent,
  color = "default",
  baseClassName,
  ...props
}: TabsTriggerComponentProps) {
  const tabs = useContext(TabsContext);
  const list = useContext(TabsListContext);
  if (!tabs || !list) {
    throw new Error("TabsTrigger must be used within Tabs and TabsList");
  }

  const triggerHook = useTabsTrigger({
    ...props,
    ...tabs,
    ...list,
    value,
    disabled,
  });

  const className = tabsTrigger({
    active: triggerHook.isActive,
    variant: tabs.props.variant,
    borderRadius: tabs.props.borderRadius,
    color,
    className: baseClassName || props.className,
  });

  const renderProps = {
    ...(triggerHook.componentProps as ComponentProps<typeof Pressable>),
    className,
  };

  const Content = () => (
    <View className="flex flex-row items-center gap-2">
      {startContent ? <View>{startContent}</View> : null}
      <View>{children}</View>
      {endContent ? <View>{endContent}</View> : null}
    </View>
  );

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      {
        ...(renderProps as unknown as ComponentProps<typeof View>),
      },
    )
  ) : (
    <Pressable {...renderProps}>
      <Content />
    </Pressable>
  );
}

export function TabsContent({
  children,
  value,
  asChild = false,
  baseClassName,
  ...props
}: TabsContentComponentProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within Tabs");
  }
  const contentHook = useTabsContent({...props, ...context, value});

  if (!contentHook.isSelected) {
    return null;
  }

  const className = tabsContent({
    className: baseClassName || props.className,
  });

  const renderProps = {
    ...(contentHook.componentProps as ComponentProps<typeof View>),
    className,
  };

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      {
        ...renderProps,
      },
    )
  ) : (
    <View {...renderProps}>
      <View>{children}</View>
    </View>
  );
}
