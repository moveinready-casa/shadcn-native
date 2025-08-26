import {ComponentProps, lazy, Suspense} from "react";
import {Platform, StyleProp, useColorScheme} from "react-native";
import tw from "twrnc";

const SonnerNative = lazy(() =>
  import("sonner-native").then((module) => ({default: module.Toaster})),
);
const SonnerWeb = lazy(() =>
  import("sonner").then((module) => ({default: module.Toaster})),
);

const getToastNative = () =>
  import("sonner-native").then((module) => module.toast);
const getToastWeb = () => import("sonner").then((module) => module.toast);

function ToasterNative({...props}: ComponentProps<any>) {
  return (
    <Suspense fallback={null}>
      <SonnerNative
        {...props}
        style={tw.style("bg-popover text-popover-foreground border-border")}
      />
    </Suspense>
  );
}

function ToasterWeb({...props}: ComponentProps<any>) {
  return (
    <Suspense fallback={null}>
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
    </Suspense>
  );
}

/**
 * Toaster component that uses the appropriate platform-specific implementation.
 * @param props - The props for the Toaster component.
 */
export function Toaster({...props}: ComponentProps<any>) {
  const colorScheme = useColorScheme();
  return Platform.OS === "web" ? (
    <ToasterWeb {...props} theme={colorScheme || "light"} />
  ) : (
    <ToasterNative
      {...(props as ComponentProps<any>)}
      theme={colorScheme || "light"}
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
    return getToastWeb().then((toastWeb) =>
      (toastWeb as any)(message, ...props),
    );
  }
  return getToastNative().then((toastNative) =>
    (toastNative as any)(message, ...props),
  );
}) as Toast;

methods.forEach((method) => {
  (toast as any)[method] = (...args: any[]) => {
    if (Platform.OS === "web") {
      return getToastWeb().then((toastWeb) =>
        (toastWeb as any)[method]?.(...args),
      );
    }
    return getToastNative().then((toastNative) =>
      (toastNative as any)[method]?.(...args),
    );
  };
});
