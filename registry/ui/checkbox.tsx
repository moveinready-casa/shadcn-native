import React, {ComponentProps, useEffect, useRef, useState} from "react";
import {Platform, Pressable, View} from "react-native";
import {AriaToggleButtonProps, useToggleButton} from "@react-aria/button";
import {tv} from "tailwind-variants";
import {CheckIcon, DotIcon} from "lucide-react-native";

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

export type CheckboxReturn = {
  state: {
    isChecked: boolean;
    setIsChecked: (isChecked: boolean) => void;
  };
  props: ComponentProps<typeof Pressable>;
};

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

export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive";
export type CheckboxRadius = "none" | "sm" | "md" | "lg" | "full";

export type CheckboxComponentProps = {
  baseClassName?: string;
  iconClassName?: string;
  size?: CheckboxSize;
  color?: CheckboxColor;
  radius?: CheckboxRadius;
} & CheckboxProps &
  ComponentProps<typeof Pressable>;

const checkbox = tv({
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
