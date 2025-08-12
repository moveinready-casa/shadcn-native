import React, {
  ComponentProps,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import {Platform, Pressable, Text, View} from "react-native";
import {useFocusRing} from "@react-aria/focus";
import {tv} from "tailwind-variants";

/**
 * Props accepted by the RadioGroup root, aligned with Radix UI props.
 * - value: Controlled value for the checked item
 * - defaultValue: Uncontrolled initial value
 * - onValueChange: Callback when selection changes
 * - disabled: Disables interaction for all items
 * - name: Group name (forwarded)
 * - required: Whether selection is required (forwarded)
 * - orientation: Layout direction ("horizontal" | "vertical")
 * - dir: Reading direction ("ltr" | "rtl") (forwarded)
 * - loop: Whether keyboard navigation should loop (forwarded)
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
 * Return type for the useRadioGroup hook.
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
 * Hook to manage RadioGroup behavior. Uses internal state when uncontrolled.
 * On web, merges accessibility props from React Aria if available.
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

  // Build web accessibility props via react-aria (optional runtime import).
  // Must be called at the top level (not inside nested callbacks) to adhere to Rule of Hooks.
  let ariaGroupProps = {} as Partial<ComponentProps<typeof View>>;
  if (Platform.OS === "web") {
    try {
      const ariaRadio = require("@react-aria/radio");
      const ariaUtils = require("@react-aria/utils");
      const {useRadioGroup: useAriaRadioGroup} = ariaRadio as {
        useRadioGroup: (
          props: Record<string, unknown>,
          state: {selectedValue: string | undefined},
        ) => {radioGroupProps: Record<string, unknown>};
      };
      const {mergeProps} = ariaUtils as {
        mergeProps: (
          a: Record<string, unknown>,
          b: Record<string, unknown>,
        ) => Record<string, unknown>;
      };
      const {radioGroupProps} = useAriaRadioGroup(
        {name, isRequired: required, orientation},
        {selectedValue},
      );
      ariaGroupProps = mergeProps(radioGroupProps, {}) as Partial<
        ComponentProps<typeof View>
      >;
    } catch {
      ariaGroupProps = {} as Partial<ComponentProps<typeof View>>;
    }
  }

  return {
    state: {
      value: selectedValue,
      setValue,
    },
    componentProps: {
      ...(Platform.OS === "web"
        ? (ariaGroupProps as ComponentProps<typeof View>)
        : {}),
      accessibilityRole: "radiogroup",
      accessibilityState: {disabled: disabled === true},
      // Forward Radix-like attributes for testing and web. RN will ignore unknown props.
      name,
      required,
      dir,
      loop,
    },
  };
};

/**
 * Props for individual RadioGroupItem.
 */
export type RadioGroupItemProps = {
  value: string;
  disabled?: boolean;
};

/**
 * Return type for the useRadioItem hook.
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
 * Hook to provide accessibility and behavior for a single radio item.
 * On web, merges accessibility props from React Aria if available.
 * State is sourced from useRadioGroup and is not managed by React Aria.
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

  const ref = useRef(null);
  const {isFocusVisible, focusProps} = useFocusRing();

  // Build web accessibility props via react-aria (optional runtime import).
  let ariaItemProps = {} as Partial<ComponentProps<typeof View>>;
  if (Platform.OS === "web") {
    try {
      const ariaRadio = require("@react-aria/radio");
      const {useRadio: useAriaRadio} = ariaRadio as {
        useRadio: (
          props: Record<string, unknown>,
          state: {selectedValue: string | undefined},
          refObj: React.RefObject<unknown>,
        ) => {inputProps: Record<string, unknown>; isSelected: boolean};
      };
      const {inputProps} = useAriaRadio(
        {value, isDisabled},
        {selectedValue: group.state.value},
        ref,
      );
      ariaItemProps = inputProps as Partial<ComponentProps<typeof View>>;
    } catch {
      ariaItemProps = {} as Partial<ComponentProps<typeof View>>;
    }
  }

  const onPress = () => {
    if (isDisabled) return;
    if (selected) return; // no-op when already selected
    group.state.setValue(value);
  };

  return {
    state: {
      isSelected: selected,
      isDisabled,
      isFocusVisible,
    },
    componentProps: {
      ...(Platform.OS === "web"
        ? (focusProps as ComponentProps<typeof Pressable>)
        : {}),
      onPress,
      accessibilityRole: "radio",
      accessibilityState: {selected, disabled: isDisabled},
    },
    labelProps: {
      // Basic label text props; consumers may extend
      accessible: false,
    },
    inputProps: {
      ...(Platform.OS === "web"
        ? (ariaItemProps as ComponentProps<typeof View>)
        : {}),
      accessible: false,
    },
  };
};

/**
 * Context shared by RadioGroup and RadioGroupItem components.
 */
export const RadioGroupContext = createContext<
  (RadioGroupReturn & {props: Partial<RadioGroupProps>}) | null
>(null);

/**
 * Tailwind Variants for RadioGroup root.
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
 * Tailwind Variants for RadioGroup item.
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
 * Public component props for RadioGroup.
 */
export type RadioGroupComponentProps = {
  children?: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & RadioGroupProps &
  ComponentProps<typeof View>;

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
 * Public component props for RadioGroupItem.
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
