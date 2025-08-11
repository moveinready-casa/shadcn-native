import React, {ComponentProps, useContext, useEffect} from "react";
import {Platform, View} from "react-native";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {tv} from "tailwind-variants";
import {ThemeContext} from "../theme";

export type ProgressProps = {
  value?: number | null;
  max?: number;
  getValueLabel?: (value: number | null, max?: number) => string;
};

export type UseProgressReturn = {
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
  reanimatedProps: Pick<
    React.ComponentProps<typeof Reanimated.View>,
    "style" | "animatedProps"
  >;
};

export type ProgressComponentProps = {
  baseClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "success" | "warning" | "destructive";
} & ProgressProps &
  Omit<ComponentProps<typeof View>, "children">;

const defaultMin = 0;
const defaultMax = 100;

export const useProgress = ({
  value,
  max,
  getValueLabel,
}: ProgressProps): UseProgressReturn => {
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
  const {colorScheme} = useContext(ThemeContext);

  const colors = {
    light: {
      primary: "#171717",
      success: "#166634",
      warning: "#ebb517",
      destructive: "#e7000b",
    },
    dark: {
      primary: "#e5e5e5",
      success: "#20c45f",
      warning: "#ffe141",
      destructive: "#ff6467",
    },
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
            backgroundColor:
              colorScheme === "dark" ? colors.dark[color] : colors.light[color],
          },
        ]}
      />
    </View>
  );
}

export default Progress;
