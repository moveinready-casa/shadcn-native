import {useColorScheme, View} from "react-native";
import React, {createContext, useEffect, useState} from "react";
import {vars} from "nativewind";

export const themes = {
  light: vars({
    "--background": "oklch(1 0 0)",
    "--foreground": "oklch(0.145 0 0)",
    "--card": "oklch(1 0 0)",
    "--card-foreground": "oklch(0.145 0 0)",
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.145 0 0)",
    "--primary": "oklch(0.205 0 0)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--secondary": "oklch(0.97 0 0)",
    "--secondary-foreground": "oklch(0.205 0 0)",
    "--muted": "oklch(0.97 0 0)",
    "--muted-foreground": "oklch(0.556 0 0)",
    "--accent": "oklch(0.97 0 0)",
    "--accent-foreground": "oklch(0.205 0 0)",
    "--destructive": "oklch(0.577 0.245 27.325)",
    "--border": "oklch(0.922 0 0)",
    "--input": "oklch(0.922 0 0)",
    "--ring": "oklch(0.708 0 0)",
    "--chart-1": "oklch(0.646 0.222 41.116)",
    "--chart-2": "oklch(0.6 0.118 184.704)",
    "--chart-3": "oklch(0.398 0.07 227.392)",
    "--chart-4": "oklch(0.828 0.189 84.429)",
    "--chart-5": "oklch(0.769 0.188 70.08)",
    "--sidebar": "oklch(0.985 0 0)",
    "--sidebar-foreground": "oklch(0.145 0 0)",
    "--sidebar-primary": "oklch(0.205 0 0)",
    "--sidebar-primary-foreground": "oklch(0.985 0 0)",
    "--sidebar-accent": "oklch(0.97 0 0)",
    "--sidebar-accent-foreground": "oklch(0.205 0 0)",
    "--sidebar-border": "oklch(0.922 0 0)",
    "--sidebar-ring": "oklch(0.708 0 0)",
    "--background-dark": "oklch(0.145 0 0)",
    "--foreground-dark": "oklch(0.985 0 0)",
  }),
  dark: vars({
    "--card-dark": "oklch(0.205 0 0)",
    "--card-foreground-dark": "oklch(0.985 0 0)",
    "--popover-dark": "oklch(0.269 0 0)",
    "--popover-foreground-dark": "oklch(0.985 0 0)",
    "--primary-dark": "oklch(0.922 0 0)",
    "--primary-foreground-dark": "oklch(0.205 0 0)",
    "--secondary-dark": "oklch(0.269 0 0)",
    "--secondary-foreground-dark": "oklch(0.985 0 0)",
    "--muted-dark": "oklch(0.269 0 0)",
    "--muted-foreground-dark": "oklch(0.708 0 0)",
    "--accent-dark": "oklch(0.371 0 0)",
    "--accent-foreground-dark": "oklch(0.985 0 0)",
    "--destructive-dark": "oklch(0.704 0.191 22.216)",
    "--border-dark": "oklch(1 0 0 / 10%)",
    "--input-dark": "oklch(1 0 0 / 15%)",
    "--ring-dark": "oklch(0.556 0 0)",
    "--chart-1-dark": "oklch(0.488 0.243 264.376)",
    "--chart-2-dark": "oklch(0.696 0.17 162.48)",
    "--chart-3-dark": "oklch(0.769 0.188 70.08)",
    "--chart-4-dark": "oklch(0.627 0.265 303.9)",
    "--chart-5-dark": "oklch(0.645 0.246 16.439)",
    "--sidebar": "oklch(0.205 0 0)",
    "--sidebar-foreground-dark": "oklch(0.985 0 0)",
    "--sidebar-primary-dark": "oklch(0.488 0.243 264.376)",
    "--sidebar-primary-foreground-dark": "oklch(0.985 0 0)",
    "--sidebar-accent-dark": "oklch(0.269 0 0)",
    "--sidebar-accent-foreground-dark": "oklch(0.985 0 0)",
    "--sidebar-border-dark": "oklch(1 0 0 / 10%)",
    "--sidebar-ring-dark": "oklch(0.439 0 0)",
  }),
};

type ThemeProps = {
  children: React.ReactNode;
  colorScheme?: "dark" | "light";
  setColorScheme?: (colorScheme: "dark" | "light") => void;
};

export const ThemeContext = createContext<{
  colorScheme: "dark" | "light";
  setColorScheme: (colorScheme: "dark" | "light") => void;
}>({
  colorScheme: "light",
  setColorScheme: () => {},
});

export default function Theme({
  children,
  colorScheme,
  setColorScheme,
}: ThemeProps) {
  const defaultColorScheme = useColorScheme();
  const [colorSchemeState, setColorSchemeState] = useState(
    colorScheme || defaultColorScheme || "light",
  );

  useEffect(() => {
    if (typeof setColorScheme === "function") {
      setColorScheme(colorSchemeState);
    }
  }, [colorSchemeState]);

  return (
    <ThemeContext.Provider
      value={{
        colorScheme: colorSchemeState,
        setColorScheme: setColorSchemeState,
      }}
    >
      <View style={themes[colorSchemeState]}>{children}</View>
    </ThemeContext.Provider>
  );
}
