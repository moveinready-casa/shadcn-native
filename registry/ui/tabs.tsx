import React, {
  ComponentProps,
  createContext,
  useContext,
  useState,
} from "react";
import {Pressable, View, Platform} from "react-native";
import {tv} from "tailwind-variants";

/**
 * Base props for the root `Tabs` component, context, and hook.
 * @param value - Controlled value for the tabs (which tab is selected).
 * @param defaultValue - Uncontrolled default value for the tabs (which tab is selected).
 * @param onValueChange - Callback function called when the tab value changes.
 * @param orientation - The orientation of the tabs. Horizontal displays tabs in a row, vertical displays them in a column.
 * @param size - The size of the tabs. Controls the height and spacing of tab elements.
 * @param variant - The visual style variant for the entire tabs group.
 * @param borderRadius - The border radius applied to the list container.
 */
export type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  variant?: "shadcn" | "underlined" | "outlined" | "ghost";
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
} & ComponentProps<typeof View>;

/**
 * Props for the `Tabs` component.
 * @param children - The content to render inside the tabs component.
 * @param asChild - If true clones the child and passes all functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base tabs component. Takes priority over the `className` prop.
 */
export type TabsComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & TabsProps;

/**
 * Return type for the `useTabs` hook.
 * @param state - The state of the tabs.
 * @param state.selectedValue - Currently selected tab value.
 * @param state.setSelectedValue - Function to set the selected tab value.
 * @param state.isControlled - Whether the tabs are controlled externally.
 */
export type TabsReturn = {
  state: {
    selectedValue: string | null;
    setSelectedValue: (value: string) => void;
    isControlled: boolean;
  };
};

/**
 * Style props for the tabs components.
 * @param orientation - The orientation of the tabs.
 * @param size - The size of the tabs.
 * @param variant - The visual style variant.
 * @param borderRadius - The border radius to apply.
 */
export type TabsStyleProps = Pick<
  TabsProps,
  "orientation" | "size" | "variant" | "borderRadius"
>;

/**
 * Base props for the `TabsList` component, context, and hook.
 * @param disabled - Disables interaction with all tab triggers.
 */
export type TabsListProps = {
  disabled?: boolean;
} & ComponentProps<typeof View>;

/**
 * Props for the `TabsList` component.
 * @param children - The content to render inside the tabs list component.
 * @param asChild - If true clones the child and passes all functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base tabs list component. Takes priority over the `className` prop.
 */
export type TabsListComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & TabsListProps;

/**
 * Return type for the `useTabsList` hook.
 * @param componentProps - Accessibility props to pass to the tabs list component.
 * @param disabledAll - Whether all tabs are disabled.
 */
export type TabsListReturn = {
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
  disabledAll: boolean;
};

/**
 * Base props for the `TabsTrigger` component and hook.
 * @param value - The value of the tab trigger (think of this as an id).
 * @param disabled - Whether the tab trigger is disabled.
 */
export type TabsTriggerHookProps = {
  value?: string;
  disabled?: boolean;
} & ComponentProps<typeof View>;

/**
 * Return type for the `useTabsTrigger` hook.
 * @param componentProps - Accessibility props to pass to the tab trigger component.
 * @param isActive - Whether the tab trigger is currently active.
 */
export type TabsTriggerReturn = {
  componentProps: ComponentProps<typeof Pressable> | HTMLButtonElement;
  isActive: boolean;
};

/**
 * Props for the `TabsTrigger` component.
 * @param children - The content to render inside the tab trigger component.
 * @param asChild - If true clones the child and passes all functionality props to it.
 * @param startContent - Start content (ReactNode) to display before the main content.
 * @param endContent - End content (ReactNode) to display after the main content.
 * @param color - Color variants similar to Badge component.
 * @param baseClassName - Custom tailwind classes to apply to the base tab trigger component. Takes priority over the `className` prop.
 * @param value - The value of the tab trigger (think of this as an id).
 * @param disabled - Whether the tab trigger is disabled.
 */
export type TabsTriggerComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  color?: "default" | "secondary" | "destructive" | "outline";
  baseClassName?: string;
  value: string;
  disabled?: boolean;
} & Omit<TabsTriggerHookProps, "value" | "disabled">;

/**
 * Base props for the `TabsContent` component and hook.
 * @param value - The value of the tab content (think of this as an id).
 */
export type TabsContentHookProps = {
  value?: string;
} & ComponentProps<typeof View>;

/**
 * Return type for the `useTabsContent` hook.
 * @param componentProps - Accessibility props to pass to the tab content component.
 * @param isSelected - Whether the tab content is currently selected.
 */
