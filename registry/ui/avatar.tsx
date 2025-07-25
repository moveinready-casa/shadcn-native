import React, {
  ComponentProps,
  createContext,
  useContext,
  useState,
} from "react";
import {View, Text} from "react-native";
import {Image as ExpoImage, ImageProps as ExpoImageProps} from "expo-image";
import {tv} from "tailwind-variants";

/**
 * Possible loading statuses for the avatar image.
 */
export type AvatarStatus = "idle" | "loading" | "loaded" | "error";

/**
 * Context shape shared between Avatar parts.
 */
interface AvatarContextValue {
  status: AvatarStatus;
  setStatus: (status: AvatarStatus) => void;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

/**
 * Tailwind classes for the `Avatar` component.
 */
const avatar = tv({
  base: "relative overflow-hidden flex items-center justify-center bg-muted",
  variants: {
    size: {
      sm: "w-8 h-8 text-sm",
      md: "w-10 h-10 text-base",
      lg: "w-12 h-12 text-lg",
    },
    radius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    },
    isBordered: {
      true: "ring-2 ring-border",
    },
    isDisabled: {
      true: "opacity-50",
    },
  },
  defaultVariants: {
    size: "md",
    radius: "full",
    isBordered: false,
    isDisabled: false,
  },
});

/**
 * Tailwind classes for the `AvatarImage` component.
 */
const avatarImageStyles = tv({
  base: "size-full",
});

/**
 * Tailwind classes for the `AvatarFallback` component.
 */
const avatarFallbackStyles = tv({
  base: "absolute inset-0 flex items-center justify-center bg-muted/50",
});

export type AvatarProps = {
  /**
   * Custom tailwind classes applied to the root element. Takes precedence over the `className` prop.
   */
  baseClassName?: string;
  /** Avatar size */
  size?: "sm" | "md" | "lg";
  /** Border radius */
  radius?: "none" | "sm" | "md" | "lg" | "full";
  /** Adds a ring border */
  isBordered?: boolean;
  /** Disabled state */
  isDisabled?: boolean;
  /** Always show fallback even if image loads */
  showFallback?: boolean;
  /** If fallback children not provided use initials from name */
  name?: string;
  /** Icon node used as fallback when no name */
  icon?: React.ReactNode;
} & Omit<ComponentProps<typeof View>, "children"> & {
    children: React.ReactNode;
  };

/**
 * Root Avatar component. Handles image loading state and renders its children.
 */
export function Avatar({
  children,
  baseClassName,
  size = "md",
  radius = "full",
  isBordered = false,
  isDisabled = false,
  ...props
}: AvatarProps) {
  const [status, setStatus] = useState<AvatarStatus>("idle");

  const className = avatar({
    size,
    radius,
    isBordered,
    isDisabled,
    className: baseClassName || props.className,
  });

  return (
    <AvatarContext.Provider value={{status, setStatus}}>
      <View
        {...props}
        className={className}
        accessibilityState={{disabled: isDisabled}}
      >
        {children}
      </View>
    </AvatarContext.Provider>
  );
}

export type AvatarImageProps = {
  /**
   * Custom tailwind classes applied to the image element. Takes precedence over the `className` prop.
   */
  baseClassName?: string;
} & ExpoImageProps;

/**
 * The image element for the Avatar. Automatically reports its load/error status to the parent.
 */
export function AvatarImage({
  baseClassName,
  onLoad,
  onError,
  ...props
}: AvatarImageProps) {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error("AvatarImage must be used within an Avatar");
  }

  const {setStatus} = context;

  const className = avatarImageStyles({
    className: baseClassName || props.className,
  });

  return (
    <ExpoImage
      {...props}
      className={className}
      onLoad={(e) => {
        setStatus("loaded");
        if (typeof onLoad === "function") onLoad(e);
      }}
      onError={(e) => {
        setStatus("error");
        if (typeof onError === "function") onError(e);
      }}
      transition={props.transition ?? 300}
      placeholder={props.placeholder ?? "blur"}
    />
  );
}

export type AvatarFallbackProps = {
  /**
   * Custom tailwind classes applied to the fallback element. Takes precedence over the `className` prop.
   */
  baseClassName?: string;
  /** Always render even after image loads */
  showFallback?: boolean;
} & Omit<ComponentProps<typeof View>, "children"> & {
    children: React.ReactNode;
  };

/**
 * Fallback element rendered when the image is not available or fails to load.
 */
export function AvatarFallback({
  children,
  baseClassName,
  name,
  icon,
  ...props
}: AvatarFallbackProps & {name?: string; icon?: React.ReactNode}) {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error("AvatarFallback must be used within an Avatar");
  }

  const {status} = context;

  if (status === "loaded" && !props.showFallback) {
    return null;
  }

  const className = avatarFallbackStyles({
    className: baseClassName || props.className,
  });

  let content: React.ReactNode = children;

  if (!content) {
    if (name) {
      const initials = name
        .split(" ")
        .map((w) => w.charAt(0))
        .join("")
        .toUpperCase();
      content = <Text>{initials}</Text>;
    } else if (icon) {
      content = icon;
    }
  }

  return (
    <View {...props} className={className}>
      {content}
    </View>
  );
}
