import * as React from "react";
import * as SelectPrimitive from "zeego/dropdown-menu";
import {ChevronDownIcon} from "lucide-react-native";

import {tv} from "tailwind-variants";
import {Text, View} from "react-native";

/**
 * Base props for the Select root component.
 * @param children - React children to render inside the select
 */
export type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root>;

/**
 * Props for the SelectGroup component.
 * @param children - React children to render inside the group
 */
export type SelectGroupProps = React.ComponentProps<
  typeof SelectPrimitive.Group
>;

/**
 * Props for the SelectValue component.
 * @param placeholder - Placeholder text when no value is selected
 * @param children - React children to render as the value
 */
export type SelectValueProps = {
  placeholder?: string;
  children?: React.ReactNode;
};

/**
 * Props for the SelectTrigger component.
 * @param children - React children to render inside the trigger
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param size - Size variant of the trigger: "sm" | "default"
 */
export type SelectTriggerProps = React.ComponentProps<
  typeof SelectPrimitive.Trigger
> & {
  baseClassName?: string;
  size?: "sm" | "default";
};

/**
 * Props for the SelectContent component.
 * @param children - React children to render inside the content
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param position - Position of the content: "popper" | "item-aligned"
 * @param align - Alignment of the content: "start" | "center" | "end"
 */
export type SelectContentProps = React.ComponentProps<
  typeof SelectPrimitive.Content
> & {
  baseClassName?: string;
  position?: "popper" | "item-aligned";
  align?: "start" | "center" | "end";
};

/**
 * Props for the SelectLabel component.
 * @param children - React children to render inside the label
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 */
export type SelectLabelProps = React.ComponentProps<
  typeof SelectPrimitive.Label
> & {
  baseClassName?: string;
};

/**
 * Props for the SelectItem component.
 * @param children - React children to render inside the item
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 */
export type SelectItemProps = React.ComponentProps<
  typeof SelectPrimitive.Item
> & {
  baseClassName?: string;
};

/**
 * Props for the SelectSeparator component.
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 */
export type SelectSeparatorProps = React.ComponentProps<
  typeof SelectPrimitive.Separator
> & {
  baseClassName?: string;
};

/**
 * Tailwind variants for select trigger styling.
 * Provides base styles and size variants for the trigger button.
 * @param size - Size variant: "sm" for small, "default" for standard sizing
 */
