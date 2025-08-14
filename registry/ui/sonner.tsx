import {ComponentProps} from "react";
import {Toaster as SonnerNative, toast as toastNative} from "sonner-native";
import {Toaster as SonnerWeb, toast as toastWeb} from "sonner";
import tw from "twrnc";
import {Platform, StyleProp} from "react-native";

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

export function Toaster({...props}: ComponentProps<typeof SonnerWeb>) {
  return Platform.OS === "web" ? (
    <ToasterWeb {...props} />
  ) : (
    <ToasterNative {...(props as ComponentProps<typeof SonnerNative>)} />
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
  (message: string, ...rest: any[]): any;
} & {
  [K in ToastMethodName]: (...args: any[]) => any;
};

export const toast: Toast = ((message: string, ...rest: any[]) => {
  if (Platform.OS === "web") {
    return (toastWeb as any)(message, ...rest);
  }
  return (toastNative as any)(message, ...rest);
}) as Toast;

methods.forEach((method) => {
  (toast as any)[method] = (...args: any[]) => {
    if (Platform.OS === "web") {
      return (toastWeb as any)[method]?.(...args);
    }
    return (toastNative as any)[method]?.(...args);
  };
});
