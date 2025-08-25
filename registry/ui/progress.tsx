import {useTheme} from "@/lib/utils/theme";
import React, {ComponentProps, useEffect} from "react";
import {Platform, View} from "react-native";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {tv} from "tailwind-variants";

/**
 * Base props for the root `Progress` component and hook.
 * @param value - Current progress value from 0–100. Use `null` to render an indeterminate progress.
 * @param max - The maximum value representing 100%. If omitted, accessibility attributes still expose `min` and `now`.
 * @param getValueLabel - Function that produces the accessible text for the progress value. Receives `(value, max)`.
 */
export type ProgressProps = {
  value?: number | null;
  max?: number;
  getValueLabel?: (value: number | null, max?: number) => string;
};

/**
 * Return type for the `useProgress` hook.
 * @param componentProps - Accessibility props to spread on the progress root.
 * @param reanimatedProps - Animated props and styles for the progress fill element.
 */
export type ProgressReturn = {
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
  reanimatedProps: Pick<
    React.ComponentProps<typeof Reanimated.View>,
    "style" | "animatedProps"
  >;
};

/**
 * Props for the `Progress` component.
 * @param baseClassName - Tailwind classes to apply to the track. Takes priority over `className`.
 * @param size - Visual height of the track: `sm`, `md`, `lg`, or `xl`.
 * @param color - Semantic color for the fill, mapped via theme to hex values.
 * @see ProgressProps
 */
export type ProgressComponentProps = {
  baseClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "success" | "warning" | "destructive";
} & ProgressProps &
  Omit<ComponentProps<typeof View>, "children">;

const defaultMin = 0;
const defaultMax = 100;

/**
 * The `useProgress` hook provides accessibility props and animated styles for the progress component.
 * @param param0 - Hook configuration. @see ProgressProps
 * @returns Returns both the accessibility props for the track and reanimated props for the fill. @see UseProgressReturn
 */
export const useProgress = ({
  value,
  max,
  getValueLabel,
}: ProgressProps): ProgressReturn => {
  const computeText = (): string | undefined => {
    if (typeof getValueLabel === "function") {
      return getValueLabel(value ?? null, max);
    }
    return `${Math.round((value || defaultMin / (max || defaultMax)) * 100)}%`;
  };

  const a11yValue: ComponentProps<typeof View>["accessibilityValue"] =
    value === null
      ? {min: defaultMin, max: max, text: computeText()}
      : {
          min: defaultMin,
          max: max,
          now: value,
          text: computeText(),
        };

  const componentProps: ComponentProps<typeof View> | HTMLDivElement = {
    accessibilityRole: "progressbar",
    accessibilityValue: a11yValue,
    accessibilityState: value == null ? {busy: true} : undefined,
    ...(Platform.OS === "web"
      ? {
          role: "progressbar",
          "aria-valuemin": a11yValue.min,
          "aria-valuemax": a11yValue.max,
          ...(value === null ? {} : {"aria-valuenow": a11yValue.now}),
          ...(a11yValue.text ? {"aria-valuetext": a11yValue.text} : {}),
          ...(value == null ? {"aria-busy": true} : {}),
        }
      : {}),
  };

  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withTiming(value || 0);
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
    height: "100%",
    overflow: "hidden",
  }));

  return {
    componentProps,
    reanimatedProps: {
      style: animatedStyle,
    },
  };
};

/**
 * Conditional classes for the progress track container.
 * Includes size variants for `sm`, `md`, `lg`, and `xl`.
 */
export const progress = tv({
  slots: {
    track: "relative overflow-hidden rounded-xl bg-secondary",
  },
  variants: {
    size: {
      sm: {
        track: "h-1.5",
      },
      md: {
        track: "h-2",
      },
      lg: {
        track: "h-3",
      },
      xl: {
        track: "h-4",
      },
    },
  },
  defaultVariants: {
    size: "md",
    color: "primary",
  },
});

/**
 * The progress component with accessibility and animated fill support.
 * @param param0 - Component configuration and view props. @see ProgressComponentProps
 * @returns Returns a track `View` with an animated fill `Reanimated.View`.
 */
export function Progress({
  baseClassName,
  size = "md",
  color = "primary",
  value,
  max,
  getValueLabel,
  className,
  testID,
  ...rest
}: ProgressComponentProps) {
  const {componentProps, reanimatedProps} = useProgress({
    value,
    max,
    getValueLabel,
  });

  const {track} = progress();

  const trackClassName = track({size, className: baseClassName || className});
  const currentTheme = useTheme();

  const colors = {
    primary: currentTheme.primary,
    success: currentTheme.success,
    warning: currentTheme.warning,
    destructive: currentTheme.destructive,
  };

  return (
    <View
      testID={testID}
      {...componentProps}
      {...rest}
      className={trackClassName}
    >
      <Reanimated.View
        style={[
          reanimatedProps.style,
          {
            backgroundColor: colors[color],
          },
        ]}
      />
    </View>
  );
}

export default Progress;
