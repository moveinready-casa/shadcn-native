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
};

export type TabsStyleProps = Pick<
  TabsProps,
  "orientation" | "size" | "variant" | "borderRadius"
>;

/**
 * TabsList props and context
 */
export type TabsListProps = {
  /** disables interaction with all triggers */
  disabled?: boolean;
} & ComponentProps<typeof View>;

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
  value?: string;
  disabled?: boolean;
} & ComponentProps<typeof View>;

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
  value: string;
  disabled?: boolean;
} & Omit<TabsTriggerHookProps, "value" | "disabled">;

/**
 * Content props
 */
export type TabsContentHookProps = {
  value?: string;
} & ComponentProps<typeof View>;

export type TabsContentReturn = {
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
  isSelected: boolean;
};

export type TabsContentComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
  value: string;
} & Omit<TabsContentHookProps, "value">;

/**
 * useTabs: manage controlled/uncontrolled state
 */
export const useTabs = ({
  value,
  defaultValue,
  onValueChange,
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
  };
};

/**
 * useTabsList: accessibility and merged props
 */
export const useTabsList = ({
  disabled,
  ...props
}: TabsListProps): TabsListReturn => {
  return {
    componentProps: {
      ...(Platform.OS === "web" ? {role: "tablist"} : {}),
      accessibilityRole: "tablist",
      ...props,
    },
    disabledAll: !!disabled,
  };
};

/**
 * useTabsTrigger: a11y + onPress behavior
 */
export const useTabsTrigger = ({
  ...props
}: TabsTriggerHookProps): TabsTriggerReturn => {
  return {
    componentProps: {
      ...(Platform.OS === "web" ? {role: "tab"} : {}),
      accessibilityRole: "tab",
      ...props,
    },
    isActive: false,
  };
};

/**
 * useTabsContent: a11y + visibility state
 */
export const useTabsContent = ({
  ...props
}: TabsContentHookProps): TabsContentReturn => {
  return {
    componentProps: {
      ...(Platform.OS === "web" ? {role: "tabpanel"} : {}),
      ...props,
    },
    isSelected: false,
  };
};

export const TabsContext = createContext<TabsReturn | null>(null);
export const TabsStyleContext = createContext<TabsStyleProps | null>(null);
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
  const styleProps: TabsStyleProps = {
    orientation: props.orientation ?? "horizontal",
    size: props.size ?? "md",
    variant: props.variant ?? "shadcn",
    borderRadius: props.borderRadius ?? "md",
  };

  const renderProps = {
    ...props,
    className: baseClassName || props.className,
  };

  return (
    <TabsContext.Provider value={hook}>
      <TabsStyleContext.Provider value={styleProps}>
        <View {...renderProps}>{children}</View>
      </TabsStyleContext.Provider>
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
  const styleContext = useContext(TabsStyleContext);
  if (!context || !styleContext) {
    throw new Error("TabsList must be used within Tabs");
  }

  const listHook = useTabsList({...props, disabled});

  const className = tabsList({
    orientation: styleContext.orientation,
    size: styleContext.size,
    radius: styleContext.borderRadius,
    variant: styleContext.variant,
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
  const styleContext = useContext(TabsStyleContext);
  const list = useContext(TabsListContext);
  if (!tabs || !styleContext || !list) {
    throw new Error("TabsTrigger must be used within Tabs and TabsList");
  }

  const triggerHook = useTabsTrigger({
    ...props,
    value,
    disabled,
  });

  const isActive = tabs.state.selectedValue === value;
  const isDisabled = !!disabled || !!list.disabledAll;

  const onPress = () => {
    if (isDisabled || isActive) return;
    tabs.state.setSelectedValue(value);
  };

  const className = tabsTrigger({
    active: isActive,
    variant: styleContext.variant,
    borderRadius: styleContext.borderRadius,
    color,
    className: baseClassName || props.className,
  });

  const renderProps = {
    ...(triggerHook.componentProps as ComponentProps<typeof Pressable>),
    ...(Platform.OS === "web" ? {"aria-selected": isActive} : {}),
    accessibilityState: {selected: isActive, disabled: isDisabled},
    onPress,
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

  const contentHook = useTabsContent({...props, value});

  const isSelected = context.state.selectedValue === value;

  if (!isSelected) {
    return null;
  }

  const className = tabsContent({
    className: baseClassName || props.className,
  });

  const renderProps = {
    ...(contentHook.componentProps as ComponentProps<typeof View>),
    ...(Platform.OS === "web" ? {hidden: !isSelected} : {}),
    accessibilityState: {selected: isSelected},
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
