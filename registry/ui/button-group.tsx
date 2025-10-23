import React, {ComponentProps} from "react";
import {Platform, View, Text} from "react-native";
import {tv} from "tailwind-variants";
import {useSeparator as useSeparatorAria} from "@react-aria/separator";

/**
 * Props for the ButtonGroup component.
 * @param orientation - Layout direction of the button group (horizontal or vertical)
 * @param size - Size to apply to all buttons in the group (sm, md, lg, xl, icon)
 * @param disabled - If true, disables all buttons in the group
 * @param loading - If true, sets all buttons in the group to loading state
 * @param nested - If true, adds gap between child groups (auto-detected if children contain ButtonGroups)
 * @param asChild - If true, merges props with first child element instead of rendering wrapper
 * @param baseClassName - Custom tailwind classes to apply to the base group component. Takes priority over className
 * @param aria-label - Accessible label for the button group
 * @param aria-labelledby - ID of the element labeling the button group
 */
export type ButtonGroupProps = {
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  disabled?: boolean;
  loading?: boolean;
  nested?: boolean;
  asChild?: boolean;
  baseClassName?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
} & ComponentProps<typeof View>;

/**
 * Props for the ButtonGroupSeparator component.
 * @param orientation - Separator orientation (vertical or horizontal). Defaults to vertical for horizontal groups.
 * @param decorative - If true, hides the separator from assistive technologies. Defaults to true.
 * @param asChild - If true, merges props with first child element instead of rendering wrapper
 * @param baseClassName - Custom tailwind classes to apply to the base separator component. Takes priority over className
 */
export type ButtonGroupSeparatorProps = {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof View>;

/**
 * Props for the ButtonGroupText component.
 * @param asChild - If true, merges props with first child element instead of rendering wrapper (useful for Label components)
 * @param baseClassName - Custom tailwind classes to apply to the base text component. Takes priority over className
 */
export type ButtonGroupTextProps = {
  asChild?: boolean;
  baseClassName?: string;
} & ComponentProps<typeof Text>;

/**
 * Tailwind Variants for ButtonGroup styles.
 *
 * Position-based styling is applied directly to children in the component logic.
 * This base styling handles layout direction and nested group spacing.
 */
export const buttonGroup = tv({
  base: "flex w-auto items-stretch",
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
    nested: {
      true: "gap-2",
      false: "gap-0",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    nested: false,
  },
});

/**
 * Tailwind Variants for ButtonGroupSeparator styles.
 */
export const buttonGroupSeparator = tv({
  base: "shrink-0 bg-border",
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

/**
 * Tailwind Variants for ButtonGroupText styles.
 */
export const buttonGroupText = tv({
  base: "flex items-center justify-center px-3 py-2 text-sm text-muted-foreground",
});

/**
 * A container that groups related buttons together with consistent styling.
 * Supports horizontal and vertical orientations and nested button groups.
 *
 * @example Basic usage
 * ```tsx
 * <ButtonGroup>
 *   <Button>Button 1</Button>
 *   <Button>Button 2</Button>
 * </ButtonGroup>
 * ```
 *
 * @example Vertical orientation
 * ```tsx
 * <ButtonGroup orientation="vertical">
 *   <Button>Button 1</Button>
 *   <Button>Button 2</Button>
 * </ButtonGroup>
 * ```
 *
 * @example With size prop (applies to all buttons)
 * ```tsx
 * <ButtonGroup size="lg">
 *   <Button>Large Button 1</Button>
 *   <Button>Large Button 2</Button>
 * </ButtonGroup>
 * ```
 *
 * @example With disabled prop (disables all buttons)
 * ```tsx
 * <ButtonGroup disabled>
 *   <Button>Disabled 1</Button>
 *   <Button>Disabled 2</Button>
 * </ButtonGroup>
 * ```
 *
 * @example With loading prop (all buttons show loading state)
 * ```tsx
 * <ButtonGroup loading>
 *   <Button>Loading 1</Button>
 *   <Button>Loading 2</Button>
 * </ButtonGroup>
 * ```
 *
 * @example Nested groups with spacing
 * ```tsx
 * <ButtonGroup>
 *   <ButtonGroup>
 *     <Button>Button 1</Button>
 *     <Button>Button 2</Button>
 *   </ButtonGroup>
 *   <ButtonGroup>
 *     <Button>Button 3</Button>
 *     <Button>Button 4</Button>
 *   </ButtonGroup>
 * </ButtonGroup>
 * ```
 */
export function ButtonGroup({
  orientation = "horizontal",
  size,
  disabled,
  loading,
  nested,
  asChild = false,
  baseClassName,
  children,
  ...props
}: ButtonGroupProps): React.ReactElement {
  // Auto-detect nested ButtonGroups if nested prop is not explicitly set
  const hasNestedGroups: boolean =
    nested ??
    React.Children.toArray(children).some(
      (child): boolean =>
        React.isValidElement(child) &&
        (child.type === ButtonGroup ||
          (typeof child.type === "function" &&
            child.type.name === "ButtonGroup")),
    );

  // Clone children and pass down size, disabled, loading props, and position-based styling
  const childrenArray = React.Children.toArray(children);
  const enhancedChildren = childrenArray.map((child, index) => {
    if (React.isValidElement(child)) {
      // Check if it's a Button component (not ButtonGroupSeparator or ButtonGroupText)
      const childType = child.type as any;
      const childProps = child.props as any;
      const isButton =
        childType?.displayName === "Button" ||
        childType?.name === "Button" ||
        (typeof childType === "function" && childProps?.onPress !== undefined);

      if (isButton) {
        const isFirst = index === 0;
        const isLast = index === childrenArray.length - 1;

        // Build position-specific classes based on orientation
        let positionClasses = "";
        if (orientation === "horizontal") {
          if (!isFirst) {
            positionClasses += " rounded-l-none border-l-0";
          }
          if (!isLast) {
            positionClasses += " rounded-r-none";
          }
        } else {
          if (!isFirst) {
            positionClasses += " rounded-t-none border-t-0";
          }
          if (!isLast) {
            positionClasses += " rounded-b-none";
          }
        }

        // Apply group props to button, but allow individual button props to override
        return React.cloneElement(child as React.ReactElement<any>, {
          size: childProps.size ?? size,
          disabled: childProps.disabled ?? disabled,
          loading: childProps.loading ?? loading,
          className: `${childProps.className || ""} ${positionClasses}`.trim(),
        });
      }
    }
    return child;
  });

  const renderProps: any = {
    ...props,
    accessible: true,
    className: buttonGroup({
      orientation,
      nested: hasNestedGroups,
      className: baseClassName || props.className,
    }),
  };

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className?: string;
      }>,
      renderProps,
    )
  ) : (
    <View {...renderProps}>{enhancedChildren}</View>
  );
}

