import {useTheme} from "@/lib/utils/theme";
import {AriaToggleButtonProps, useToggleButton} from "@react-aria/button";
import {CheckIcon, DotIcon} from "lucide-react-native";
import {ComponentProps, useEffect, useRef, useState} from "react";
import {Platform, Pressable} from "react-native";
import {tv} from "tailwind-variants";
import tw from "twrnc";

/**
 * Base props for the `Checkbox` component and `useCheckbox` hook.
 * @param checked - **Controlled** checked state of the checkbox. If provided, the component becomes controlled.
 * @param defaultChecked - **Uncontrolled** initial checked state of the checkbox. Mutually exclusive with `checked`.
 * @param onCheckedChange - Callback that fires whenever the checked state changes.
 * @param disabled - Whether the checkbox is disabled and therefore non-interactive.
 * @param loading - Whether the checkbox is in a loading state (adds a pulse animation and disables interaction).
 * @param size - Size of the checkbox (`"sm" | "md" | "lg" | "xl"`).
 * @param color - Color scheme applied when the checkbox is checked.
 * @param borderRadius - Border radius of the checkbox container.
 */
export type CheckboxProps = {
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "success" | "warning" | "destructive";
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
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
 * Props for the exported `Checkbox` component.
 * @param baseClassName - Tailwind classes applied to the root element (overrides `className`).
 * @param iconClassName - Tailwind classes applied to the icon element.
 * @param size - Size variant of the checkbox.
 * @param color - Color variant of the checkbox.
 * @param borderRadius - Border radius variant of the checkbox.
 * @see CheckboxProps
 */
export type CheckboxComponentProps = {
  baseClassName?: string;
  iconClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "success" | "warning" | "destructive";
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  animation?: "shadcn" | "enhanced";
} & CheckboxProps &
  ComponentProps<typeof Pressable>;

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
      defaultSelected: currentChecked === true,
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
 * Tailwind variant for the `Checkbox` component.
 * @see CheckboxComponentProps
 */
export const checkbox = tv({
  slots: {
    base: "flex flex-row items-center justify-center bg-transparent border border-border focus-visible:outline-none focus-visible:border-2 focus-visible:border-ring focus-visible:border-offset-2",
    icon: "",
  },
  variants: {
    size: {
      sm: {icon: "w-2 h-2"},
      md: {icon: "w-3.5 h-3.5 m-0.5"},
      lg: {icon: "w-5 h-5 m-1"},
      xl: {icon: "w-6 h-6 m-1.5"},
    },
    color: {
      primary: {},
      secondary: {},
      success: {},
      warning: {},
      destructive: {},
    },
    borderRadius: {
      none: {base: "rounded-none"},
      sm: {base: "rounded-[4px]"},
      md: {base: "rounded-md"},
      lg: {base: "rounded-lg"},
      xl: {base: "rounded-xl"},
      full: {base: "rounded-full"},
    },
    disabled: {
      true: {base: "opacity-50"},
    },
    loading: {
      true: {base: "animate-pulse"},
    },
    checked: {
      true: {
        base: "bg-primary",
      },
      false: {base: "bg-transparent", icon: "opacity-0"},
    },
    animation: {
      enhanced: {icon: "transition-all duration-300"},
      shadcn: {},
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
    borderRadius: "md",
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
  borderRadius = "md",
  disabled = false,
  loading = false,
  animation = "shadcn",
  baseClassName,
  iconClassName,
  ...props
}: CheckboxComponentProps) {
  const currentTheme = useTheme();
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
    borderRadius,
    disabled: disabled || loading,
    loading,
    checked: state.isChecked || false,
    animation,
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
          style={tw.style(icon({className: iconClassName}))}
          testID="checkbox-icon"
          color={currentTheme.primaryForeground}
        />
      ) : state.isChecked ? (
        <CheckIcon
          style={tw.style(icon({className: iconClassName}))}
          testID="checkbox-icon"
          color={currentTheme.primaryForeground}
        />
      ) : (
        <CheckIcon
          style={tw.style(icon({className: iconClassName}))}
          testID="checkbox-icon"
          color={currentTheme.primaryForeground}
        />
      )}
    </Pressable>
  );
}
