import {useButton} from "@react-aria/button";
import {useFocusRing} from "@react-aria/focus";
import {XIcon} from "lucide-react-native";
import React, {
  ComponentProps,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {Platform, Pressable, TextInput, View} from "react-native";
import {tv} from "tailwind-variants";
import {ThemeContext} from "../theme";

export type InputProps = {
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  clearable?: boolean;
};

export type InputReturn = {
  state: {
    isFocused: boolean;
    setIsFocused: (isFocused: boolean) => void;
    showClear: boolean;
  };
  componentProps: ComponentProps<typeof View>;
  inputProps: ComponentProps<typeof TextInput>;
  clearButtonProps: ComponentProps<typeof Pressable>;
};

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

  // Filter out web-specific props for React Native compatibility
  const webButtonProps = Platform.OS === "web" ? buttonProps : {};
  const webFocusProps = Platform.OS === "web" ? focusProps : {};

  // Extract only React Native compatible props from web props
  const getCompatibleWebProps = (webProps: any) => {
    if (Platform.OS !== "web") return {};

    // Only include props that are safe for React Native
    const safeProps: any = {};
    if (webProps.className) safeProps.className = webProps.className;
    if (webProps.style) safeProps.style = webProps.style;
    if (webProps.testID) safeProps.testID = webProps.testID;

    return safeProps;
  };

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
      ...getCompatibleWebProps(webButtonProps),
      ...getCompatibleWebProps(webFocusProps),
    },
  };
};

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
  const {colorScheme} = useContext(ThemeContext);

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
        style={{color: colorScheme === "dark" ? "#fafafa" : "#0a0a0a"}}
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
