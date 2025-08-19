import React, {ComponentProps, RefAttributes, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import NativeSlider, {
  RangeSlider as NativeRangeSlider,
} from "@react-native-assets/slider";
import {tv} from "tailwind-variants";

type SliderVariants = {
  size?: "sm" | "md" | "lg";
  color?: "default" | "secondary" | "destructive" | "warning" | "success";
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
};

export type SliderProps = {
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
> &
  SliderVariants;

export type SliderReturn = {
  componentProps: ComponentProps<typeof NativeSlider>;
};

export type SliderThumbProps = ComponentProps<typeof TouchableOpacity> &
  RefAttributes<View> & {value: number} & SliderVariants;

export type SliderTrackProps = ComponentProps<typeof View> & {
  disabled: boolean;
} & SliderVariants;

export const slider = tv({
  slots: {
    track: "rounded-xl",
    thumb:
      "bg-background ring-ring shrink-0 border shadow-sm  hover:ring-4 focus-visible:ring-4",
  },
  variants: {
    size: {
      sm: {
        track: "h-1 w-full",
        thumb: "size-3",
      },
      md: {
        track: "h-1.5 w-full",
        thumb: "size-4",
      },
      lg: {
        track: "h-2 w-full",
        thumb: "size-5",
      },
    },
    borderRadius: {
      none: {
        thumb: "rounded-none",
      },
      sm: {
        thumb: "rounded-sm",
      },
      md: {
        thumb: "rounded-md",
      },
      lg: {
        thumb: "rounded-lg",
      },
      full: {
        thumb: "rounded-full",
      },
    },
    disabled: {
      true: {
        track: "opacity-50",
      },
    },
    orientation: {
      horizontal: {
        track: "w-full",
      },
      vertical: {
        track: "h-full",
      },
    },
    color: {
      default: {
        track: "bg-primary",
        thumb: "border-primary",
      },
      secondary: {
        track: "bg-secondary",
        thumb: "border-secondary",
      },
      destructive: {
        track: "bg-destructive",
        thumb: "border-destructive",
      },
      warning: {
        track: "bg-warning",
        thumb: "border-warning",
      },
      success: {
        track: "bg-success",
        thumb: "border-success",
      },
    },
  },
  defaultVariants: {
    size: "md",
    borderRadius: "full",
    orientation: "horizontal",
    color: "default",
  },
});

export function SliderThumb({
  size,
  borderRadius,
  color,
  ...props
}: SliderThumbProps) {
  const {thumb} = slider({size, borderRadius, color});

  return <TouchableOpacity className={thumb()} {...props} />;
}

export function SliderTrack({
  size,
  disabled,
  color,
  ...props
}: SliderTrackProps) {
  const {track} = slider({size, disabled, color});

  return <View className={track({color})} {...props} />;
}

export const useSlider = ({
  value,
  defaultValue,
  min,
  max,
  disabled,
  onValueChange,
  onValueCommit,
  step,
  inverted,
  orientation,
  accessibilityRole,
  accessibilityState,
  size,
  borderRadius,
  color,
  dir,
}: SliderProps): SliderReturn => {
  if (value !== undefined && defaultValue !== undefined) {
    throw new Error("Cannot set both value and defaultValue");
  }

  const isControlled = value !== undefined;
  const initialUncontrolled = defaultValue?.[0] ?? min;
  const [internalValue, setInternalValue] = useState<number>(
    initialUncontrolled || 0,
  );

  const currentValue = isControlled ? (value ? value[0] : min) : internalValue;

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

  return {
    componentProps: {
      value: currentValue,
      onValueChange: handleChange,
      onSlidingComplete: handleCommit,
      minimumValue: disabled ? currentValue : min,
      maximumValue: disabled ? currentValue : max,
      step,
      inverted,
      vertical: orientation === "vertical",
      accessibilityRole: accessibilityRole ?? "adjustable",
      accessibilityState: {...accessibilityState, disabled},
      dir,
      CustomTrack: () => (
        <SliderTrack size={size} disabled={disabled || false} color={color} />
      ),
      CustomThumb: (props: any) => (
        <SliderThumb
          size={size}
          borderRadius={borderRadius}
          color={color}
          {...props}
        />
      ),
    },
  };
};

export function Slider({testID, ...props}: SliderProps) {
  const {componentProps} = useSlider(props);
  return (
    <NativeSlider testID={testID} {...componentProps} {...(props as any)} />
  );
}

export function RangeSlider({testID, ...props}: SliderProps) {
  const {componentProps} = useSlider(props);
  return (
    <NativeRangeSlider
      testID={testID}
      {...componentProps}
      {...(props as any)}
    />
  );
}
