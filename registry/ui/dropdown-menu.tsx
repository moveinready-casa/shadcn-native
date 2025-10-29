import * as React from "react";
import * as DropdownMenuPrimitive from "zeego/dropdown-menu";
import {CheckIcon, ChevronRightIcon} from "lucide-react-native";

import {tv} from "tailwind-variants";
import {Text} from "react-native";

/**
 * Base props for the DropdownMenu root component.
 * @param children - React children to render inside the dropdown menu
 */
export type DropdownMenuProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Root
>;

/**
 * Props for the DropdownMenuTrigger component.
 * @param children - React children to render inside the trigger
 * @param asChild - If true, merges props with first child element instead of rendering wrapper
 */
export type DropdownMenuTriggerProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Trigger
>;

/**
 * Props for the DropdownMenuGroup component.
 * @param children - React children to render inside the group
 */
export type DropdownMenuGroupProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Group
>;

/**
 * Props for the DropdownMenuItem component.
 * @param children - React children to render inside the item
 * @param inset - Whether the item should have inset padding
 * @param variant - Visual variant of the item: "default" | "destructive"
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 */
export type DropdownMenuItemProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Item
> & {
  inset?: boolean;
  variant?: "default" | "destructive";
  baseClassName?: string;
};

/**
 * Props for the DropdownMenuCheckboxItem component.
 * @param children - React children to render inside the checkbox item
 * @param checked - Whether the checkbox is checked
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param iconClassName - Custom tailwind classes to apply to the check icon
 */
export type DropdownMenuCheckboxItemProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.CheckboxItem
> & {
  baseClassName?: string;
  iconClassName?: string;
};

/**
 * Props for the DropdownMenuLabel component.
 * @param children - React children to render inside the label
 * @param inset - Whether the label should have inset padding
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 */
export type DropdownMenuLabelProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Label
> & {
  inset?: boolean;
  baseClassName?: string;
};

/**
 * Props for the DropdownMenuSeparator component.
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 */
export type DropdownMenuSeparatorProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Separator
> & {
  baseClassName?: string;
};

/**
 * Props for the DropdownMenuShortcut component.
 * @param children - React children to render inside the shortcut
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 */
export type DropdownMenuShortcutProps = React.ComponentProps<typeof Text> & {
  baseClassName?: string;
};

/**
 * Props for the DropdownMenuSub component.
 * @param children - React children to render inside the sub menu
 */
export type DropdownMenuSubProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Sub
>;

/**
 * Props for the DropdownMenuSubTrigger component.
 * @param children - React children to render inside the sub trigger
 * @param inset - Whether the sub trigger should have inset padding
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 */
export type DropdownMenuSubTriggerProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.SubTrigger
> & {
  inset?: boolean;
  baseClassName?: string;
};

/**
 * Props for the DropdownMenuSubContent component.
 * @param children - React children to render inside the sub content
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 */
export type DropdownMenuSubContentProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.SubContent
> & {
  baseClassName?: string;
};

/**
 * Props for the DropdownMenuContent component.
 * @param children - React children to render inside the content
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 */
export type DropdownMenuContentProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Content
> & {
  baseClassName?: string;
};

/**
 * Tailwind variants for dropdown menu item styling.
 * Provides base styles and variant options for menu items.
 * @param variant - Visual variant: "default" for standard styling, "destructive" for destructive actions
 * @param inset - Whether to apply inset padding (pl-8)
 */
