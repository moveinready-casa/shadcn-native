import React, {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {Image, ImageProps, ImageURISource, Text, View} from "react-native";
import {tv} from "tailwind-variants";

/**
 * Possible loading statuses for the avatar image.
 * - idle: no image source provided
 * - loading: image is loading
 * - loaded: image loaded successfully
 * - error: image failed to load
 */
export type AvatarStatus = "idle" | "loading" | "loaded" | "error";

/**
 * Context shape shared between Avatar parts.
 */
export type AvatarContextValue = {
  status: AvatarStatus;
  setStatus: (status: AvatarStatus) => void;
};

/**
 * Props for the `Avatar` component.
 * @param baseClassName - Custom tailwind classes applied to the root element. Takes precedence over the `className` prop.
 * @param size - Avatar size
 * @param radius - Border radius
 * @param isBordered - Adds a ring border
 * @param isDisabled - Disabled state
 */
export type AvatarComponentProps = {
  baseClassName?: string;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  variant?: "shadcn" | "warning" | "error" | "success";
  isBordered?: boolean;
  isDisabled?: boolean;
} & ComponentProps<typeof View>;

/**
 * Props for the `AvatarImage` component.
 * @param baseClassName - Custom tailwind classes applied to the image element. Takes precedence over the `className` prop.
 */
export type AvatarImageComponentProps = {
  baseClassName?: string;
} & ImageProps;

/**
 * Props for the `AvatarFallback` component.
 * @param baseClassName - Custom tailwind classes applied to the fallback element. Takes precedence over the `className` prop.
 */
export type AvatarFallbackComponentProps = {
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof View>;

export const AvatarContext = createContext<AvatarContextValue | null>(null);

/**
 * Tailwind classes for the `Avatar` component.
 */
export const avatar = tv({
  base: "relative overflow-hidden flex items-center justify-center",
  variants: {
    variant: {
      shadcn: "bg-muted",
      warning: "bg-warning",
      error: "bg-destructive",
      success: "bg-success",
    },
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
      true: "border-2 border-border",
    },
    isDisabled: {
      true: "opacity-50",
    },
  },
  compoundVariants: [
    {
      variant: "warning",
      isBordered: true,
      className: "bg-transparent border-2 border-warning",
    },
    {
      variant: "success",
      isBordered: true,
      className: "bg-transparent border-2 border-success",
    },
    {
      variant: "error",
      isBordered: true,
      className: "bg-transparent border-2 border-destructive",
    },
  ],
  defaultVariants: {
    variant: "shadcn",
    size: "md",
    radius: "full",
    isBordered: false,
    isDisabled: false,
  },
});

/**
 * Tailwind classes for the `AvatarImage` component.
 */
export const avatarImageStyles = tv({
  base: "size-full transition-opacity duration-500 opacity-0",
  variants: {
    isLoaded: {
      true: "opacity-100",
    },
  },
  defaultVariants: {
    isLoaded: false,
  },
});

/**
 * Tailwind classes for the `AvatarFallback` component.
 */
export const avatarFallbackStyles = tv({
  base: "absolute inset-0 flex items-center justify-center bg-transparent z-1",
});

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
  variant = "shadcn",
  ...props
}: AvatarComponentProps) {
  const [status, setStatus] = useState<AvatarStatus>("idle");

  const className = avatar({
    size,
    radius,
    isBordered,
    isDisabled,
    variant,
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

/**
 * The image element for the Avatar. Automatically reports its load/error status to the parent.
 */
export function AvatarImage({
  baseClassName,
  onLoad,
  onError,
  ...props
}: AvatarImageComponentProps) {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error("AvatarImage must be used within an Avatar");
  }

  const {setStatus, status} = context;

  const className = avatarImageStyles({
    className: baseClassName || props.className,
    isLoaded: status === "loaded",
  });

  const hasValidSource =
    !!props.source &&
    (typeof props.source === "number" ||
      (typeof props.source === "object" &&
        !!(props.source as ImageURISource).uri));

  useEffect(() => {
    if (!hasValidSource) {
      setStatus("error");
    } else {
      setStatus("loading");
    }
  }, []);

  return (
    <Image
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
    />
  );
}

/**
 * Fallback element rendered when the image is not available or fails to load.
 */
export function AvatarFallback({
  children,
  baseClassName,
  asChild,
  ...props
}: AvatarFallbackComponentProps) {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error("AvatarFallback must be used within an Avatar");
  }

  const {status} = context;

  if (status !== "error") {
    return null;
  }

  const className = avatarFallbackStyles({
    className: baseClassName || props.className,
  });

  return asChild ? (
    React.cloneElement(
      React.Children.only(children as React.ReactElement<{className?: string}>),
      {className},
    )
  ) : (
    <View {...props} className={className}>
      <Text>{children}</Text>
    </View>
  );
}
