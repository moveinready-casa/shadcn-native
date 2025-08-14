// TODO: refactor
let test: any= "";

import React, {ComponentProps, useMemo, useState} from "react";
import {Platform} from "react-native";
import NativeSlider from "@react-native-community/slider";
import {tv} from "tailwind-variants";

export type SliderProps = {
  asChild?: boolean;
  defaultValue?: number[];
  value?: number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  name?: string;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  dir?: "ltr" | "rtl";
  inverted?: boolean;
  min?: number;
  max?: number;
  step?: number;
  minStepsBetweenThumbs?: number;
  form?: string;
  baseClassName?: string;
} & Omit<
  ComponentProps<typeof NativeSlider>,
  | "value"
  | "onValueChange"
  | "onSlidingComplete"
  | "minimumValue"
  | "maximumValue"
  | "disabled"
  | "inverted"
  | "step"
  | "vertical"
>;

export const sliderVariants = tv({
  base: "w-full",
  variants: {
    disabled: {
      true: "opacity-50",
    },
    orientation: {
      horizontal: "",
      vertical: "",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export function Slider({
  defaultValue,
  value,
  onValueChange,
  onValueCommit,
  name,
  disabled = false,
  orientation = "horizontal",
  dir,
  inverted = false,
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenThumbs,
  form,
  baseClassName,
  className,
  accessibilityRole,
  accessibilityState,
  testID,
  ...rest
}: SliderProps) {
  if (value !== undefined && defaultValue !== undefined) {
    throw new Error("Cannot set both value and defaultValue");
  }

  const isControlled = value !== undefined;
  const initialUncontrolled = defaultValue?.[0] ?? min;
  const [internalValue, setInternalValue] =
    useState<number>(initialUncontrolled);

  const currentValue = isControlled ? (value ? value[0] : min) : internalValue;

  const computedClassName = useMemo(
    () =>
      sliderVariants({
        disabled,
        orientation,
        className: baseClassName || className,
      }),
    [disabled, orientation, baseClassName, className],
  );

  const handleChange = (next: number) => {
    if (!disabled) {
      if (!isControlled) {
        setInternalValue(next);
      }
      if (typeof onValueChange === "function") {
        onValueChange([next]);
      }
    }
  };

  const handleCommit = (next: number) => {
    if (!disabled && typeof onValueCommit === "function") {
      onValueCommit([next]);
    }
  };

  type ExtraAttributes = {
    orientation?: "horizontal" | "vertical";
    dir?: "ltr" | "rtl";
    name?: string;
    form?: string;
    minStepsBetweenThumbs?: number;
    className?: string;
  };

  const SliderBase = NativeSlider as unknown as React.ComponentType<
    ComponentProps<typeof NativeSlider> & ExtraAttributes
  >;

  return (
    <SliderBase
      testID={testID}
      value={currentValue}
      onValueChange={handleChange}
      onSlidingComplete={handleCommit}
      minimumValue={min}
      maximumValue={max}
      step={step}
      disabled={disabled}
      inverted={inverted}
      // Windows-only prop; harmless elsewhere
      vertical={orientation === "vertical"}
      accessibilityRole={accessibilityRole ?? "adjustable"}
      accessibilityState={{...accessibilityState, disabled}}
      // Forward non-native props for testing and composition semantics
      orientation={orientation}
      dir={dir}
      name={name}
      form={form}
      minStepsBetweenThumbs={minStepsBetweenThumbs}
      className={computedClassName}
      // Web ARIA parity if running on web
      {...(Platform.OS === "web"
        ? {
            role: "slider",
            "aria-valuemin": min,
            "aria-valuemax": max,
            "aria-valuenow": currentValue,
            "aria-orientation": orientation,
          }
        : {})}
      {...rest}
    />
  );
}

export default Slider;
