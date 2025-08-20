import React, {ComponentProps, RefAttributes, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import NativeSlider, {
  RangeSlider as NativeRangeSlider,
} from "@react-native-assets/slider";
import {tv} from "tailwind-variants";

/**
 * Variant types for the slider component.
 * @param size - The size of the slider track and thumb.
 * @param color - The color theme of the slider.
 * @param borderRadius - The border radius of the slider thumb.
 */
type SliderVariants = {
  size?: "sm" | "md" | "lg";
  color?: "default" | "secondary" | "destructive" | "warning" | "success";
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
};

/**
 * Base props for the `Slider` component, hook, and related components.
 * @param defaultValue - Uncontrolled default value of the slider.
 * @param value - Controlled value of the slider.
 * @param onValueChange - Callback function called when the slider value changes.
 * @param onValueCommit - Callback function called when the slider value is committed.
 * @param name - The name attribute of the slider.
 * @param disabled - Whether the slider is disabled.
 * @param orientation - The orientation of the slider.
 * @param dir - The direction of the slider (left-to-right or right-to-left).
 * @param inverted - Whether the slider is inverted.
 * @param min - The minimum value of the slider.
 * @param max - The maximum value of the slider.
 * @param step - The step increment of the slider.
 * @param minStepsBetweenThumbs - The minimum number of steps between thumbs for range sliders.
 * @param form - The form attribute of the slider.
 * @see SliderVariants
 * @see ComponentProps
 */
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

/**
 * Return type for the `useSlider` hook.
 * @param componentProps - Props to pass to the slider component.
 */
export type SliderReturn = {
  componentProps: ComponentProps<typeof NativeSlider>;
};

/**
 * Props for the `SliderThumb` component.
 * @param value - The current value of the slider thumb.
 * @see SliderVariants
 * @see ComponentProps
 * @see RefAttributes
 */
export type SliderThumbProps = ComponentProps<typeof TouchableOpacity> &
  RefAttributes<View> & {value: number} & SliderVariants;

/**
 * Props for the `SliderTrack` component.
 * @param disabled - Whether the slider track is disabled.
 * @see SliderVariants
 * @see ComponentProps
 */
export type SliderTrackProps = ComponentProps<typeof View> & {
  disabled: boolean;
} & SliderVariants;

/**
 * Conditional classes for the slider component.
 * It includes the following slots:
 * - track: The track styles for the slider.
 * - thumb: The thumb styles for the slider.
 * @see SliderVariants
 */
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

/**
 * The slider thumb component. This component is used to render the draggable thumb of the slider.
 * @param param0 - Props to configure the behavior and appearance of the slider thumb. @see SliderThumbProps
 * @returns Returns a `TouchableOpacity` which represents the slider thumb.
 */
export function SliderThumb({
  size,
  borderRadius,
  color,
  ...props
}: SliderThumbProps) {
  const {thumb} = slider({size, borderRadius, color});

  return <TouchableOpacity className={thumb()} {...props} />;
}

/**
 * The slider track component. This component is used to render the track of the slider.
 * @param param0 - Props to configure the behavior and appearance of the slider track. @see SliderTrackProps
 * @returns Returns a `View` which represents the slider track.
 */
export function SliderTrack({
  size,
  disabled,
  color,
  ...props
}: SliderTrackProps) {
  const {track} = slider({size, disabled, color});

  return <View className={track({color})} {...props} />;
}

/**
 * The use slider hook is the backbone of the slider component.
 * @param param0 - Props to configure the behavior of the slider. @see SliderProps
 * @returns Returns the props to pass to the slider component. @see SliderReturn
 */
export const useSlider = ({
  defaultValue,
  value,
  onValueChange,
  onValueCommit,
  disabled = false,
  orientation = "horizontal",
  dir,
  inverted = false,
  min = 0,
  max = 100,
  step = 1,
  accessibilityRole,
  accessibilityState,
  size,
  borderRadius,
  color,
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
      CustomTrack: (props) => (
        <SliderTrack
          {...props}
          size={size}
          disabled={disabled || false}
          color={color}
        />
      ),
      CustomThumb: (props) => (
        <SliderThumb
          {...props}
          size={size}
          borderRadius={borderRadius}
          color={color}
        />
      ),
    },
  };
};

/**
 * The slider component. This component is used to render a single-value slider.
 * @param param0 - Props to configure the behavior and appearance of the slider. @see SliderProps
 * @returns Returns a `NativeSlider` component with the configured props and custom track/thumb components.
 */
export function Slider({testID, ...props}: SliderProps) {
  const {componentProps} = useSlider(props);
  console.log(componentProps);
  return (
    <NativeSlider testID={testID} {...componentProps} {...(props as any)} />
  );
}

/**
 * The range slider component. This component is used to render a range slider with two thumbs.
 * @param param0 - Props to configure the behavior and appearance of the range slider. @see SliderProps
 * @returns Returns a `NativeRangeSlider` component with the configured props and custom track/thumb components.
 */
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
