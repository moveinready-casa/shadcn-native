import React, {
  ComponentProps,
  createContext,
  useContext,
  useState,
} from "react";
import {Platform, Pressable, Text, View} from "react-native";
import {useFocusRing} from "@react-aria/focus";
import {useRadioGroup as useAriaRadioGroup} from "@react-aria/radio";
import {tv} from "tailwind-variants";

/**
 * Base props for the `RadioGroup` component, context, and hook.
 * @param value - Controlled value for the selected radio item.
 * @param defaultValue - Uncontrolled default value for the selected radio item.
 * @param onValueChange - Callback fired when the selected value changes.
 * @param disabled - Whether all radio items are disabled.
 * @param name - Group name. Forwarded to underlying accessibility props on web.
 * @param required - Whether a selection is required. Forwarded to accessibility props on web.
 * @param orientation - Layout direction of the group.
 * @param dir - Reading direction. Forwarded to accessibility props on web.
 * @param loop - Whether keyboard navigation loops. Forwarded to accessibility props on web.
 */
export type RadioGroupProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  orientation?: "horizontal" | "vertical";
  dir?: "ltr" | "rtl";
  loop?: boolean;
};

/**
 * Return type for the `useRadioGroup` hook.
 * @param state - The state of the radio group.
 * @param componentProps - Accessibility props to pass to the radio group component.
 */
export type RadioGroupReturn = {
  state: {
    value: string | undefined;
    setValue: (value: string) => void;
  };
  componentProps: ComponentProps<typeof View> &
    Partial<Pick<RadioGroupProps, "name" | "required" | "dir" | "loop">>;
};

/**
 * Base props for the `RadioGroupItem` component, context, and hook.
 * @param value - The value of the radio item.
 * @param disabled - Whether this radio item is disabled. This can override the disabled state of the top-level `RadioGroup`.
 */
export type RadioGroupItemProps = {
  value: string;
  disabled?: boolean;
};

/**
 * Return type for the `useRadioItem` hook.
 * @param componentProps - Accessibility props to pass to the radio item root component.
 * @param labelProps - Accessibility props to pass to the radio item label.
 * @param inputProps - Accessibility props to pass to the radio control element.
 * @param state - The state of the radio item.
 */
export type RadioItemReturn = {
  state: {
    isSelected: boolean;
    isDisabled: boolean;
    isFocusVisible: boolean;
  };
  componentProps: ComponentProps<typeof Pressable>;
  labelProps: ComponentProps<typeof Text>;
  inputProps: ComponentProps<typeof View>;
};

/**
 * Props for the `RadioGroupItem` component.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it. Available on any exported component.
 * @param baseClassName - Custom tailwind classes to apply to the base radio item component. Takes priority over the `className` prop.
 * @param labelClassName - Custom tailwind classes to apply to the item's label.
 * @param controlClassName - Custom tailwind classes to apply to the radio control.
 * @param indicatorClassName - Custom tailwind classes to apply to the radio indicator.
 * @see RadioGroupItemProps
 */
export type RadioGroupItemComponentProps = {
  children?: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
  labelClassName?: string;
  controlClassName?: string;
  indicatorClassName?: string;
} & RadioGroupItemProps &
  ComponentProps<typeof Pressable>;

/**
 * Props for the `RadioGroup` component.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it. Available on any exported component.
 * @param baseClassName - Custom tailwind classes to apply to the base radio group component. Takes priority over the `className` prop.
 */
export type RadioGroupComponentProps = {
  children?: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & RadioGroupProps &
  ComponentProps<typeof View>;

/**
 * The `useRadioGroup` hook is the backbone of the radio group component.
 * @param param0 - Props to configure the behavior of the radio group. @see RadioGroupProps
 * @returns Returns both the state and the accessibility props to pass to the radio group component. @see RadioGroupReturn
 */
export const useRadioGroup = ({
  value,
  defaultValue,
  onValueChange,
  disabled,
  name,
  required,
  orientation = "vertical",
  dir,
  loop,
}: RadioGroupProps): RadioGroupReturn => {
  if (value !== undefined && defaultValue !== undefined) {
    throw new Error("Cannot set both value and defaultValue");
  }

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue,
  );

  const selectedValue = isControlled ? value : internalValue;

  const setValue = (next: string) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  };

  const groupState = {
    selectedValue: selectedValue ?? null,
    setSelectedValue: (next: string | null) => {
      if (next == null) return;
      setValue(String(next));
    },
    isSelected: (val: string) => (selectedValue ?? null) === val,
    isDisabled: disabled ?? false,
    isReadOnly: false,
    isRequired: required ?? false,
    validationState: "valid",
    name: name || "",
    displayValidation: {isInvalid: false},
  };

  const {radioGroupProps} = useAriaRadioGroup(
    {name, isRequired: required, orientation},
    groupState as any,
  );

  return {
    state: {
      value: selectedValue,
      setValue,
    },
    componentProps: {
      ...(Platform.OS === "web"
        ? (radioGroupProps as ComponentProps<typeof View>)
        : {}),
      accessibilityRole: "radiogroup",
      accessibilityState: {disabled: disabled === true},
      dir,
      loop,
    },
  };
};

/**
 * The `useRadioItem` hook provides accessibility and behavior for a single radio item.
 * On web, merges accessibility props from React Aria if available.
 * @param item - Props to configure the behavior of the radio item. @see RadioGroupItemProps
 * @param group - The radio group return value. @see RadioGroupReturn
 * @param groupProps - The top-level radio group props. @see RadioGroupProps
 * @returns Returns state and accessibility props for the radio item. @see RadioItemReturn
 */
