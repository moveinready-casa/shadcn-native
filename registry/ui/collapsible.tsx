import React, {
  ComponentProps,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import {Platform, Pressable, View} from "react-native";
import {useButton} from "@react-aria/button";
import {useFocusRing} from "@react-aria/focus";

export type CollapsibleProps = {
  /**
   * When provided, the component becomes controlled.
   */
  open?: boolean;
  /**
   * Initial open state when uncontrolled.
   */
  defaultOpen?: boolean;
  /**
   * Called whenever the open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Prevents user interaction.
   */
  disabled?: boolean;
};

export type CollapsibleState = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

export type CollapsibleReturn = {
  state: CollapsibleState;
  componentProps: ComponentProps<typeof View>;
};

export type CollapsibleComponentProps = {
  children: React.ReactNode;
  /**
   * When true, props are cloned onto the immediate child instead of wrapping in
   * an extra `View` element.
   */
  asChild?: boolean;
  /**
   * Optional className (Tailwind/nativewind). Not used in tests but added for
   * API parity with existing components.
   */
  baseClassName?: string;
} & CollapsibleProps &
  ComponentProps<typeof View>;

export type CollapsibleTriggerComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
} & ComponentProps<typeof Pressable>;

export type CollapsibleContentComponentProps = {
  children: React.ReactNode;
  asChild?: boolean;
} & ComponentProps<typeof View>;

export type CollapsibleContextValue = CollapsibleReturn & {
  props: CollapsibleProps;
};

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

/**
 * Manages state and accessibility props for a collapsible region.
 * @param open - Controlled open state; component is controlled when provided.
 * @param defaultOpen - Uncontrolled initial open state.
 * @param onOpenChange - Callback fired when the open state changes.
 * @param disabled - When true, user interaction is disabled.
 * @returns Object with current state and accessibility props to spread on the
 * root element.
 */
export const useCollapsible = ({
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
}: CollapsibleProps): CollapsibleReturn => {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  useEffect(() => {
    if (!isControlled) {
      setInternalOpen(defaultOpen);
    }
  }, [defaultOpen]);

  const isOpen = isControlled ? open! : internalOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (disabled) return;
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [disabled, isControlled, onOpenChange],
  );

  return {
    state: {isOpen, setOpen},
    componentProps: {
      accessibilityState: {expanded: isOpen},
    },
  };
};

/**
 * Returns accessibility-complete props for a pressable element that toggles
 * the collapsible region.
 * @returns triggerProps - Props to spread onto the trigger element.
 */
export const useCollapsibleTrigger = (): {
  triggerProps: ComponentProps<typeof Pressable>;
} => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error("CollapsibleTrigger must be used within a Collapsible");
  }

  const {
    state: {isOpen, setOpen},
    props: {disabled = false},
  } = context;

  const ref = useRef<HTMLButtonElement | null>(null);

  const {buttonProps} = useButton(
    {
      isDisabled: disabled,
      onPress: () => setOpen(!isOpen),
    },
    ref,
  );

  const {focusProps} = useFocusRing();

  return {
    triggerProps: {
      ...(Platform.OS === "web" ? buttonProps : {}),
      ...(Platform.OS === "web" ? focusProps : {}),
      onPress: () => setOpen(!isOpen),
      disabled,
      accessibilityRole: "button",
      accessibilityState: {expanded: isOpen, disabled},
      accessibilityHint: isOpen
        ? "Collapse the content"
        : "Expands the content",
    } as ComponentProps<typeof Pressable>,
  };
};

/**
 * Root component that provides context for a collapsible section.
 * @param children - Trigger and content elements (or a single child when `asChild` is true).
 * @param asChild - If true, the root will clone its only child rather than creating an additional wrapper element.
 * @param baseClassName - Tailwind/nativewind classes applied to the root view.
 * @param open - Controlled open state.
 * @param defaultOpen - Initial uncontrolled open state.
 * @param onOpenChange - Callback invoked when the open state changes.
 * @param disabled - Disables user interaction when true.
 * @param props - Additional `View` props passed through to the root element.
 */
export function Collapsible({
  children,
  asChild = false,
  baseClassName,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  ...props
}: PropsWithChildren<CollapsibleComponentProps>) {
  const collapsibleProps = useCollapsible({
    open,
    defaultOpen,
    onOpenChange,
    disabled,
    ...props,
  });

  const contextProps: CollapsibleContextValue = {
    ...collapsibleProps,
    props: {open, defaultOpen, onOpenChange, disabled},
  };

  const renderProps = {
    ...collapsibleProps.componentProps,
    ...props,
    className: baseClassName || props.className,
  };

  return (
    <CollapsibleContext.Provider value={contextProps}>
      {asChild ? (
        React.cloneElement(
          React.Children.only(children) as React.ReactElement,
          {
            ...renderProps,
          },
        )
      ) : (
        <View {...renderProps}>{children}</View>
      )}
    </CollapsibleContext.Provider>
  );
}

/**
 * Interactive element that toggles the associated `CollapsibleContent`.
 * @param children - Node rendered inside the trigger.
 * @param asChild - If true, clones the only child instead of rendering a Pressable wrapper.
 * @param props - Additional Pressable props.
 */
export function CollapsibleTrigger({
  children,
  asChild = false,
  ...props
}: PropsWithChildren<CollapsibleTriggerComponentProps>) {
  const {triggerProps} = useCollapsibleTrigger();

  return asChild ? (
    React.cloneElement(React.Children.only(children) as React.ReactElement, {
      ...triggerProps,
      ...props,
    })
  ) : (
    <Pressable {...triggerProps} {...props}>
      {children}
    </Pressable>
  );
}

/**
 * Region that is shown or hidden based on the current open state.
 * @param children - Content to render inside the region.
 * @param asChild - If true, clones the only child and controls its visibility rather than adding wrapper views.
 * @param props - Additional `View` props.
 */
export function CollapsibleContent({
  children,
  asChild = false,
  ...props
}: PropsWithChildren<CollapsibleContentComponentProps>) {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error("CollapsibleContent must be used within a Collapsible");
  }

  const {
    state: {isOpen},
  } = context;

  return asChild ? (
    isOpen ? (
      React.cloneElement(
        React.Children.only(children) as React.ReactElement,
        Object.assign(
          {},
          props,
          (React.Children.only(children) as React.ReactElement).props,
        ),
      )
    ) : null
  ) : (
    <>
      {isOpen && (
        <View
          {...props}
          accessible={true}
          accessibilityElementsHidden={!isOpen}
        >
          {children}
        </View>
      )}
    </>
  );
}
