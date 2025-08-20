import {ComponentProps, useContext} from "react";
import {Toaster as SonnerNative, toast as toastNative} from "sonner-native";
import {Toaster as SonnerWeb, toast as toastWeb} from "sonner";
import tw from "twrnc";
import {Platform, StyleProp} from "react-native";
import {ThemeContext} from "../theme";

function ToasterNative({...props}: ComponentProps<typeof SonnerNative>) {
  return (
    <SonnerNative
      {...props}
      style={tw.style("bg-popover text-popover-foreground border-border")}
    />
  );
}

function ToasterWeb({...props}: ComponentProps<typeof SonnerWeb>) {
  return (
    <SonnerWeb
      {...props}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as StyleProp<any>
      }
    />
  );
}

/**
 * Toaster component that uses the appropriate platform-specific implementation.
 * @param props - The props for the Toaster component.
 */
export function Toaster({...props}: ComponentProps<typeof SonnerWeb>) {
  const {colorScheme} = useContext(ThemeContext);
  return Platform.OS === "web" ? (
    <ToasterWeb {...props} theme={colorScheme} />
  ) : (
    <ToasterNative
      {...(props as ComponentProps<typeof SonnerNative>)}
      theme={colorScheme}
    />
  );
}

const methods = [
  "success",
  "error",
  "warning",
  "info",
  "custom",
  "promise",
  "message",
  "getHistory",
  "getToasts",
] as const;

type ToastMethodName = (typeof methods)[number];

type Toast = {
  (message: string, ...props: any[]): any;
} & {
  [K in ToastMethodName]: (...args: any[]) => any;
};

/**
 * Toast function that uses the appropriate platform-specific implementation to show a toast.
 * @param message - The message to toast.
 * @param props - The props of the arguments to pass to the toast function.
 * @returns The toast function.
 */
export const toast: Toast = ((message: string, ...props: any[]) => {
  if (Platform.OS === "web") {
    return (toastWeb as any)(message, ...props);
  }
  return (toastNative as any)(message, ...props);
}) as Toast;

methods.forEach((method) => {
  (toast as any)[method] = (...args: any[]) => {
    if (Platform.OS === "web") {
      return (toastWeb as any)[method]?.(...args);
    }
    return (toastNative as any)[method]?.(...args);
  };
});