export const dropdownMenuItemStyles = tv({
  base: "relative flex flex-row cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  variants: {
    variant: {
      default:
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground",
      destructive:
        "text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20 focus:text-destructive *:[svg]:!text-destructive",
    },
    inset: {
      true: "pl-8",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Tailwind variants for dropdown menu checkbox item styling.
 * Provides base styles and icon positioning for checkbox menu items.
 * @param base - Base styles for the checkbox item container
 * @param icon - Styles for the check icon positioning
 */
export const dropdownMenuCheckboxItemStyles = tv({
  slots: {
    base: "focus:bg-accent focus:text-accent-foreground relative flex flex-row cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    icon: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
  },
});

/**
 * Tailwind variants for dropdown menu label styling.
 * Provides base styles and inset option for menu labels.
 * @param inset - Whether to apply inset padding (pl-8)
 */
export const dropdownMenuLabelStyles = tv({
  base: "px-2 py-1.5 text-sm font-medium flex flex-row",
  variants: {
    inset: {
      true: "pl-8",
    },
  },
});

/**
 * Tailwind variants for dropdown menu separator styling.
 * Provides base styles for menu separators.
 */
export const dropdownMenuSeparatorStyles = tv({
  base: "bg-border -mx-1 my-1 h-px flex flex-row",
});

/**
 * Tailwind variants for dropdown menu shortcut styling.
 * Provides base styles for keyboard shortcuts display.
 */
export const dropdownMenuShortcutStyles = tv({
  base: "text-muted-foreground ml-auto text-xs tracking-widest",
});

/**
 * Tailwind variants for dropdown menu sub trigger styling.
 * Provides base styles and inset option for sub menu triggers.
 * @param inset - Whether to apply inset padding (pl-8)
 */
export const dropdownMenuSubTriggerStyles = tv({
  base: "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
  variants: {
    inset: {
      true: "pl-8",
    },
  },
});

/**
 * Tailwind variants for dropdown menu sub content styling.
 * Provides base styles with animations and positioning for sub menu content.
 */
export const dropdownMenuSubContentStyles = tv({
  base: "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
});

/**
 * Tailwind variants for dropdown menu content styling.
 * Provides base styles with animations and positioning for main menu content.
 */
export const dropdownMenuContentStyles = tv({
  base: "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
});

/**
 * Root component for dropdown menu functionality.
 * Provides the context and state management for the dropdown menu.
 * @param props - Props for the dropdown menu root
 * @returns The dropdown menu root component
 */
export const DropdownMenu = DropdownMenuPrimitive.create(
  ({...props}: DropdownMenuProps) => {
    return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
  },
  "Root",
);

/**
 * Trigger component for the dropdown menu.
 * The element that opens the dropdown menu when activated.
 * @param props - Props for the dropdown menu trigger
 * @returns The dropdown menu trigger component
 */
export const DropdownMenuTrigger = DropdownMenuPrimitive.create(
  ({...props}: DropdownMenuTriggerProps) => {
    return (
      <DropdownMenuPrimitive.Trigger
        data-slot="dropdown-menu-trigger"
        {...props}
      />
    );
  },
  "Trigger",
);

/**
 * Group component for organizing dropdown menu items.
 * Used to group related menu items together.
 * @param props - Props for the dropdown menu group
 * @returns The dropdown menu group component
 */
export const DropdownMenuGroup = DropdownMenuPrimitive.create(
  ({...props}: DropdownMenuGroupProps) => {
    return (
      <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
    );
  },
  "Group",
);

/**
 * Individual menu item component for the dropdown menu.
 * Represents a clickable item within the dropdown menu.
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param inset - Whether the item should have inset padding
 * @param variant - Visual variant of the item: "default" | "destructive"
 * @param props - Additional props for the menu item
 * @returns The dropdown menu item component
 */
export const DropdownMenuItem = DropdownMenuPrimitive.create(
  ({
    className,
    baseClassName,
    inset,
    variant = "default",
    ...props
  }: DropdownMenuItemProps) => {
    return (
      <DropdownMenuPrimitive.Item
        data-slot="dropdown-menu-item"
        data-inset={inset}
        data-variant={variant}
        className={dropdownMenuItemStyles({
          variant,
          inset,
          class: baseClassName || className,
        })}
        {...props}
      />
    );
  },
  "Item",
);

/**
 * Checkbox menu item component for the dropdown menu.
 * Represents a menu item with checkbox functionality and visual indicator.
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param iconClassName - Custom tailwind classes to apply to the check icon
 * @param children - React children to render inside the checkbox item
 * @param checked - Whether the checkbox is checked
 * @param props - Additional props for the checkbox item
 * @returns The dropdown menu checkbox item component
 */
export const DropdownMenuCheckboxItem = DropdownMenuPrimitive.create(
  ({
    className,
    baseClassName,
    iconClassName,
    children,
    checked,
    ...props
  }: DropdownMenuCheckboxItemProps) => {
    const {base, icon} = dropdownMenuCheckboxItemStyles();
    return (
      <DropdownMenuPrimitive.CheckboxItem
        data-slot="dropdown-menu-checkbox-item"
        className={base({
          class: baseClassName || className,
        })}
        checked={checked}
        {...props}
      >
        <Text className={icon({class: iconClassName})}>
          <DropdownMenuPrimitive.ItemIndicator>
            <CheckIcon className="size-4" />
          </DropdownMenuPrimitive.ItemIndicator>
        </Text>
        {children}
      </DropdownMenuPrimitive.CheckboxItem>
    );
  },
  "CheckboxItem",
);

/**
 * Label component for the dropdown menu.
 * Used to provide section labels within the dropdown menu.
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param inset - Whether the label should have inset padding
 * @param props - Additional props for the label
 * @returns The dropdown menu label component
 */
export const DropdownMenuLabel = DropdownMenuPrimitive.create(
  ({className, baseClassName, inset, ...props}: DropdownMenuLabelProps) => {
    return (
      <DropdownMenuPrimitive.Label
        data-slot="dropdown-menu-label"
        data-inset={inset}
        className={dropdownMenuLabelStyles({
          inset,
          class: baseClassName || className,
        })}
        {...props}
      />
    );
  },
  "Label",
);

/**
 * Separator component for the dropdown menu.
 * Used to visually separate groups of menu items.
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param props - Additional props for the separator
 * @returns The dropdown menu separator component
 */
export const DropdownMenuSeparator = DropdownMenuPrimitive.create(
  ({className, baseClassName, ...props}: DropdownMenuSeparatorProps) => {
    return (
      <DropdownMenuPrimitive.Separator
        data-slot="dropdown-menu-separator"
        className={dropdownMenuSeparatorStyles({
          class: baseClassName || className,
        })}
        {...props}
      />
    );
  },
  "Separator",
);

/**
 * Shortcut component for the dropdown menu.
 * Used to display keyboard shortcuts for menu items.
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param props - Additional props for the shortcut text
 * @returns The dropdown menu shortcut component
 */
export function DropdownMenuShortcut({
  className,
  baseClassName,
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <Text
      data-slot="dropdown-menu-shortcut"
      className={dropdownMenuShortcutStyles({
        class: baseClassName || className,
      })}
      {...props}
    />
  );
}

/**
 * Sub menu component for the dropdown menu.
 * Provides context for nested menu items and sub triggers.
 * @param props - Props for the dropdown menu sub
 * @returns The dropdown menu sub component
 */
export const DropdownMenuSub = DropdownMenuPrimitive.create(
  ({...props}: DropdownMenuSubProps) => {
    return (
      <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
    );
  },
  "Sub",
);

/**
 * Sub trigger component for the dropdown menu.
 * Opens a sub menu when activated, includes a chevron icon.
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param inset - Whether the sub trigger should have inset padding
 * @param children - React children to render inside the sub trigger
 * @param props - Additional props for the sub trigger
 * @returns The dropdown menu sub trigger component
 */
export const DropdownMenuSubTrigger = DropdownMenuPrimitive.create(
  ({
    className,
    baseClassName,
    inset,
    children,
    ...props
  }: DropdownMenuSubTriggerProps) => {
    return (
      <DropdownMenuPrimitive.SubTrigger
        data-slot="dropdown-menu-sub-trigger"
        data-inset={inset}
        className={dropdownMenuSubTriggerStyles({
          inset,
          class: baseClassName || className,
        })}
        {...props}
      >
        {children}
        <ChevronRightIcon className="ml-auto size-4" />
      </DropdownMenuPrimitive.SubTrigger>
    );
  },
  "SubTrigger",
);

/**
 * Sub content component for the dropdown menu.
 * Contains the items for a sub menu with animations and positioning.
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param props - Additional props for the sub content
 * @returns The dropdown menu sub content component
 */
export const DropdownMenuSubContent = DropdownMenuPrimitive.create(
  ({className, baseClassName, ...props}: DropdownMenuSubContentProps) => {
    return (
      <DropdownMenuPrimitive.SubContent
        data-slot="dropdown-menu-sub-content"
        className={dropdownMenuSubContentStyles({
          class: baseClassName || className,
        })}
        {...props}
      />
    );
  },
  "SubContent",
);

/**
 * Content component for the dropdown menu.
 * Contains the main menu items with animations and positioning.
 * @param className - Additional CSS classes to apply
 * @param baseClassName - Custom tailwind classes to apply to the base component. Takes priority over className
 * @param props - Additional props for the content
 * @returns The dropdown menu content component
 */
export const DropdownMenuContent = DropdownMenuPrimitive.create(
  ({className, baseClassName, ...props}: DropdownMenuContentProps) => {
    return (
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        className={dropdownMenuContentStyles({
          class: baseClassName || className,
        })}
        {...props}
      />
    );
  },
  "Content",
);

/**
 * ItemTitle component for the dropdown menu.
 * Used to provide the title text for menu items.
 * @param props - Props for the item title
 * @returns The dropdown menu item title component
 */
export const DropdownMenuItemTitle = DropdownMenuPrimitive.ItemTitle;

/**
 * ItemSubtitle component for the dropdown menu.
 * Used to provide subtitle text for menu items.
 * @param props - Props for the item subtitle
 * @returns The dropdown menu item subtitle component
 */
export const DropdownMenuItemSubtitle = DropdownMenuPrimitive.ItemSubtitle;

/**
 * ItemIcon component for the dropdown menu.
 * Used to provide icons for menu items.
 * @param props - Props for the item icon
 * @returns The dropdown menu item icon component
 */
export const DropdownMenuItemIcon = DropdownMenuPrimitive.ItemIcon;

/**
 * ItemImage component for the dropdown menu.
 * Used to provide images for menu items.
 * @param props - Props for the item image
 * @returns The dropdown menu item image component
 */
export const DropdownMenuItemImage = DropdownMenuPrimitive.ItemImage;
