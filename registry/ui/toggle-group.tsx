import {
  AriaToggleButtonGroupItemProps,
  useToggleButtonGroup,
  useToggleButtonGroupItem,
} from "@react-aria/button";
import React, {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {Platform, Pressable, View} from "react-native";
import {tv} from "tailwind-variants";
import {toggle} from "./toggle";

export type ToggleGroupProps = {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
  rovingFocus?: boolean;
  orientation?: "horizontal" | "vertical";
};

export type ToggleGroupReturn = {
  state: {
    selected: string | string[];
    setSelected: (value: string | string[]) => void;
  };
  componentProps: ComponentProps<typeof View> | HTMLDivElement;
};

export type ToggleGroupItemProps = {
  value: string;
  disabled?: boolean;
  props: ToggleGroupReturn;
};

export type ToggleGroupItemReturn = {
  state: {selected: boolean; setSelected: (selected: boolean) => void};
  componentProps: ComponentProps<typeof Pressable> | HTMLButtonElement;
};

export type ToggleGroupComponentProps = {
  asChild?: boolean;
  baseClassName?: string;
} & ToggleGroupProps &
  ComponentProps<typeof View>;

export type ToggleGroupItemComponentProps = {
  asChild?: boolean;
  baseClassName?: string;
} & Omit<ToggleGroupItemProps, "props"> &
  ComponentProps<typeof Pressable>;

export const useToggleGroup = ({
  type = "single",
  value,
  defaultValue,
  onValueChange,
  disabled,
  rovingFocus,
  orientation,
}: ToggleGroupProps): ToggleGroupReturn => {
  const [selected, setSelected] = useState<string | string[]>(
    value ?? defaultValue ?? [],
  );

  useEffect(() => {
    if (value) {
      onValueChange?.(value);
    }
  }, [value]);

  const groupRef = useRef<View | HTMLDivElement>(null);

  const {groupProps: ariaGroupProps} = useToggleButtonGroup(
    {
      orientation,
      selectionMode: type,
      isDisabled: disabled,
      selectedKeys: selected,
    },
    {
      selectionMode: type,
      isDisabled: disabled || false,
      selectedKeys: new Set(selected),
      toggleKey: (key) => {
        console.log(key, selected);
        if (type === "single" && key !== selected) {
          setSelected(String(key));
        } else if (type === "single" && key === selected) {
          setSelected("");
        } else if (type === "multiple" && selected.includes(String(key))) {
          setSelected((selected as string[]).filter((k) => k !== String(key)));
        } else if (type === "multiple" && !selected.includes(String(key))) {
          setSelected([...selected, String(key)]);
        }
      },
      setSelected: (key) => {
        console.log(key, selected);
        setSelected(String(key));
      },
      setSelectedKeys: (keys) => {
        console.log("slected");
        setSelected(Array.from(keys) as string[]);
      },
    },
    groupRef,
  );

  return {
    state: {selected, setSelected},
    componentProps: {
      ...(Platform.OS === "web" ? ariaGroupProps : {}),
      ...(rovingFocus ? {onKeyPress: () => {}} : {}),
    },
  };
};

export const useToggleGroupItem = ({
  value,
  disabled,
  props,
}: ToggleGroupItemProps): ToggleGroupItemReturn => {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (
      props.state.selected === value ||
      props.state.selected.includes(value)
    ) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [props.state.selected, value]);

  const handlePress = (key: string) => {
    const currentSelected = props.state.selected;
    const keyStr = String(key);

    if (currentSelected.includes(keyStr)) {
      props.state.setSelected(
        (currentSelected as string[]).filter((k) => k !== keyStr),
      );
    } else {
      props.state.setSelected([...currentSelected, keyStr]);
    }
    if (currentSelected === keyStr) {
      props.state.setSelected("");
    } else {
      props.state.setSelected(keyStr);
    }
  };

  const itemRef = useRef<typeof Pressable | HTMLButtonElement>(null);
  const ariaItemProps = useToggleButtonGroupItem(
    {
      ...props.componentProps,
      isDisabled: disabled,
    } as AriaToggleButtonGroupItemProps,
    {
      selectionMode: Array.isArray(props.state.selected)
        ? "multiple"
        : "single",
      isDisabled: disabled || false,
      selectedKeys: new Set(
        Array.isArray(props.state.selected)
          ? props.state.selected
          : [props.state.selected].filter(Boolean),
      ),
      toggleKey: (key) => handlePress(String(key)),
      setSelected: (key, isSelected) => {
        const keyStr = String(key);
        const currentSelected = props.state.selected;

        if (isSelected && !currentSelected.includes(keyStr)) {
          props.state.setSelected([...currentSelected, keyStr]);
        } else if (!isSelected && currentSelected.includes(keyStr)) {
          props.state.setSelected(
            (currentSelected as string[]).filter((k) => k !== keyStr),
          );
        } else {
          props.state.setSelected(isSelected ? keyStr : "");
        }
      },
      setSelectedKeys: (keys) => {
        const keysArray = Array.from(keys).map(String);
        props.state.setSelected(keysArray);
      },
    },
    itemRef,
  );

  return {
    state: {selected, setSelected},
    componentProps: {
      ...(Platform.OS === "web" ? ariaItemProps : {}),
      onPress: () => handlePress(value),
    },
  };
};

export const toggleGroup = tv({
  base: "flex items-center justify-center gap-1",
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export const ToggleGroupContext = createContext<ToggleGroupReturn | null>(null);

export function ToggleGroup({
  children,
  asChild,
  type = "single",
  value,
  defaultValue,
  onValueChange,
  disabled,
  rovingFocus,
  orientation,
  baseClassName,
  ...props
}: ToggleGroupComponentProps) {
  const {state, componentProps} = useToggleGroup({
    type,
    value,
    defaultValue,
    onValueChange,
    disabled,
    rovingFocus,
    orientation,
  });

  const renderProps = {
    ...componentProps,
    ...props,
    className: toggleGroup({
      orientation,
      className: baseClassName || props.className,
    }),
  } as ComponentProps<typeof View>;

  return (
    <ToggleGroupContext.Provider value={{state, componentProps}}>
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
    </ToggleGroupContext.Provider>
  );
}

export function ToggleGroupItem({
  children,
  asChild,
  value,
  disabled,
  baseClassName,
  ...props
}: ToggleGroupItemComponentProps) {
  const context = useContext(ToggleGroupContext);
  if (!context) {
    throw new Error("ToggleGroupItem must be used within a ToggleGroup");
  }

  const {state, componentProps} = useToggleGroupItem({
    value,
    disabled,
    props: context,
  });

  const renderProps = {
    ...componentProps,
    ...props,
    className: toggle({
      selected: state.selected,
      disabled: disabled,
      className: baseClassName || props.className,
    }),
  };

  return asChild ? (
    React.cloneElement(React.Children.only(children) as React.ReactElement, {
      ...renderProps,
    })
  ) : (
    <Pressable {...renderProps}>{children}</Pressable>
  );
}
