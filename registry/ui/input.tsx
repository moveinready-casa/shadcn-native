import {useButton} from "@react-aria/button";
import {useFocusRing} from "@react-aria/focus";
import {XIcon} from "lucide-react-native";
import React, {
  ComponentProps,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {Platform, Pressable, TextInput, View} from "react-native";
import {tv} from "tailwind-variants";

/**
 * Base props for the `Input` component and `useInput` hook.
 * @param disabled - Whether the input is disabled. Disables editing and interaction.
 * @param readOnly - Whether the input is read-only. Prevents edits but does not mark as disabled for accessibility.
 * @param required - Whether the input is required. Adds visual affordances and accessibility hinting.
 * @param clearable - Whether to show a clear button when the value is non-empty.
 */
export type InputProps = {
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  clearable?: boolean;
};

/**
 * Return type for the `useInput` hook.
 * @param state - Object describing current component state.
 * @param state.isFocused - Whether the input currently has focus.
 * @param state.setIsFocused - Setter to update focused state (internal only).
 * @param state.showClear - Whether the clear button should be visible.
 * @param componentProps - Accessibility/host props for the wrapper `View`.
 * @param inputProps - Props to spread onto the `TextInput` element.
 * @param clearButtonProps - Props for the clear `Pressable` element.
 * @see InputComponentProps
 */
export type InputReturn = {
  state: {
    isFocused: boolean;
    setIsFocused: (isFocused: boolean) => void;
    showClear: boolean;
  };
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
  inputProps: ComponentProps<typeof TextInput> | HTMLInputElement;
  clearButtonProps: ComponentProps<typeof Pressable> | HTMLButtonElement;
};

/**
 * Props for the exported `Input` component.
 * @param className - Tailwind classes merged into the wrapper; use `baseClassName` to fully override.
 * @param baseClassName - Tailwind classes applied to the wrapper slot with priority over `className`.
 * @param inputClassName - Tailwind classes applied to the inner `TextInput` slot.
 * @param clearButtonClassName - Tailwind classes applied to the clear button slot.
 * @param variant - Visual variant of the input: "shadcn" | "outlined" | "ghost".
 * @param size - Size of the input: "sm" | "md" | "lg" | "xl".
 * @param borderRadius - Corner radius: "none" | "sm" | "md" | "lg" | "xl".
 * @param color - Color family applied primarily to borders: "primary" | "secondary" | "success" | "warning" | "destructive".
 * @param startContent - Optional leading adornment content.
 * @param endContent - Optional trailing adornment content.
 * @param testID - Test identifier applied to the wrapper `View`.
 * @param onChangeText - Callback when the text changes; required for controlled usage.
 * @param value - Controlled value of the input.
 * @param defaultValue - Uncontrolled initial value of the input.
 * @param accessibilityHint - Additional accessibility hint text.
 * @see InputProps
 */
export type InputComponentProps = {
  className?: string;
  variant?: "shadcn" | "outlined" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "success" | "warning" | "destructive";
  startContent?: ReactNode;
  endContent?: ReactNode;
  testID?: string;
  baseClassName?: string;
  inputClassName?: string;
  clearButtonClassName?: string;
  onChangeText?: (text: string) => void;
  value?: string;
  defaultValue?: string;
  accessibilityHint?: string;
} & Omit<
  ComponentProps<typeof TextInput>,
  "editable" | "onChangeText" | "value" | "defaultValue" | "accessibilityHint"
> &
  InputProps;

/**
 * Tailwind Variants configuration for the `Input` component.
 * Includes the following slots:
 * - base: The wrapper styles for the input.
 * - input: The inner `TextInput` element styles.
 * - clearButton: The clear button styles.
 * @see InputComponentProps
 */
export const inputStyles = tv({
  slots: {
    base: "flex flex-row items-center w-full border px-3 focus:ring-1",
    input:
      "h-full w-full flex-1 outline-none text-foreground placeholder:text-muted-foreground",
    clearButton: "",
  },
  variants: {
    variant: {
      shadcn: {
        base: "bg-background border-input shadow-sm",
      },
      outlined: {
        base: "bg-transparent border-input",
      },
      ghost: {
        base: "bg-transparent border-transparent shadow-none",
      },
    },
    size: {
      sm: {
        base: "h-8",
      },
      md: {
        base: "h-9",
      },
      lg: {
        base: "h-10",
      },
      xl: {
        base: "h-12",
      },
    },
    borderRadius: {
      none: {
        base: "rounded-none",
      },
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
    color: {
      primary: {
        base: "border border-primary",
      },
      secondary: {
        base: "border border-secondary",
      },
      success: {
        base: "border border-success",
      },
      warning: {
        base: "border border-warning",
      },
      destructive: {
        base: "border border-destructive",
      },
    },
    disabled: {
      true: {
        base: "opacity-50",
      },
    },
    loading: {
      true: {
        base: "opacity-80 animate-pulse",
      },
    },
    focused: {
      true: {
        base: "ring-1 ring-ring",
      },
    },
    showClear: {
      true: {
        clearButton: "opacity-100",
      },
      false: {
        clearButton: "opacity-0",
      },
    },
    required: {
      true: {
        base: "after:content-['*'] after:text-destructive after:ml-1",
      },
    },
  },
  defaultVariants: {
    variant: "shadcn",
    size: "md",
    borderRadius: "md",
    color: "primary",
    disabled: false,
    loading: false,
  },
});

/**
 * React hook that implements the core logic for the `Input` component, including
 * controlled/uncontrolled value handling, clear button visibility, and accessibility props.
 * @param onChangeText - Callback invoked when the text changes.
 * @param disabled - Whether the input is disabled; disables editing and marks accessibility state.
 * @param readOnly - Whether the input is read-only; prevents edits but not marked disabled.
 * @param required - Whether the input is required; augments accessibility hint.
 * @param clearable - Whether to render a clear button when the value is non-empty.
 * @param value - Controlled value of the input.
 * @param defaultValue - Uncontrolled initial value of the input.
 * @param accessibilityHint - Extra accessibility hint text.
 * @returns @see InputReturn
 * @see InputComponentProps
 */
export const useInput = ({
  onChangeText,
  disabled,
  readOnly,
  required,
  clearable,
  value,
  defaultValue,
  accessibilityHint,
  ...textInputProps
}: InputComponentProps): InputReturn => {
  const [isFocused, setIsFocused] = useState(false);
  const isEditable = !(disabled || readOnly);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(
    typeof defaultValue === "string" ? defaultValue : undefined,
  );
  const currentValue = isControlled
    ? (value as string | undefined)
    : internalValue;

  const [showClear, setShowClear] = useState(
    Boolean(clearable && currentValue && currentValue.length > 0),
  );

  useEffect(() => {
    setShowClear(Boolean(clearable && currentValue && currentValue.length > 0));
  }, [clearable, currentValue]);

  const handleChangeText = (text: string) => {
    if (!isEditable) return;
    if (!isControlled) {
      setInternalValue(text);
      setShowClear(Boolean(clearable && text && text.length > 0));
    }
    onChangeText?.(text);
  };

  const mergedAccessibilityHint =
    (accessibilityHint || "") + (required ? " (required)" : "");

  const clearButtonRef = useRef<typeof Pressable>(null);
  const {buttonProps} = useButton({}, clearButtonRef);
  const {focusProps} = useFocusRing();

  return {
    state: {
      isFocused,
      setIsFocused,
      showClear,
    },
    componentProps: {
      accessible: true,
      accessibilityRole: "text",
      accessibilityState: {disabled},
      accessibilityHint: mergedAccessibilityHint,
    },
    inputProps: {
      ...textInputProps,
      onChangeText: handleChangeText,
      editable: isEditable,
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      value: currentValue,
    },
    clearButtonProps: {
      accessibilityRole: "button",
      onPress: () => handleChangeText(""),
      ...(Platform.OS === "web" ? focusProps : {}),
      ...(Platform.OS === "web" ? buttonProps : {}),
    },
  };
};

/**
 * React component that renders an accessible, themeable input field with optional
 * leading/trailing content and a clear button.
 *
 * Example:
 * ```tsx
 * <Input placeholder="Email" clearable value={email} onChangeText={setEmail} />
 * ```
 * @param variant - Visual variant of the input.
 * @param size - Size of the input.
 * @param borderRadius - Corner radius of the input.
 * @param color - Color family applied primarily to borders.
 * @param disabled - Whether the input is disabled.
 * @param startContent - Optional leading adornment.
 * @param endContent - Optional trailing adornment.
 * @param required - Whether the input is required.
 * @param baseClassName - Tailwind classes applied to the wrapper slot.
 * @param inputClassName - Tailwind classes applied to the `TextInput` slot.
 * @param clearButtonClassName - Tailwind classes applied to the clear button slot.
 * @param testID - Test identifier applied to the wrapper.
 * @see InputComponentProps
 * @see useInput
 */
export function Input({
  variant = "shadcn",
  size = "md",
  borderRadius = "md",
  color = "primary",
  disabled = false,
  startContent,
  endContent,
  required = false,
  baseClassName,
  inputClassName,
  clearButtonClassName,
  testID,
  ...textInputProps
}: InputComponentProps) {
  const {state, componentProps, inputProps, clearButtonProps} = useInput({
    variant,
    size,
    borderRadius,
    color,
    disabled,
    startContent,
    endContent,
    testID,
    ...textInputProps,
  });
  const {base, input, clearButton} = inputStyles({
    variant,
    size,
    borderRadius,
    color,
    disabled,
    focused: state.isFocused,
    showClear: state.showClear,
    required,
  });

  return (
    <View
      testID={testID}
      className={base({className: baseClassName})}
      {...componentProps}
    >
      {startContent ? <View>{startContent}</View> : null}
      <TextInput
        {...inputProps}
        {...textInputProps}
        testID="input-field"
        className={input({
          className: inputClassName || textInputProps.className,
        })}
      />
      <Pressable
        {...clearButtonProps}
        testID="input-clear-button"
        className={clearButton({className: clearButtonClassName})}
      >
        <XIcon size={16} />
      </Pressable>
      {endContent ? <View>{endContent}</View> : null}
    </View>
  );
}
