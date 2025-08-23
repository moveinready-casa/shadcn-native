import {
  AriaBreadcrumbItemProps,
  AriaBreadcrumbsProps as AriaBreadcrumbProps,
  useBreadcrumbs as useBreadcrumbAria,
  useBreadcrumbItem as useBreadcrumbItemAria,
} from "@react-aria/breadcrumbs";
import {useNavigation} from "@react-navigation/native";
import {ChevronRightIcon, MoreHorizontalIcon} from "lucide-react-native";
import React, {ComponentProps, createContext, useContext, useRef} from "react";
import {Platform, Pressable, Text, View} from "react-native";
import {tv} from "tailwind-variants";

/**
 * Base props for the root `Breadcrumb` component, context, and hook.
 * @param size - The size of the breadcrumb. Controls the text size and spacing.
 * @param color - The color variant of the breadcrumb. Affects text and hover colors.
 * @param variant - The visual variant of the breadcrumb.
 * @param borderRadius - Sets the border radius of the breadcrumb.
 */
export type BreadcrumbProps = {
  size?: "sm" | "md" | "lg";
  color?: "default" | "warning" | "destructive" | "success";
  variant?: "shadcn" | "bordered" | "solid";
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
} & AriaBreadcrumbProps;

/**
 * Return type for the `useBreadcrumb` hook.
 * @param navProps - Accessibility props to pass to the navigation component.
 * @param listProps - Accessibility props to pass to the list component.
 */
export type BreadcrumbReturn = {
  navProps: React.ComponentProps<typeof View> | HTMLDivElement;
  listProps: React.ComponentProps<typeof View> | HTMLDivElement;
};

/**
 * Base props for the `BreadcrumbItem` component, context, and hook.
 * @param disabled - Whether the breadcrumb item is disabled.
 */
export type BreadcrumbItemProps = {
  disabled?: boolean;
} & Omit<AriaBreadcrumbItemProps, "isDisabled">;

/**
 * Return type for the `useBreadcrumbItem` hook.
 * @param componentProps - Accessibility props to pass to the breadcrumb item component.
 * @param linkProps - Props to pass to the breadcrumb link component.
 * @param pageProps - Props to pass to the breadcrumb page component.
 */
export type BreadcrumbItemReturn = {
  componentProps: React.ComponentProps<typeof View> | HTMLDivElement;
  linkProps: React.ComponentProps<typeof Pressable> | HTMLAnchorElement;
  pageProps: React.ComponentProps<typeof Text> | HTMLSpanElement;
};

/**
 * Props for the `Breadcrumb` component.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it. Available on any exported component.
 * @param baseClassName - Custom tailwind classes to apply to the base breadcrumb component. Takes priority over the `className` prop.
 */
export type BreadcrumbComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & BreadcrumbProps &
  ComponentProps<typeof View>;

/**
 * Props for the `BreadcrumbList` component.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it. Available on any exported component.
 * @param baseClassName - Custom tailwind classes to apply to the base breadcrumb list component. Takes priority over the `className` prop.
 */
export type BreadcrumbListComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * Props for the `BreadcrumbItem` component.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it. Available on any exported component.
 * @param baseClassName - Custom tailwind classes to apply to the base breadcrumb item component. Takes priority over the `className` prop.
 * @see BreadcrumbItemProps
 */
export type BreadcrumbItemComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & Partial<BreadcrumbItemProps> &
  ComponentProps<typeof View>;

/**
 * Props for the `BreadcrumbLink` component.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it. Available on any exported component.
 * @param href - The URL to navigate to when the link is pressed.
 * @param startContent - Start content (ReactNode) to display before the link text.
 * @param endContent - End content (ReactNode) to display after the link text.
 * @param baseClassName - Custom tailwind classes to apply to the base breadcrumb link component. Takes priority over the `className` prop.
 */