export const useRadioItem = (
  item: RadioGroupItemProps,
  group: RadioGroupReturn,
  groupProps?: RadioGroupProps,
): RadioItemReturn => {
  const {value} = item;
  const selected = group.state.value === value;
  const isDisabled =
    (groupProps?.disabled ?? false) || (item.disabled ?? false);

  const {isFocusVisible} = useFocusRing();

  const onPress = () => {
    if (isDisabled) return;
    if (selected) return;
    group.state.setValue(value);
  };

  return {
    state: {
      isSelected: selected,
      isDisabled,
      isFocusVisible,
    },
    componentProps: {
      onPress,
      accessibilityRole: "radio",
      accessibilityState: {selected, disabled: isDisabled},
    },
    labelProps: {
      accessible: false,
    },
    inputProps: {
      accessible: false,
    },
  };
};

/**
 * Context value for the `RadioGroup` component.
 * @param props - Props from the top-level radio group component.
 * @see RadioGroupReturn
 * @see RadioGroupProps
 */
export const RadioGroupContext = createContext<
  (RadioGroupReturn & {props: Partial<RadioGroupProps>}) | null
>(null);

/**
 * Conditional classes for the root radio group component.
 * @see RadioGroupComponentProps
 */
export const radioGroup = tv({
  slots: {
    base: "flex gap-2",
  },
  variants: {
    orientation: {
      vertical: {base: "flex-col"},
      horizontal: {base: "flex-row"},
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

/**
 * Conditional classes for the radio group item component.
 * It includes the following slots:
 * - base: The base styles for the radio item.
 * - control: The radio control element styles.
 * - indicator: The inner selected indicator styles.
 * - label: The label styles for the radio item.
 * @see RadioGroupItemComponentProps
 */
export const radioGroupItem = tv({
  slots: {
    base: "flex flex-row items-center gap-2 px-3 py-2 rounded-md",
    control:
      "w-4 h-4 rounded-full border border-border items-center justify-center",
    indicator: "w-2 h-2 rounded-full",
    label: "text-sm text-foreground",
  },
  variants: {
    selected: {
      true: {indicator: "bg-secondary-foreground"},
      false: {indicator: "bg-transparent"},
    },
    disabled: {
      true: {base: "opacity-50"},
    },
    focused: {
      true: {base: "ring-2 ring-ring"},
    },
  },
  defaultVariants: {
    selected: false,
  },
});

/**
 * The root radio group component. This should be supplied once per radio group. It is required for all radio groups.
 * @example
 * ```tsx
 * <RadioGroup value={value} onValueChange={setValue} orientation="vertical">
 *   <RadioGroupItem value="apple">Apple</RadioGroupItem>
 *   <RadioGroupItem value="banana">Banana</RadioGroupItem>
 *   <RadioGroupItem value="orange">Orange</RadioGroupItem>
 * </RadioGroup>
 * ```
 * @param param0 - Props to configure the behavior of the radio group. @see RadioGroupComponentProps
 * @returns Returns a context wrapper containing the global state of the radio group. @see RadioGroupReturn
 */
export function RadioGroup({
  children,
  asChild = false,
  baseClassName,
  orientation = "vertical",
  ...props
}: RadioGroupComponentProps) {
  const hook = useRadioGroup({orientation, ...props});
  const {base} = radioGroup({orientation});

  const renderProps = {
    ...hook.componentProps,
    ...props,
    className: base({className: baseClassName || props.className}),
  } as ComponentProps<typeof View>;

  return (
    <RadioGroupContext.Provider value={{...hook, props}}>
      {asChild ? (
        React.cloneElement(
          React.Children.toArray(children ?? [])[0] as React.ReactElement<{
            className?: string;
          }>,
          {
            ...renderProps,
            className: renderProps.className,
          },
        )
      ) : (
        <View {...renderProps}>{children}</View>
      )}
    </RadioGroupContext.Provider>
  );
}

/**
 * The radio group item component. Renders a single radio option. Can clone a child when `asChild` is true.
 * @param param0 - Props to configure the behavior and styles of the radio item. @see RadioGroupItemComponentProps
 * @returns Returns a pressable radio item integrated with the radio group context.
 */
export function RadioGroupItem({
  children,
  value,
  disabled,
  asChild = false,
  baseClassName,
  labelClassName,
  controlClassName,
  indicatorClassName,
  ...props
}: RadioGroupItemComponentProps) {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error("RadioGroupItem must be used within a RadioGroup");
  }

  const {state, componentProps, labelProps, inputProps} = useRadioItem(
    {value, disabled},
    context,
    context.props,
  );

  const {base, control, indicator, label} = radioGroupItem({
    selected: state.isSelected,
    disabled: state.isDisabled,
    focused: state.isFocusVisible,
  });

  const rootProps = {
    ...componentProps,
    ...props,
    className: base({className: baseClassName || props.className}),
  } as ComponentProps<typeof Pressable>;

  const Control = (
    <View {...inputProps} className={control({className: controlClassName})}>
      <View className={indicator({className: indicatorClassName})} />
    </View>
  );

  if (asChild) {
    return (
      <View className={base({className: baseClassName || props.className})}>
        {React.cloneElement(
          React.Children.toArray(children ?? [])[0] as React.ReactElement<{
            className?: string;
          }>,
          {
            ...rootProps,
            className: base({className: baseClassName || props.className}),
          },
        )}
      </View>
    );
  }

  return (
    <Pressable {...rootProps}>
      {Control}
      <Text {...labelProps} className={label({className: labelClassName})}>
        {children}
      </Text>
    </Pressable>
  );
}
