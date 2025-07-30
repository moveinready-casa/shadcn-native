import {
  AriaBreadcrumbItemProps,
  AriaBreadcrumbsProps as AriaBreadcrumbProps,
  useBreadcrumbs as useBreadcrumbAria,
  useBreadcrumbItem as useBreadcrumbItemAria,
} from "@react-aria/breadcrumbs";
import {ChevronRightIcon, MoreHorizontalIcon} from "lucide-react-native";
import React, {ComponentProps, createContext, useContext, useRef} from "react";
import {Platform, Pressable, View, Linking, Text} from "react-native";
import {tv} from "tailwind-variants";

export type BreadcrumbProps = {
  size?: "sm" | "md" | "lg";
  color?: "default" | "warning" | "destructive" | "success";
  variant?: "shadcn" | "bordered" | "solid";
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
} & AriaBreadcrumbProps;

export type BreadcrumbReturn = {
  navProps: React.ComponentProps<typeof View> | HTMLDivElement;
  listProps: React.ComponentProps<typeof View> | HTMLDivElement;
};

export type BreadcrumbItemProps = {
  disabled?: boolean;
} & Omit<AriaBreadcrumbItemProps, "isDisabled">;
export type BreadcrumbItemReturn = {
  componentProps: React.ComponentProps<typeof View> | HTMLDivElement;
  linkProps: React.ComponentProps<typeof Pressable> | HTMLAnchorElement;
  pageProps: React.ComponentProps<typeof Text> | HTMLSpanElement;
};

export type BreadcrumbComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & BreadcrumbProps &
  ComponentProps<typeof View>;

export type BreadcrumbListComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof View>;

export type BreadcrumbItemComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & Partial<BreadcrumbItemProps> &
  ComponentProps<typeof View>;

export type BreadcrumbLinkComponentProps = {
  children: React.ReactNode;
  href?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Pressable>;

export type BreadcrumbPageComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

export type BreadcrumbSeparatorComponentProps = {
  children?: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof View>;

export type BreadcrumbContextProps = BreadcrumbProps & BreadcrumbReturn;

export type BreadcrumbContextItemProps = {
  disabled?: boolean;
} & BreadcrumbItemReturn;

export const useBreadcrumb = ({
  ...props
}: BreadcrumbProps): BreadcrumbReturn => {
  const {navProps} = useBreadcrumbAria(props);

  return {
    navProps: {
      ...navProps,
      accessible: true,
      role: "navigation",
      accessibilityRole: "navigation",
    },
    listProps: {
      accessible: false,
      role: "list",
      accessibilityRole: "list",
    },
  };
};

export const useBreadcrumbItem = ({
  disabled,
  ...props
}: BreadcrumbItemProps): BreadcrumbItemReturn => {
  let linkProps: BreadcrumbItemReturn["linkProps"];

  if (Platform.OS === "web") {
    const webLinkRef = useRef<HTMLAnchorElement>(null);
    const {itemProps: webLinkProps} = useBreadcrumbItemAria(
      {...props, isDisabled: disabled},
      webLinkRef,
    );

    linkProps = webLinkProps;
  }

  // @ts-expect-error - link props could be defined if the platform is web
  const existingLinkProps = linkProps || {};

  linkProps = {
    ...existingLinkProps,
    ...props,
    accessibilityRole: "link",
    accessibilityState: {
      disabled,
    },
    className: disabled ? "opacity-50 pointer-events-none" : "",
  };

  return {
    pageProps: {
      accessible: true,
      className: disabled ? "opacity-50 pointer-events-none" : "",
    },
    componentProps: {
      accessible: false,
      role: "listitem",
      accessibilityRole: "listitem",
    },
    linkProps,
  };
};

export const BreadcrumbContext = createContext<BreadcrumbContextProps | null>(
  null,
);

export function Breadcrumb({
  children,
  asChild = false,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  "aria-details": ariaDetails,
  size,
  color = "default",
  variant = "shadcn",
  borderRadius = "md",
  baseClassName,
  ...props
}: BreadcrumbComponentProps) {
  const {navProps, listProps} = useBreadcrumb({
    id,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    "aria-details": ariaDetails,
  });

  const renderProps: React.ComponentProps<typeof View> = {
    ...navProps,
    ...props,
    className: baseClassName || props.className || "",
  };

  const contextValue = {
    navProps,
    listProps,
    size,
    color,
    variant,
    borderRadius,
  };

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      {asChild ? (
        React.cloneElement(
          React.Children.toArray(children)[0] as React.ReactElement<{
            className: string;
          }>,
          {
            ...renderProps,
            className: renderProps.className,
          },
        )
      ) : (
        <View {...renderProps}>{children}</View>
      )}
    </BreadcrumbContext.Provider>
  );
}

export const breadcrumbList = tv({
  base: "flex flex-row flex-wrap items-center gap-1.5 break-words sm:gap-2.5 p-2 w-fit",
  variants: {
    variant: {
      shadcn: "",
      bordered: "border border-border",
      solid: "bg-background border border-border",
    },
    borderRadius: {
      none: "",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
    },
  },
  defaultVariants: {
    variant: "shadcn",
    borderRadius: "md",
  },
});

export function BreadcrumbList({
  children,
  asChild = false,
  baseClassName,
  ...props
}: BreadcrumbListComponentProps) {
  const breadcrumbContext = useContext(BreadcrumbContext);
  if (!breadcrumbContext) {
    throw new Error("BreadcrumbList must be used within a Breadcrumb");
  }
  const {listProps, variant, borderRadius} = breadcrumbContext;

  const renderProps = {
    ...listProps,
    ...props,
    className: breadcrumbList({
      variant,
      borderRadius,
      className: baseClassName || props.className,
    }),
  };

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      {
        ...renderProps,
        className: renderProps.className,
      },
    )
  ) : (
    <View {...renderProps}>{children}</View>
  );
}