export type BreadcrumbLinkComponentProps = {
  children: React.ReactNode;
  href?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Pressable>;

/**
 * Props for the `BreadcrumbPage` component.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it. Available on any exported component.
 * @param baseClassName - Custom tailwind classes to apply to the base breadcrumb page component. Takes priority over the `className` prop.
 */
export type BreadcrumbPageComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

/**
 * Props for the `BreadcrumbSeparator` component.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it. Available on any exported component.
 * @param baseClassName - Custom tailwind classes to apply to the base breadcrumb separator component. Takes priority over the `className` prop.
 */
export type BreadcrumbSeparatorComponentProps = {
  children?: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * Props for the `BreadcrumbEllipsis` component.
 * @param asChild - If true clones the child and passes all accessibility and functionality props to it. Available on any exported component.
 * @param baseClassName - Custom tailwind classes to apply to the base breadcrumb ellipsis component. Takes priority over the `className` prop.
 */
export type BreadcrumbEllipsisComponentProps = {
  children?: React.ReactNode;
  asChild?: boolean;
  baseClassName?: string;
} & Partial<ComponentProps<typeof View>>;

/**
 * Context value for the `Breadcrumb` component.
 * @param props - Props from the top-level Breadcrumb component.
 * @see BreadcrumbReturn
 */
export type BreadcrumbContextProps = {
  props: BreadcrumbProps;
} & BreadcrumbReturn;

/**
 * Context value for the `BreadcrumbItem` component.
 * @param disabled - Whether the breadcrumb item is disabled.
 * @see BreadcrumbItemReturn
 */
export type BreadcrumbContextItemProps = {
  disabled?: boolean;
} & BreadcrumbItemReturn;

/**
 * Conditional classes for the breadcrumb list component.
 * @see BreadcrumbListComponentProps
 */
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

/**
 * Conditional classes for the breadcrumb link component.
 * It includes the following slots:
 * - base: The base styles for the breadcrumb link.
 * - text: The text styles for the breadcrumb link.
 * @see BreadcrumbLinkComponentProps
 */
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

/**
 * Conditional classes for the breadcrumb page component.
 * @see BreadcrumbPageComponentProps
 */
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

/**
 * Conditional classes for the breadcrumb separator component.
 * @see BreadcrumbSeparatorComponentProps
 */
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

/**
 * Conditional classes for the breadcrumb ellipsis component.
 * @see BreadcrumbEllipsisComponentProps
 */
export const breadcrumbEllipsis = tv({
  extend: breadcrumbSeparator,
  base: "justify-center",
});

/**
 * The use breadcrumb hook is the backbone of the breadcrumb component.
 * @param props - Props to configure the behavior of the breadcrumb. @see BreadcrumbProps
 * @returns Returns both the navigation and list accessibility props to pass to the breadcrumb components. @see BreadcrumbReturn
 */
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

/**
 * The use breadcrumb item hook is the backbone of the breadcrumb item component.
 * @param props - Props to configure the behavior of the breadcrumb item. @see BreadcrumbItemProps
 * @returns Returns state and accessibility props for both the link and page components. @see BreadcrumbItemReturn
 */
export const useBreadcrumbItem = ({
  disabled,
  ...props
}: BreadcrumbItemProps): BreadcrumbItemReturn => {
  const webLinkRef = useRef<HTMLAnchorElement>(null);
  const {itemProps: webLinkProps} = useBreadcrumbItemAria(
    {...props, isDisabled: disabled},
    webLinkRef,
  );

  let linkProps: BreadcrumbItemReturn["linkProps"] = {};

  if (Platform.OS === "web") {
    linkProps = webLinkProps;
  }

  linkProps = {
    ...linkProps,
    ...props,
    hitSlop: 20,
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

/**
 * A context wrapper containing the global state of the breadcrumb.
 * @see BreadcrumbContextProps
 */
export const BreadcrumbContext = createContext<BreadcrumbContextProps | null>(
  null,
);

/**
 * A context wrapper containing the global state of the breadcrumb item.
 * @see BreadcrumbContextItemProps
 */
export const BreadcrumbItemContext =
  createContext<BreadcrumbContextItemProps | null>(null);

/**
 * The root breadcrumb component. This should be supplied once per breadcrumb group. It is required for all breadcrumbs.
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/products">Products</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Electronics</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 * @param props - Props to configure the behavior of the breadcrumb. @see BreadcrumbComponentProps
 * @returns Returns a context wrapper containing the global state of the breadcrumb. @see BreadcrumbContextProps
 */
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
    props: {
      size,
      color,
      variant,
      borderRadius,
    },
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

/**
 * The breadcrumb list component. This component wraps all breadcrumb items and provides the list structure.
 * @example
 * ```tsx
 * <BreadcrumbList>
 *   <BreadcrumbItem>
 *     <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *   </BreadcrumbItem>
 *   <BreadcrumbSeparator />
 *   <BreadcrumbItem>
 *     <BreadcrumbPage>Current Page</BreadcrumbPage>
 *   </BreadcrumbItem>
 * </BreadcrumbList>
 * ```
 * @param props - Props to configure the behavior of the breadcrumb list. @see BreadcrumbListComponentProps
 * @returns Returns a list container for breadcrumb items with proper accessibility attributes.
 */
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
  const {listProps, props: breadcrumbProps} = breadcrumbContext;

  const renderProps = {
    ...listProps,
    ...props,
    className: breadcrumbList({
      variant: breadcrumbProps.variant,
      borderRadius: breadcrumbProps.borderRadius,
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

/**
 * The breadcrumb item component. This component wraps individual breadcrumb links and pages.
 * @example
 * ```tsx
 * <BreadcrumbItem>
 *   <BreadcrumbLink href="/products">Products</BreadcrumbLink>
 * </BreadcrumbItem>
 * ```
 * @param props - Props to configure the behavior of the breadcrumb item. @see BreadcrumbItemComponentProps
 * @returns Returns a context wrapper containing the global state of the breadcrumb item. @see BreadcrumbContextItemProps
 */
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

  const renderProps: React.ComponentProps<typeof View> = {
    ...props,
    className: baseClassName || props.className || "",
  };

  return (
    <BreadcrumbItemContext.Provider
      value={{componentProps, linkProps, pageProps, disabled}}
    >
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
    </BreadcrumbItemContext.Provider>
  );
}

/**
 * The breadcrumb link component. This component renders a clickable link that navigates to a URL.
 * @example
 * ```tsx
 * <BreadcrumbLink href="/products" startContent={<HomeIcon />}>
 *   Products
 * </BreadcrumbLink>
 * ```
 * @param props - Props to configure the behavior of the breadcrumb link. @see BreadcrumbLinkComponentProps
 * @returns Returns a `Pressable` which is used to navigate to the specified URL.
 */
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

  const navigation = useNavigation();

  const {size, color} = breadcrumbContext.props;

  const {base, text} = breadcrumbLink({size, color});

  const {linkProps} = breadcrumbItemContext;

  const handlePress = (e: typeof Pressable.prototype.onPress) => {
    props.onPress?.(e);

    navigation.navigate(href as never);
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

/**
 * The breadcrumb page component. This component renders the current page text (non-clickable).
 * @example
 * ```tsx
 * <BreadcrumbPage>Current Page</BreadcrumbPage>
 * ```
 * @param props - Props to configure the behavior of the breadcrumb page. @see BreadcrumbPageComponentProps
 * @returns Returns a `Text` component that displays the current page name.
 */
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

  const {size, color} = breadcrumbContext.props;

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

/**
 * The breadcrumb separator component. This component renders a separator between breadcrumb items.
 * @example
 * ```tsx
 * <BreadcrumbSeparator />
 * ```
 * @param props - Props to configure the behavior of the breadcrumb separator. @see BreadcrumbSeparatorComponentProps
 * @returns Returns a `View` component that displays a separator (defaults to ChevronRightIcon).
 */
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

  const {size} = breadcrumbContext.props;

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

/**
 * The breadcrumb ellipsis component. This component renders an ellipsis to indicate hidden breadcrumb items.
 * @example
 * ```tsx
 * <BreadcrumbEllipsis />
 * ```
 * @param props - Props to configure the behavior of the breadcrumb ellipsis. @see BreadcrumbEllipsisComponentProps
 * @returns Returns a `View` component that displays an ellipsis (defaults to MoreHorizontalIcon).
 */
export function BreadcrumbEllipsis({
  children,
  baseClassName,
  ...props
}: BreadcrumbEllipsisComponentProps) {
  const breadcrumbContext = useContext(BreadcrumbContext);
  if (!breadcrumbContext) {
    throw new Error("BreadcrumbEllipsis must be used within a BreadcrumbList");
  }

  const {size} = breadcrumbContext.props;

  const iconSize = size === "sm" ? 10 : size === "md" ? 14 : 16;

  const renderProps = {
    ...props,
    size: iconSize,
    className: breadcrumbEllipsis({
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