/**
 * The useSeparator hook returns platform-appropriate accessibility props for a separator.
 * On web, it integrates with React Aria. On native platforms, it returns RN accessibility props.
 *
 * @param orientation - The separator orientation. Defaults to vertical.
 * @param decorative - If true, hides the separator from assistive technologies. Defaults to true.
 * @returns Returns an object with componentProps that should be spread on the separator element.
 */
const useButtonGroupSeparator = ({
  orientation = "vertical",
  decorative = true,
}: ButtonGroupSeparatorProps) => {
  const {separatorProps} = useSeparatorAria({orientation});

  const componentProps: ComponentProps<typeof View> | HTMLDivElement = {
    ...(Platform.OS === "web" ? separatorProps : {}),
    accessibilityRole: "separator",
    role: "separator",
    "aria-orientation": orientation,
  };

  return {
    componentProps: decorative ? {} : componentProps,
  };
};

/**
 * A visual divider component for separating buttons within a ButtonGroup.
 * Useful for creating split buttons or visually grouping related actions.
 *
 * Note: Buttons with variant="outline" do not typically need a separator
 * since they have their own borders.
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button>Button 1</Button>
 *   <ButtonGroupSeparator />
 *   <Button>Button 2</Button>
 * </ButtonGroup>
 * ```
 *
 * @example Horizontal separator in vertical group
 * ```tsx
 * <ButtonGroup orientation="vertical">
 *   <Button>Button 1</Button>
 *   <ButtonGroupSeparator orientation="horizontal" />
 *   <Button>Button 2</Button>
 * </ButtonGroup>
 * ```
 *
 * @example Non-decorative separator with accessibility
 * ```tsx
 * <ButtonGroup>
 *   <Button>Button 1</Button>
 *   <ButtonGroupSeparator decorative={false} />
 *   <Button>Button 2</Button>
 * </ButtonGroup>
 * ```
 */
export function ButtonGroupSeparator({
  orientation = "vertical",
  decorative = true,
  asChild = false,
  baseClassName,
  children,
  ...props
}: ButtonGroupSeparatorProps) {
  const {componentProps} = useButtonGroupSeparator({orientation, decorative});

  const renderProps = {
    ...componentProps,
    ...props,
    className: buttonGroupSeparator({
      orientation,
      className: baseClassName || props.className,
    }),
  };

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className?: string;
      }>,
      renderProps,
    )
  ) : (
    <View {...renderProps} />
  );
}

/**
 * A text component for displaying labels or text within a button group.
 * Commonly used for input groups or form layouts.
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <ButtonGroupText>Label:</ButtonGroupText>
 *   <Button>Action</Button>
 * </ButtonGroup>
 * ```
 *
 * @example With asChild for custom components (e.g., Label)
 * ```tsx
 * <ButtonGroup>
 *   <ButtonGroupText asChild>
 *     <Label htmlFor="name">Name:</Label>
 *   </ButtonGroupText>
 *   <Input id="name" />
 * </ButtonGroup>
 * ```
 */
export function ButtonGroupText({
  asChild = false,
  baseClassName,
  children,
  ...props
}: ButtonGroupTextProps) {
  const renderProps = {
    ...props,
    className: buttonGroupText({
      className: baseClassName || props.className,
    }),
  };

  return asChild ? (
    React.cloneElement(
      React.Children.toArray(children)[0] as React.ReactElement<{
        className?: string;
      }>,
      renderProps,
    )
  ) : (
    <Text {...renderProps}>{children}</Text>
  );
}
