import React from "react";
import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import {Text, View} from "react-native";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "../button-group";
import {Button} from "../button";

describe("ButtonGroup", () => {
  afterEach(cleanup);

  describe("Structure and rendering", () => {
    it("renders without crashing", () => {
      render(
        <ButtonGroup testID="button-group">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
        </ButtonGroup>,
      );
    });

    it("renders all children correctly", () => {
      const {getByTestId} = render(
        <ButtonGroup testID="button-group">
          <Button testID="button-1">Button 1</Button>
          <Button testID="button-2">Button 2</Button>
        </ButtonGroup>,
      );

      expect(getByTestId("button-group")).toBeTruthy();
      expect(getByTestId("button-1")).toBeTruthy();
      expect(getByTestId("button-2")).toBeTruthy();
    });

    it("renders with ButtonGroupSeparator and ButtonGroupText", () => {
      const {getByTestId, getByText} = render(
        <ButtonGroup testID="button-group">
          <ButtonGroupText testID="text">Label</ButtonGroupText>
          <Button testID="button-1">Button 1</Button>
          <ButtonGroupSeparator testID="separator" />
          <Button testID="button-2">Button 2</Button>
        </ButtonGroup>,
      );

      expect(getByTestId("button-group")).toBeTruthy();
      expect(getByText("Label")).toBeTruthy();
      expect(getByTestId("button-1")).toBeTruthy();
      expect(getByTestId("separator")).toBeTruthy();
      expect(getByTestId("button-2")).toBeTruthy();
    });
  });

  describe("Orientation prop", () => {
    it("applies horizontal orientation by default", () => {
      const {getByTestId} = render(
        <ButtonGroup testID="button-group">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
        </ButtonGroup>,
      );

      const group = getByTestId("button-group");
      expect(group.props.className).toContain("flex-row");
    });

    it("applies vertical orientation correctly", () => {
      const {getByTestId} = render(
        <ButtonGroup testID="button-group" orientation="vertical">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
        </ButtonGroup>,
      );

      const group = getByTestId("button-group");
      expect(group.props.className).toContain("flex-col");
      expect(group.props.className).not.toContain("flex-row");
    });
  });

  describe("Accessibility", () => {
    it("has accessibility role of group", () => {
      const {getByTestId} = render(
        <ButtonGroup testID="button-group">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
        </ButtonGroup>,
      );

      const group = getByTestId("button-group");
      expect(group.props.accessible).toBe(true);
    });

    it("applies aria-label when provided", () => {
      const {getByTestId} = render(
        <ButtonGroup testID="button-group" aria-label="Action buttons">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
        </ButtonGroup>,
      );

      const group = getByTestId("button-group");
      expect(group.props["aria-label"]).toBe("Action buttons");
    });
  });

  describe("Nested ButtonGroups", () => {
    it("renders nested ButtonGroups correctly", () => {
      const {getByTestId} = render(
        <ButtonGroup testID="outer-group">
          <ButtonGroup testID="inner-group-1">
            <Button testID="button-1">Button 1</Button>
            <Button testID="button-2">Button 2</Button>
          </ButtonGroup>
          <ButtonGroup testID="inner-group-2">
            <Button testID="button-3">Button 3</Button>
          </ButtonGroup>
        </ButtonGroup>,
      );

      expect(getByTestId("outer-group")).toBeTruthy();
      expect(getByTestId("inner-group-1")).toBeTruthy();
      expect(getByTestId("inner-group-2")).toBeTruthy();
      expect(getByTestId("button-1")).toBeTruthy();
      expect(getByTestId("button-3")).toBeTruthy();
    });
  });

  describe("Classes and styling", () => {
    it("applies custom className correctly", () => {
      const {getByTestId} = render(
        <ButtonGroup testID="button-group" className="custom-class">
          <Button>Button 1</Button>
        </ButtonGroup>,
      );

      const group = getByTestId("button-group");
      expect(group.props.className).toContain("custom-class");
      expect(group.props.className).toContain("flex");
    });

    it("baseClassName takes priority over className", () => {
      const {getByTestId} = render(
        <ButtonGroup
          testID="button-group"
          baseClassName="base-priority"
          className="regular-class"
        >
          <Button>Button 1</Button>
        </ButtonGroup>,
      );

      const group = getByTestId("button-group");
      expect(group.props.className).toContain("base-priority");
      expect(group.props.className).not.toContain("regular-class");
    });
  });

  describe("AsChild behavior", () => {
    it("clones props to child when asChild is true", () => {
      const {getByTestId} = render(
        <ButtonGroup asChild orientation="vertical" className="custom-class">
          <View testID="child">
            <Text>Custom Group</Text>
          </View>
        </ButtonGroup>,
      );

      const child = getByTestId("child");
      expect(child.props.className).toContain("flex-col");
      expect(child.props.className).toContain("custom-class");
    });
  });

  describe("Button interaction", () => {
    it("buttons within group are independently pressable", () => {
      const onPress1 = jest.fn();
      const onPress2 = jest.fn();

      const {getByTestId} = render(
        <ButtonGroup testID="button-group">
          <Button testID="button-1" onPress={onPress1}>
            Button 1
          </Button>
          <Button testID="button-2" onPress={onPress2}>
            Button 2
          </Button>
        </ButtonGroup>,
      );

      fireEvent.press(getByTestId("button-1"));
      expect(onPress1).toHaveBeenCalledTimes(1);
      expect(onPress2).not.toHaveBeenCalled();

      fireEvent.press(getByTestId("button-2"));
      expect(onPress2).toHaveBeenCalledTimes(1);
    });

    it("supports buttons with different variants and sizes", () => {
      const {getByTestId} = render(
        <ButtonGroup testID="button-group">
          <Button testID="button-default" variant="default" size="sm">
            Default
          </Button>
          <Button testID="button-outline" variant="outline" size="lg">
            Outline
          </Button>
        </ButtonGroup>,
      );

      expect(getByTestId("button-default").props.className).toContain(
        "bg-primary",
      );
      expect(getByTestId("button-default").props.className).toContain("h-8");
      expect(getByTestId("button-outline").props.className).toContain("border");
      expect(getByTestId("button-outline").props.className).toContain("h-10");
    });
  });

  describe("Disabled state", () => {
    it("applies disabled styling and prevents interaction", () => {
      const onPress = jest.fn();

      const {getByTestId} = render(
        <ButtonGroup testID="button-group">
          <Button testID="button-enabled" onPress={onPress}>
            Enabled
          </Button>
          <Button testID="button-disabled" disabled onPress={onPress}>
            Disabled
          </Button>
        </ButtonGroup>,
      );

      const disabledButton = getByTestId("button-disabled");
      expect(disabledButton.props.className).toContain("opacity-50");
      expect(disabledButton.props.accessibilityState).toEqual({disabled: true});
      expect(disabledButton.props.onPress).toBeUndefined();

      fireEvent.press(getByTestId("button-enabled"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("supports mixed disabled and enabled states", () => {
      const onPress = jest.fn();

      const {getByTestId} = render(
        <ButtonGroup testID="button-group">
          <Button testID="button-1" onPress={onPress}>
            Button 1
          </Button>
          <Button testID="button-2" disabled onPress={onPress}>
            Button 2
          </Button>
          <Button testID="button-3" onPress={onPress}>
            Button 3
          </Button>
        </ButtonGroup>,
      );

      fireEvent.press(getByTestId("button-1"));
      fireEvent.press(getByTestId("button-3"));
      expect(onPress).toHaveBeenCalledTimes(2);
      expect(getByTestId("button-2").props.onPress).toBeUndefined();
    });
  });

  describe("Loading state", () => {
    it("shows loading indicator and prevents interaction", () => {
      const onPress = jest.fn();

      const {getByTestId} = render(
        <ButtonGroup testID="button-group">
          <Button testID="button-loading" loading onPress={onPress}>
            Loading
          </Button>
        </ButtonGroup>,
      );

      const loadingButton = getByTestId("button-loading");
      expect(getByTestId("button-loading-loading-spinner")).toBeTruthy();
      expect(loadingButton.props.onPress).toBeUndefined();
      expect(loadingButton.props.accessibilityState).toEqual({disabled: true});
    });

    it("supports mixed loading and normal states", () => {
      const onPress = jest.fn();

      const {getByTestId} = render(
        <ButtonGroup testID="button-group">
          <Button testID="button-normal" onPress={onPress}>
            Normal
          </Button>
          <Button testID="button-loading" loading onPress={onPress}>
            Loading
          </Button>
        </ButtonGroup>,
      );

      fireEvent.press(getByTestId("button-normal"));
      expect(onPress).toHaveBeenCalledTimes(1);
      expect(getByTestId("button-loading").props.onPress).toBeUndefined();
    });

    it("handles both disabled and loading simultaneously", () => {
      const {getByTestId} = render(
        <ButtonGroup testID="button-group">
          <Button testID="button" disabled loading>
            Button
          </Button>
        </ButtonGroup>,
      );

      const button = getByTestId("button");
      expect(getByTestId("button-loading-spinner")).toBeTruthy();
      expect(button.props.accessibilityState).toEqual({disabled: true});
      expect(button.props.onPress).toBeUndefined();
    });
  });
});

describe("ButtonGroupSeparator", () => {
  afterEach(cleanup);

  describe("Structure and rendering", () => {
    it("renders without crashing", () => {
      render(
        <ButtonGroup>
          <Button>Button 1</Button>
          <ButtonGroupSeparator testID="separator" />
          <Button>Button 2</Button>
        </ButtonGroup>,
      );
    });
  });

  describe("Orientation prop", () => {
    it("applies vertical orientation by default", () => {
      const {getByTestId} = render(
        <ButtonGroup>
          <Button>Button 1</Button>
          <ButtonGroupSeparator testID="separator" />
          <Button>Button 2</Button>
        </ButtonGroup>,
      );

      const separator = getByTestId("separator");
      expect(separator.props.className).toContain("h-full");
      expect(separator.props.className).toContain("w-px");
    });

    it("applies horizontal orientation correctly", () => {
      const {getByTestId} = render(
        <ButtonGroup orientation="vertical">
          <Button>Button 1</Button>
          <ButtonGroupSeparator testID="separator" orientation="horizontal" />
          <Button>Button 2</Button>
        </ButtonGroup>,
      );

      const separator = getByTestId("separator");
      expect(separator.props.className).toContain("h-px");
      expect(separator.props.className).toContain("w-full");
    });
  });

  describe("Classes and styling", () => {
    it("applies default and custom classes correctly", () => {
      const {getByTestId} = render(
        <ButtonGroup>
          <Button>Button 1</Button>
          <ButtonGroupSeparator testID="separator" className="custom-class" />
          <Button>Button 2</Button>
        </ButtonGroup>,
      );

      const separator = getByTestId("separator");
      expect(separator.props.className).toContain("bg-border");
      expect(separator.props.className).toContain("shrink-0");
      expect(separator.props.className).toContain("custom-class");
    });
  });

  describe("Accessibility", () => {
    it("is decorative by default", () => {
      const {getByTestId} = render(
        <ButtonGroup>
          <Button>Button 1</Button>
          <ButtonGroupSeparator testID="separator" />
          <Button>Button 2</Button>
        </ButtonGroup>,
      );

      const separator = getByTestId("separator");
      expect(separator.props.accessibilityRole).toBeUndefined();
      expect(separator.props.accessible).toBeUndefined();
    });

    it("sets accessibility attributes when decorative is false", () => {
      const {getByTestId} = render(
        <ButtonGroup>
          <Button>Button 1</Button>
          <ButtonGroupSeparator
            testID="separator"
            decorative={false}
            orientation="horizontal"
          />
          <Button>Button 2</Button>
        </ButtonGroup>,
      );

      const separator = getByTestId("separator");
      expect(separator.props.accessibilityRole).toBe("separator");
      expect(separator.props["aria-orientation"]).toBe("horizontal");
    });
  });
});

describe("ButtonGroupText", () => {
  afterEach(cleanup);

  describe("Structure and rendering", () => {
    it("renders without crashing", () => {
      render(
        <ButtonGroup>
          <ButtonGroupText testID="text">Label</ButtonGroupText>
          <Button>Button</Button>
        </ButtonGroup>,
      );
    });

    it("renders text content correctly", () => {
      const {getByTestId, getByText} = render(
        <ButtonGroup>
          <ButtonGroupText testID="text">Input Label</ButtonGroupText>
          <Button>Button</Button>
        </ButtonGroup>,
      );

      expect(getByTestId("text")).toBeTruthy();
      expect(getByText("Input Label")).toBeTruthy();
    });
  });

  describe("Classes and styling", () => {
    it("applies custom className correctly", () => {
      const {getByTestId} = render(
        <ButtonGroup>
          <ButtonGroupText testID="text" className="custom-text-class">
            Label
          </ButtonGroupText>
          <Button>Button</Button>
        </ButtonGroup>,
      );

      const text = getByTestId("text");
      expect(text.props.className).toContain("custom-text-class");
    });
  });

  describe("AsChild prop", () => {
    it("clones props to child when asChild is true", () => {
      const {getByTestId} = render(
        <ButtonGroup>
          <ButtonGroupText asChild className="custom-class">
            <Text testID="child">Label</Text>
          </ButtonGroupText>
          <Button>Button</Button>
        </ButtonGroup>,
      );

      const child = getByTestId("child");
      expect(child.props.className).toContain("custom-class");
    });

    it("works with custom Label component", () => {
      const CustomLabel = ({children, ...props}: any) => (
        <Text testID="custom-label" {...props}>
          {children}
        </Text>
      );

      const {getByTestId} = render(
        <ButtonGroup>
          <ButtonGroupText asChild className="label-class">
            <CustomLabel>Label Text</CustomLabel>
          </ButtonGroupText>
          <Button>Button</Button>
        </ButtonGroup>,
      );

      const label = getByTestId("custom-label");
      expect(label).toBeTruthy();
      expect(label.props.className).toContain("label-class");
    });
  });
});

describe("ButtonGroup Integration", () => {
  afterEach(cleanup);

  it("renders split button pattern", () => {
    const onPressMain = jest.fn();
    const onPressDropdown = jest.fn();

    const {getByTestId} = render(
      <ButtonGroup testID="split-button">
        <Button testID="main-action" onPress={onPressMain}>
          Save
        </Button>
        <ButtonGroupSeparator testID="separator" />
        <Button testID="dropdown-trigger" onPress={onPressDropdown}>
          ▼
        </Button>
      </ButtonGroup>,
    );

    expect(getByTestId("split-button")).toBeTruthy();
    expect(getByTestId("separator")).toBeTruthy();

    fireEvent.press(getByTestId("main-action"));
    fireEvent.press(getByTestId("dropdown-trigger"));
    expect(onPressMain).toHaveBeenCalledTimes(1);
    expect(onPressDropdown).toHaveBeenCalledTimes(1);
  });

  it("renders input group pattern", () => {
    const MockInput = (props: any) => (
      <View testID="input" {...props}>
        <Text>Input</Text>
      </View>
    );

    const {getByTestId} = render(
      <ButtonGroup testID="input-group">
        <ButtonGroupText testID="label">Search:</ButtonGroupText>
        <MockInput />
        <Button testID="submit">Go</Button>
      </ButtonGroup>,
    );

    expect(getByTestId("input-group")).toBeTruthy();
    expect(getByTestId("label")).toBeTruthy();
    expect(getByTestId("input")).toBeTruthy();
    expect(getByTestId("submit")).toBeTruthy();
  });

  it("handles mixed states in complex layouts", () => {
    const onPress = jest.fn();

    const {getByTestId} = render(
      <ButtonGroup testID="toolbar" orientation="horizontal">
        <Button testID="button-1" onPress={onPress}>
          Normal
        </Button>
        <Button testID="button-2" loading onPress={onPress}>
          Loading
        </Button>
        <ButtonGroupSeparator testID="separator" />
        <Button testID="button-3" disabled onPress={onPress}>
          Disabled
        </Button>
        <Button testID="button-4" onPress={onPress}>
          Normal
        </Button>
      </ButtonGroup>,
    );

    fireEvent.press(getByTestId("button-1"));
    fireEvent.press(getByTestId("button-4"));
    expect(onPress).toHaveBeenCalledTimes(2);

    expect(getByTestId("button-2-loading-spinner")).toBeTruthy();
    expect(getByTestId("button-2").props.onPress).toBeUndefined();
    expect(getByTestId("button-3").props.onPress).toBeUndefined();
  });
});