export type TabsContentReturn = {
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
  isSelected: boolean;
};

/**
 * Props for the `TabsContent` component.
 * @param children - The content to render inside the tab content component.
 * @param asChild - If true clones the child and passes all functionality props to it.
 * @param baseClassName - Custom tailwind classes to apply to the base tab content component. Takes priority over the `className` prop.
 * @param value - The value of the tab content (think of this as an id).
 */
export type TabsContentComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
  value: string;
} & Omit<TabsContentHookProps, "value">;

/**
 * The use tabs hook is the backbone of the tabs component.
 * @param param0 - Props to configure the behavior of the tabs. @see TabsProps
 * @returns Returns the state and functions to manage the tabs component. @see TabsReturn
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
 * The use tabs list hook provides accessibility and merged props for the tabs list.
 * @param param0 - Props to configure the behavior of the tabs list. @see TabsListProps
 * @returns Returns accessibility props and disabled state for the tabs list. @see TabsListReturn
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
 * The use tabs trigger hook provides accessibility and onPress behavior for tab triggers.
 * @param param0 - Props to configure the behavior of the tab trigger.
 * @param param0.props - Additional props
 * @returns Returns accessibility props for the tab trigger component. @see TabsTriggerReturn
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
 * The use tabs content hook provides accessibility and visibility state for tab content.
 * @param param0 - Props to configure the behavior of the tab content. @see TabsContentHookProps
 * @returns Returns accessibility props for the tab content component. @see TabsContentReturn
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

/**
 * A context wrapper containing the global state of the tabs.
 * @see TabsReturn
 */
export const TabsContext = createContext<TabsReturn | null>(null);

/**
 * A context wrapper containing the style configuration of the tabs.
 * @see TabsStyleProps
 */
export const TabsStyleContext = createContext<TabsStyleProps | null>(null);

/**
 * A context wrapper containing the state of the tabs list.
 * @see TabsListReturn
 */
export const TabsListContext = createContext<TabsListReturn | null>(null);

/**
 * Conditional classes for the tabs list component.
 * It includes the following variants:
 * - orientation: Controls the layout direction (horizontal/vertical)
 * - size: Controls the height and spacing (sm/md/lg)
 * - radius: Controls the border radius (none/sm/md/lg/xl)
 * - variant: Controls the visual style (shadcn/underlined/outlined/ghost)
 * @see TabsListComponentProps
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

/**
 * Conditional classes for the tabs trigger component.
 * It includes the following variants:
 * - active: Controls the active state styling (true/false)
 * - variant: Controls the visual style (shadcn/underlined/outlined/ghost)
 * - color: Controls the color scheme (default/secondary/destructive/outline)
 * - borderRadius: Controls the border radius (none/sm/md/lg/xl)
 * @see TabsTriggerComponentProps
 */
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

/**
 * Conditional classes for the tabs content component.
 * @see TabsContentComponentProps
 */
export const tabsContent = tv({
  base: "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
});

/**
 * The root tabs component. This should be supplied once per tabs group. It is required for all tabs.
 * @example
 * ```tsx
 * <Tabs defaultValue="account" className="w-[400px]">
 *   <TabsList>
 *     <TabsTrigger value="account">Account</TabsTrigger>
 *     <TabsTrigger value="password">Password</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="account">
 *     <Text>Make changes to your account here.</Text>
 *   </TabsContent>
 *   <TabsContent value="password">
 *     <Text>Change your password here.</Text>
 *   </TabsContent>
 * </Tabs>
 * ```
 * @param param0 - Props to configure the behavior of the tabs. @see TabsComponentProps
 * @returns Returns a context wrapper containing the global state of the tabs. @see TabsContext
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

/**
 * The tabs list component. This contains all the tab triggers and provides the container for the tab navigation.
 * @param param0 - Props to configure the behavior of the tabs list. @see TabsListComponentProps
 * @returns Returns a container for the tab triggers with proper accessibility and styling. @see TabsListReturn
 */
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

/**
 * The tabs trigger component. This renders a clickable tab that can be selected to show its associated content.
 * @param param0 - Props to configure the behavior of the tabs trigger. @see TabsTriggerComponentProps
 * @returns Returns a clickable tab trigger with proper accessibility and styling. @see TabsTriggerReturn
 */
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

/**
 * The tabs content component. This renders the content associated with a specific tab and is only visible when that tab is selected.
 * @param param0 - Props to configure the behavior of the tabs content. @see TabsContentComponentProps
 * @returns Returns the content for a specific tab, only visible when that tab is selected. @see TabsContentReturn
 */
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