export const selectTrigger = tv({
  base: "focus:ring-ring data-[placeholder]:text-muted-foreground flex flex-row h-9 w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-hidden focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:opacity-50",
  variants: {
    size: {
      default: "h-9 px-3 py-2",
      sm: "h-8 px-2 py-1 text-xs",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/**
 * Tailwind variants for select content styling.
 * Provides base styles with animations and positioning for select dropdown content.
 */
export const selectContent = tv({
  base: "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md",
  variants: {
    position: {
      popper:
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      "item-aligned": "",
    },
  },
  defaultVariants: {
    position: "popper",
  },
});

/**
 * Tailwind variants for select label styling.
 * Provides base styles for select labels.
 */
export const selectLabel = tv({
  base: "px-2 py-1.5 text-sm font-medium flex flex-row",
});

/**
 * Tailwind variants for select item styling.
 * Provides base styles for select items with focus and selection states.
 */
export const selectItem = tv({
  base: "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
});

/**
 * Tailwind variants for select separator styling.
 * Provides base styles for select separators.
 */
export const selectSeparator = tv({
  base: "bg-muted -mx-1 my-1 h-px flex flex-row",
});

/**
 * Root component for select functionality.
 * Provides the context and state management for the select.
 * @param props - Props for the select root
 * @returns The select root component
 */
export const Select = SelectPrimitive.create(({...props}: SelectProps) => {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}, "Root");

/**
 * Group component for organizing select items.
 * Used to group related select items together.
 * @param props - Props for the select group
 * @returns The select group component
 */
export const SelectGroup = SelectPrimitive.create(
  ({...props}: SelectGroupProps) => {
    return <SelectPrimitive.Group data-slot="select-group" {...props} />;
  },
  "Group",
);

/**
 * Value component for the select.
 * Displays the currently selected value or placeholder.
 * @param placeholder - Placeholder text when no value is selected
 * @param children - React children to render as the value
 * @returns The select value component
 */
export function SelectValue({placeholder, children}: SelectValueProps) {
  return (
    <View data-slot="select-value" className="flex-1">
      {children || <Text className="text-muted-foreground">{placeholder}</Text>}
    </View>
  );
}

/**
 * Trigger component for the select.
 * The element that opens the select dropdown when activated.
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param size - Size variant of the trigger: "sm" | "default"
 * @param children - React children to render inside the trigger
 * @param props - Additional props for the select trigger
 * @returns The select trigger component
 */
export const SelectTrigger = SelectPrimitive.create(
  ({
    className,
    baseClassName,
    size = "default",
    children,
    ...props
  }: SelectTriggerProps) => {
    return (
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        data-size={size}
        className={selectTrigger({
          size,
          class: baseClassName || className,
        })}
        {...props}
      >
        <View className="flex flex-row">
          {children}
          <ChevronDownIcon className="text-muted-foreground size-4 opacity-50" />
        </View>
      </SelectPrimitive.Trigger>
    );
  },
  "Trigger",
);

/**
 * Content component for the select.
 * Contains the select items with animations and positioning.
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param children - React children to render inside the content
 * @param position - Position of the content: "popper" | "item-aligned"
 * @param align - Alignment of the content: "start" | "center" | "end"
 * @param props - Additional props for the select content
 * @returns The select content component
 */
export const SelectContent = SelectPrimitive.create(
  ({
    className,
    baseClassName,
    children,
    position = "popper",
    align = "center",
    ...props
  }: SelectContentProps) => {
    return (
      <SelectPrimitive.Content
        data-slot="select-content"
        data-position={position}
        data-align={align}
        className={selectContent({
          position,
          class: baseClassName || className,
        })}
        align={align}
        {...props}
      >
        {children}
      </SelectPrimitive.Content>
    );
  },
  "Content",
);

/**
 * Label component for the select.
 * Used to provide section labels within the select dropdown.
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param props - Additional props for the label
 * @returns The select label component
 */
export const SelectLabel = SelectPrimitive.create(
  ({className, baseClassName, ...props}: SelectLabelProps) => {
    return (
      <SelectPrimitive.Label
        data-slot="select-label"
        className={selectLabel({
          class: baseClassName || className,
        })}
        {...props}
      />
    );
  },
  "Label",
);

/**
 * Individual select item component.
 * Represents a selectable option within the select dropdown.
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param children - React children to render inside the item
 * @param props - Additional props for the select item
 * @returns The select item component
 */
export const SelectItem = SelectPrimitive.create(
  ({className, baseClassName, children, ...props}: SelectItemProps) => {
    return (
      <SelectPrimitive.Item
        data-slot="select-item"
        className={selectItem({
          class: baseClassName || className,
        })}
        {...props}
      >
        {children}
      </SelectPrimitive.Item>
    );
  },
  "Item",
);

/**
 * Separator component for the select.
 * Used to visually separate groups of select items.
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param props - Additional props for the separator
 * @returns The select separator component
 */
export const SelectSeparator = SelectPrimitive.create(
  ({className, baseClassName, ...props}: SelectSeparatorProps) => {
    return (
      <SelectPrimitive.Separator
        data-slot="select-separator"
        className={selectSeparator({
          class: baseClassName || className,
        })}
        {...props}
      />
    );
  },
  "Separator",
);

/**
 * ItemTitle component for the select.
 * Used to provide the title text for select items.
 * @param props - Props for the item title
 * @returns The select item title component
 */
export const SelectItemTitle = SelectPrimitive.ItemTitle;

/**
 * ItemSubtitle component for the select.
 * Used to provide subtitle text for select items.
 * @param props - Props for the item subtitle
 * @returns The select item subtitle component
 */
export const SelectItemSubtitle = SelectPrimitive.ItemSubtitle;

/**
 * ItemIcon component for the select.
 * Used to provide icons for select items.
 * @param props - Props for the item icon
 * @returns The select item icon component
 */
export const SelectItemIcon = SelectPrimitive.ItemIcon;

/**
 * ItemImage component for the select.
 * Used to provide images for select items.
 * @param props - Props for the item image
 * @returns The select item image component
 */
export const SelectItemImage = SelectPrimitive.ItemImage;
