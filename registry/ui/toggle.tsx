import React, {
  ComponentProps,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {Platform, Pressable} from "react-native";
import {AriaToggleButtonProps, useToggleButton} from "@react-aria/button";
import {tv} from "tailwind-variants";

/**
 * Base props for the Toggle component and the useToggle hook.
 * Aligns with Radix Toggle API: pressed, defaultPressed, onPressedChange, disabled, asChild.
 * @param pressed Controlled pressed state.
 * @param defaultPressed Uncontrolled initial pressed state.
 * @param onPressedChange Callback fired when the pressed state should change.
 * @param disabled Disables the toggle.
 * @param asChild Render prop to clone styles/props into child.
 * @param variant Visual variant.
 * @param size Size variant.
 * @param className Tailwind className.
 * @param children Children content.
 * @param aria-label Web aria-label mapping support.
 * @param testID RN test identifier
 */
export type ToggleProps = {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  asChild?: boolean;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
  children?: ReactNode;
  "aria-label"?: string;
  testID?: string;
} & Omit<
  AriaToggleButtonProps,
  "isSelected" | "defaultSelected" | "onChange" | "isDisabled"
> &
  ComponentProps<typeof Pressable>;

export type ToggleReturn = {
  props: ComponentProps<typeof Pressable>;
  state: {
    isPressed: boolean;
  };
};

/**
 * Hook that manages pressed state and accessibility for a Toggle.
 * - Web: integrates React Aria useToggleButton for a11y.
 * - Native: provides accessibilityRole/state and onPress behavior.
 * @param pressed Controlled pressed state.
 * @param defaultPressed Uncontrolled initial pressed state.
 * @param onPressedChange Callback fired when the pressed state should change.
 * @param disabled Disables the toggle.
 * @param onPress Custom onPress handler.
 * @param props Additional props to pass through.
 */
export const useToggle = ({
  pressed,
  defaultPressed,
  onPressedChange,
  disabled,
  onPress,
  ...props
}: ToggleProps): ToggleReturn => {
  const isControlled = pressed !== undefined;
  const [internalPressed, setInternalPressed] =
    useState<boolean>(!!defaultPressed);
  const currentPressed = isControlled ? !!pressed : internalPressed;

  const mounted = useRef(false);
  useEffect(() => {
    if (!isControlled) {
      if (mounted.current) {
        onPressedChange?.(currentPressed);
      } else {
        mounted.current = true;
      }
    }
  }, [currentPressed, isControlled, onPressedChange]);

  const buttonRef = useRef(null);

  const webAriaProps = useToggleButton(
    {...props},
    {
      isSelected: currentPressed,
      setSelected: (next) => {
        if (!isControlled) {
          setInternalPressed(next);
        }
      },
      toggle: () => {
        if (!isControlled) {
          setInternalPressed((p) => !p);
        }
      },
    },
    buttonRef,
  );

  const handlePress = (event: any) => {
    if (disabled) return;

    const next = !currentPressed;

    onPress?.(event);

    if (isControlled) {
      onPressedChange?.(next);
    }

    if (!isControlled) setInternalPressed(next);
  };

  return {
    state: {isPressed: currentPressed},
    props: {
      ...(Platform.OS === "web" ? webAriaProps : {}),
      ...props,
      onPress: handlePress,
      accessibilityRole: "button",
      accessibilityState: {selected: currentPressed, disabled: !!disabled},
      accessible: true,
      ...(props["aria-label"] ? {accessibilityLabel: props["aria-label"]} : {}),
      ref: buttonRef,
    },
  };
};

/**
 * Tailwind variants for the Toggle component (shadcn parity).
 */
export const toggle = tv({
  base: "items-center justify-center gap-2 rounded-md text-foreground text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  variants: {
    variant: {
      default: "bg-transparent",
      outline:
        "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
    },
    size: {
      default: "h-9 px-2 min-w-9",
      sm: "h-8 px-1.5 min-w-8",
      lg: "h-10 px-2.5 min-w-10",
    },
    selected: {
      true: "bg-accent text-accent-foreground",
    },
    disabled: {
      true: "opacity-50",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type ToggleComponentProps = ToggleProps &
  ComponentProps<typeof Pressable>;

/**
 * A two-state button that can be either on or off.
 * @param props - Props for the `Toggle` @see {@link ToggleProps}
 */
export function Toggle({
  pressed,
  defaultPressed,
  onPressedChange,
  disabled = false,
  asChild = false,
  variant = "default",
  size = "default",
  className,
  children,
  testID,
  ...props
}: ToggleComponentProps) {
  const {props: ariaProps, state} = useToggle({
    pressed,
    defaultPressed,
    onPressedChange,
    disabled,
    ...props,
  });

  const classNames = toggle({
    variant,
    size,
    selected: state.isPressed,
    disabled,
    className,
  });

  const baseRenderProps = {
    ...props,
    ...ariaProps,
    className: classNames,
  };

  const renderProps =
    testID !== undefined ? {...baseRenderProps, testID} : baseRenderProps;

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<any>,
      renderProps,
    )
  ) : (
    <Pressable {...renderProps}>{children}</Pressable>
  );
}
