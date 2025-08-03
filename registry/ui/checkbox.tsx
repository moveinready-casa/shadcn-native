import React, {ComponentProps, useEffect, useRef, useState} from "react";
import {Platform, Pressable} from "react-native";
import {AriaToggleButtonProps, useToggleButton} from "@react-aria/button";
import {tv} from "tailwind-variants";
import {CheckIcon, DotIcon} from "lucide-react-native";

/**
 * Base props for the `Checkbox` component and `useCheckbox` hook.
 * @param checked - **Controlled** checked state of the checkbox. If provided, the component becomes controlled.
 * @param defaultChecked - **Uncontrolled** initial checked state of the checkbox. Mutually exclusive with `checked`.
 * @param onCheckedChange - Callback that fires whenever the checked state changes.
 * @param disabled - Whether the checkbox is disabled and therefore non-interactive.
 * @param loading - Whether the checkbox is in a loading state (adds a pulse animation and disables interaction).
 * @param size - Size of the checkbox (`"sm" | "md" | "lg"`).
 * @param color - Color scheme applied when the checkbox is checked.
 * @param radius - Border radius of the checkbox container.
 */
export type CheckboxProps = {
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "warning" | "destructive";
  radius?: "none" | "sm" | "md" | "lg" | "full";
} & AriaToggleButtonProps;

/**
 * Return type for the `useCheckbox` hook.
 * @param state - Object describing the current state and setter for `isChecked`.
 * @param props - Accessibility / interaction props to spread onto the underlying `Pressable`.
 */
export type CheckboxReturn = {
  state: {
    /** Whether the checkbox is currently checked (not indeterminate). */
    isChecked: boolean;
    /** Setter for the checked state (no-op when the component is controlled). */
    setIsChecked: (isChecked: boolean) => void;
  };
  /** Props to apply to the checkbox root element. */
  props: ComponentProps<typeof Pressable>;
};

/**
 * React hook that implements the core logic for the `Checkbox` component, including
 * controlled / uncontrolled state management and full accessibility support via `@react-aria`.
 * @see CheckboxProps
 * @returns @see CheckboxReturn
 */
export const useCheckbox = ({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  loading,
  ...props
}: CheckboxProps): CheckboxReturn => {
  if (defaultChecked && checked) {
    throw new Error(
      "checked and defaultChecked cannot be used at the same time",
    );
  }

  const [isChecked, setIsChecked] = useState(
    defaultChecked === "indeterminate" || !defaultChecked ? false : true,
  );

  const isControlled = checked !== undefined;
  const currentChecked = isControlled ? checked : isChecked;
  const isIndeterminate = currentChecked === "indeterminate";

  const mounted = useRef(false);
  useEffect(() => {
    if (!isIndeterminate && mounted.current) {
      onCheckedChange?.(currentChecked);
    } else {
      mounted.current = true;
    }
  }, [currentChecked]);

  const buttonRef = useRef(null);

  const webProps = useToggleButton(
    {...props},
    {
      isSelected: currentChecked === true,
      setSelected: (isSelected) => {
        if (!isControlled) {
          setIsChecked(isSelected);
        }
      },
      toggle: () => {
        if (!isControlled) {
          setIsChecked(!isChecked);
        }
      },
    },
    buttonRef,
  );

  const handlePress = (event: any) => {
    if (disabled || loading || isIndeterminate) return;

    props.onPress?.(event);
    if (!isControlled) {
      setIsChecked(!isChecked);
    }
  };

  return {
    state: {
      isChecked: currentChecked === true,
      setIsChecked: isControlled ? () => {} : setIsChecked,
    },
    props: {
      ...(Platform.OS === "web" ? webProps : {}),
      onPress: (e) => handlePress(e),
      accessibilityRole: "checkbox",
      accessibilityState: {
        checked: isIndeterminate ? "mixed" : currentChecked,
        disabled: disabled || loading,
      },
    },
  };
};

/**
 * Props for the exported `Checkbox` component.
 * @param baseClassName - Tailwind classes applied to the root element (overrides `className`).
 * @param iconClassName - Tailwind classes applied to the icon element.
 * @param size - Size variant of the checkbox.
 * @param color - Color variant of the checkbox.
 * @param radius - Border radius variant of the checkbox.
 * @see CheckboxProps
 */
export type CheckboxComponentProps = {
  baseClassName?: string;
  iconClassName?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "warning" | "destructive";
  radius?: "none" | "sm" | "md" | "lg" | "full";
} & CheckboxProps &
  ComponentProps<typeof Pressable>;

/**
 * Tailwind variant for the `Checkbox` component.
 * @see CheckboxComponentProps
 */
export const checkbox = tv({
  slots: {
    base: "flex flex-row items-center justify-center bg-transparent border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    icon: "text-primary-foreground",
  },
  variants: {
    size: {
      sm: {icon: "w-2 h-2"},
      md: {icon: "w-3.5 h-3.5 m-0.5"},
      lg: {icon: "w-5 h-5 m-1"},
    },
    color: {
      primary: {},
      secondary: {},
      success: {},
      warning: {},
      destructive: {},
    },
    radius: {
      none: {base: "rounded-none"},
      sm: {base: "rounded-[4px]"},
      md: {base: "rounded-md"},
      lg: {base: "rounded-lg"},
      full: {base: "rounded-full"},
    },
    disabled: {
      true: {base: "opacity-50"},
    },
    loading: {
      true: {base: "animate-pulse"},
    },
    checked: {
      true: {base: "bg-primary"},
    },
  },
  compoundVariants: [
    {
      color: "primary",
      checked: true,
      className: {base: "bg-primary"},
    },
    {
      color: "secondary",
      checked: true,
      className: {base: "bg-secondary"},
    },
    {
      color: "success",
      checked: true,
      className: {base: "bg-success"},
    },
    {
      color: "warning",
      checked: true,
      className: {base: "bg-warning"},
    },
    {
      color: "destructive",
      checked: true,
      className: {base: "bg-destructive"},
    },
  ],
  defaultVariants: {
    size: "md",
    color: "primary",
    radius: "md",
  },
});

/**
 * React component that renders an accessible, themeable checkbox.
 *
 * ```tsx
 * <Checkbox defaultChecked onCheckedChange={(v) => console.log(v)} />
 * ```
 * @see CheckboxComponentProps
 */
export function Checkbox({
  checked,
  defaultChecked,
  size = "md",
  color,
  radius = "md",
  disabled = false,
  loading = false,
  baseClassName,
  iconClassName,
  ...props
}: CheckboxComponentProps) {
  const {props: ariaProps, state} = useCheckbox({
    checked,
    defaultChecked,
    disabled,
    loading,
    ...props,
  });

  const isIndeterminate =
    checked === "indeterminate" || defaultChecked === "indeterminate";

  const {base, icon} = checkbox({
    size,
    color,
    radius,
    disabled: disabled || loading,
    loading,
    checked: state.isChecked,
  });

  const renderProps = {
    ...ariaProps,
    ...props,
    className: base({className: baseClassName || props.className}),
  };

  return (
    <Pressable {...renderProps}>
      {isIndeterminate ? (
        <DotIcon
          className={icon({className: iconClassName})}
          testID="checkbox-icon"
        />
      ) : state.isChecked ? (
        <CheckIcon
          className={icon({className: iconClassName})}
          testID="checkbox-icon"
        />
      ) : (
        <CheckIcon
          className={icon({className: "opacity-0"})}
          testID="checkbox-icon"
        />
      )}
    </Pressable>
  );
}