export const BreadcrumbItemContext =
  createContext<BreadcrumbContextItemProps | null>(null);

export function BreadcrumbItem({
  children,
  asChild = false,
  disabled,
  baseClassName,
  ...props
}: BreadcrumbItemComponentProps) {
  const breadcrumbContext = useContext(BreadcrumbContext);
  if (!breadcrumbContext) {
    throw new Error("BreadcrumbItem must be used within a BreadcrumbList");
  }

  const {componentProps, linkProps, pageProps} = useBreadcrumbItem({
    disabled,
    children,
  });

  const renderProps = {
    ...componentProps,
    ...props,
    className: baseClassName || props.className || "",
  };

  return (
    <BreadcrumbItemContext.Provider
      value={{componentProps, linkProps, pageProps, disabled}}
    >
      {asChild ? (
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              ...renderProps,
              className: renderProps.className,
            });
          }
          return child;
        })
      ) : (
        <View {...renderProps}>{children}</View>
      )}
    </BreadcrumbItemContext.Provider>
  );
}

export const breadcrumbLink = tv({
  slots: {
    base: "flex-row items-center gap-1",
    text: "text-muted-foreground transition-colors",
  },
  variants: {
    size: {
      sm: {
        text: "text-xs",
      },
      md: {
        text: "text-sm",
      },
      lg: {
        text: "text-base",
      },
    },
    color: {
      default: {
        text: "hover:text-foreground",
      },
      warning: {
        text: "hover:text-warning",
      },
      destructive: {
        text: "hover:text-destructive",
      },
      success: {
        text: "hover:text-success",
      },
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});

export function BreadcrumbLink({
  children,
  asChild = false,
  href,
  startContent,
  endContent,
  baseClassName,
  ...props
}: BreadcrumbLinkComponentProps) {
  const breadcrumbContext = useContext(BreadcrumbContext);
  const breadcrumbItemContext = useContext(BreadcrumbItemContext);
  if (!breadcrumbItemContext || !breadcrumbContext) {
    throw new Error("BreadcrumbLink must be used within a BreadcrumbItem");
  }

  const {size, color} = breadcrumbContext;

  const {base, text} = breadcrumbLink({size, color});

  const {linkProps} = breadcrumbItemContext;

  const handlePress = (e: typeof Pressable.prototype.onPress) => {
    props.onPress?.(e);

    if (!Linking.canOpenURL(href || "/")) {
      throw new Error(
        `Invalid URL: ${href} \n Be sure all passed URLs are supported by the linking module https://reactnative.dev/docs/linking or use the asChild prop with your routers component ie: expo-link.`,
      );
    }

    Linking.openURL(href || "/");
  };

  const renderProps = {
    ...linkProps,
    ...props,
    onPress: (e: typeof Pressable.prototype.onPress) => handlePress(e),
    className: base({className: baseClassName || props.className}),
  };

  return asChild ? (
    <View className={renderProps.className}>
      {React.cloneElement(
        React.Children.toArray(children)[0] as React.ReactElement<{
          className: string;
        }>,
        {
          ...renderProps,
          className: text({className: baseClassName || props.className}),
        },
      )}
    </View>
  ) : (
    <Pressable {...renderProps}>
      {startContent}
      <Text className={text()}>{children}</Text>
      {endContent}
    </Pressable>
  );
}

export const breadcrumbPage = tv({
  base: "",
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
    color: {
      default: "text-foreground",
      warning: "text-warning",
      destructive: "text-destructive",
      success: "text-success",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});

export function BreadcrumbPage({
  children,
  asChild = false,
  baseClassName,
  ...props
}: BreadcrumbPageComponentProps) {
  const breadcrumbContext = useContext(BreadcrumbContext);
  const breadcrumbItemContext = useContext(BreadcrumbItemContext);
  if (!breadcrumbItemContext || !breadcrumbContext) {
    throw new Error("BreadcrumbPage must be used within a BreadcrumbItem");
  }

  const {size, color} = breadcrumbContext;

  const {pageProps} = breadcrumbItemContext;

  const renderProps = {
    ...pageProps,
    ...props,
    className: breadcrumbPage({
      size,
      color,
      className: baseClassName || props.className,
    }),
  };

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      {
        ...renderProps,
        className: renderProps.className,
      },
    )
  ) : (
    <Text {...renderProps}>{children}</Text>
  );
}

export const breadcrumbSeparator = tv({
  base: "text-muted-foreground",
  variants: {
    size: {
      sm: "size-3",
      md: "size-3.5",
      lg: "size-4",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});

export function BreadcrumbSeparator({
  children,
  asChild = false,
  baseClassName,
  ...props
}: BreadcrumbSeparatorComponentProps) {
  const breadcrumbContext = useContext(BreadcrumbContext);
  if (!breadcrumbContext) {
    throw new Error("BreadcrumbSeparator must be used within a BreadcrumbList");
  }

  const {size} = breadcrumbContext;

  const iconSize = size === "sm" ? 10 : size === "md" ? 14 : 16;

  const renderProps = {
    ...props,
    className: baseClassName || props.className || "",
  };

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      {
        ...renderProps,
        className: renderProps.className,
      },
    )
  ) : (
    <View {...renderProps}>
      {children || (
        <ChevronRightIcon
          size={iconSize}
          className={breadcrumbSeparator({size})}
        />
      )}
    </View>
  );
}

export type BreadcrumbEllipsisComponentProps = {
  children?: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & Partial<ComponentProps<typeof View>>;

export function BreadcrumbEllipsis({
  children,
  baseClassName,
  ...props
}: BreadcrumbEllipsisComponentProps) {
  const breadcrumbContext = useContext(BreadcrumbContext);
  if (!breadcrumbContext) {
    throw new Error("BreadcrumbEllipsis must be used within a BreadcrumbList");
  }

  const {size} = breadcrumbContext;

  const iconSize = size === "sm" ? 10 : size === "md" ? 14 : 16;

  const renderProps = {
    ...props,
    size: iconSize,
    className: breadcrumbSeparator({
      size,
      className: baseClassName || props.className,
    }),
  };

  return children ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className: string;
      }>,
      {
        ...renderProps,
        className: renderProps.className,
      },
    )
  ) : (
    <View {...renderProps}>
      <MoreHorizontalIcon />
      <Text className="sr-only">More</Text>
    </View>
  );
}
