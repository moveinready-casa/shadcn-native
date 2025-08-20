"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {tv} from "tailwind-variants";
import {ThemeContext, themes} from "../theme";

/**
 * Tailwind variant function for tooltip content styling.
 * Provides base styles and animations for tooltip content elements.
 *
 * @returns Tailwind variant function with tooltip content styles
 */
export const tooltipContent = tv({
  base: "z-50 overflow-hidden rounded-[0.375rem] px-3 py-1.5 text-xs animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
});

/**
 * Provider component for tooltip context.
 * Must wrap the application or component tree where tooltips are used.
 * Provides the necessary context for tooltip positioning and state management.
 */
export const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Root tooltip component that manages the tooltip's open/close state.
 * Wraps the trigger and content to provide tooltip functionality.
 */
export const Tooltip = TooltipPrimitive.Root;

/**
 * Component that triggers the tooltip to appear.
 * Usually wraps the element that should show the tooltip on hover or focus.
 */
export const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * The content component that displays the tooltip information.
 * Renders the actual tooltip content with proper positioning and animations.
 *
 * @param className - Additional CSS classes to apply to the tooltip content
 * @param sideOffset - Distance offset from the trigger element (default: 4)
 * @param props - Additional props passed to the underlying Radix tooltip content
 * @returns Rendered tooltip content with theme-aware styling
 */
export const TooltipContent = ({
  children,
  className,
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) => {
  const {colorScheme} = React.useContext(ThemeContext);
  const colorStyles = {
    backgroundColor: themes[colorScheme]["--primary"],
    color: themes[colorScheme]["--primary-foreground"],
  };
  const colorArrowStyles = {
    backgroundColor: themes[colorScheme]["--primary"],
    fill: themes[colorScheme]["--primary"],
  };
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={tooltipContent({className: className})}
        style={colorStyles}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow
          className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
          style={colorArrowStyles}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
};
