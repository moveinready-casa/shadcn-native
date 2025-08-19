import {useColorScheme, View} from "react-native";
import React, {createContext, useEffect, useState} from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider} from "react-native-safe-area-context";

import {vars} from "nativewind";

export const themes = {
  base: vars({
    "--radius": "0.625rem",
  }),
  light: vars({
    "--background": "#ffffff",
    "--foreground": "#252525",
    "--card": "#ffffff",
    "--card-foreground": "#252525",
    "--popover": "#ffffff",
    "--popover-foreground": "#252525",
    "--primary": "#343434",
    "--primary-foreground": "#fbfbfb",
    "--secondary": "#f7f7f7",
    "--secondary-foreground": "#343434",
    "--success": "#22c55e",
    "--warning": "#eab308",
    "--muted": "#f7f7f7",
    "--muted-foreground": "#8e8e8e",
    "--accent": "#f7f7f7",
    "--accent-foreground": "#343434",
    "--destructive": "#ef4444",
    "--border": "#ebebeb",
    "--input": "#ebebeb",
    "--ring": "#b5b5b5",
    "--chart-1": "#f97316",
    "--chart-2": "#06b6d4",
    "--chart-3": "#3b82f6",
    "--chart-4": "#84cc16",
    "--chart-5": "#f59e0b",
    "--sidebar": "#fbfbfb",
    "--sidebar-foreground": "#252525",
    "--sidebar-primary": "#343434",
    "--sidebar-primary-foreground": "#fbfbfb",
    "--sidebar-accent": "#f7f7f7",
    "--sidebar-accent-foreground": "#343434",
    "--sidebar-border": "#ebebeb",
    "--sidebar-ring": "#b5b5b5",
  }),
  dark: vars({
    "--background": "#252525",
    "--foreground": "#fbfbfb",
    "--card": "#343434",
    "--card-foreground": "#fbfbfb",
    "--popover": "#444444",
    "--popover-foreground": "#fbfbfb",
    "--primary": "#ebebeb",
    "--primary-foreground": "#343434",
    "--secondary": "#444444",
    "--secondary-foreground": "#fbfbfb",
    "--muted": "#444444",
    "--muted-foreground": "#b5b5b5",
    "--accent": "#5f5f5f",
    "--accent-foreground": "#fbfbfb",
    "--destructive": "#dc2626",
    "--success": "#16a34a",
    "--warning": "#ca8a04",
    "--border": "rgba(255, 255, 255, 0.1)",
    "--input": "rgba(255, 255, 255, 0.15)",
    "--ring": "#8e8e8e",
    "--chart-1": "#8b5cf6",
    "--chart-2": "#10b981",
    "--chart-3": "#f59e0b",
    "--chart-4": "#ec4899",
    "--chart-5": "#dc2626",
    "--sidebar": "#343434",
    "--sidebar-foreground": "#fbfbfb",
    "--sidebar-primary": "#8b5cf6",
    "--sidebar-primary-foreground": "#fbfbfb",
    "--sidebar-accent": "#444444",
    "--sidebar-accent-foreground": "#fbfbfb",
    "--sidebar-border": "rgba(255, 255, 255, 0.1)",
    "--sidebar-ring": "#707070",
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
  const [colorSchemeState, setColorSchemeState] = useState(defaultColorScheme);

  useEffect(() => {
    if (colorScheme) {
      setColorSchemeState(colorScheme);
    }
  }, [colorScheme]);

  useEffect(() => {
    if (typeof setColorScheme === "function") {
      setColorScheme(colorSchemeState || "light");
    }
  }, [colorSchemeState]);

  return (
    <ThemeContext.Provider
      value={{
        colorScheme: colorSchemeState || "light",
        setColorScheme: setColorSchemeState,
      }}
    >
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <View
            style={{...themes.base, ...themes[colorSchemeState || "light"]}}
          >
            {children}
          </View>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}
