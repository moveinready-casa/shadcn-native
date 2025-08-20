import React from "react";
import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import {Text} from "react-native";
import {Input} from "../input";

describe("Input", () => {
  afterEach(cleanup);

  describe("structure", () => {
    it("renders without crashing", () => {
      render(<Input testID="input" />);
    });

    it("renders with accessibility role of text", () => {
      const {getAllByTestId} = render(<Input testID="input" />);
      const [wrapper] = getAllByTestId("input");
      expect(wrapper.props.accessibilityRole).toBe("text");
    });

    it("forwards native TextInput props (e.g. placeholder)", () => {
      const {getByPlaceholderText} = render(
        <Input testID="input" placeholder="Email" />,
      );
      const field = getByPlaceholderText("Email");
      expect(field.props.placeholder).toBe("Email");
    });
  });

  describe("props", () => {
    it("applies disabled state: non-editable and accessibilityState disabled", () => {
      const {getAllByTestId, getByPlaceholderText} = render(
        <Input testID="input" disabled placeholder="Disabled" />,
      );
      const [wrapper] = getAllByTestId("input");
      const field = getByPlaceholderText("Disabled");
      expect(wrapper.props.accessibilityState).toMatchObject({disabled: true});
      expect(field.props.editable).toBe(false);
      expect(wrapper.props.className).toContain("opacity-50");
    });

    it("applies readOnly: non-editable but not disabled for accessibility", () => {
      const {getAllByTestId, getByPlaceholderText} = render(
        <Input testID="input" readOnly placeholder="ReadOnly" />,
      );
      const [wrapper] = getAllByTestId("input");
      const field = getByPlaceholderText("ReadOnly");
      expect(field.props.editable).toBe(false);
      expect(wrapper.props.accessibilityState?.disabled).not.toBe(true);
    });

    it("marks input as required via styling classes", () => {
      const {getAllByTestId} = render(<Input testID="input" required />);
      const [wrapper] = getAllByTestId("input");
      expect(wrapper.props.className).toContain("after:text-destructive");
    });

    it("renders startContent and endContent", () => {
      const {getByTestId} = render(
        <Input
          testID="input"
          startContent={<Text testID="start-content">S</Text>}
          endContent={<Text testID="end-content">E</Text>}
        />,
      );
      expect(getByTestId("start-content")).toBeTruthy();
      expect(getByTestId("end-content")).toBeTruthy();
    });
  });

  describe("styles", () => {
    it.each<
      [variant: "shadcn" | "outlined" | "ghost", expectedClasses: string[]]
    >([
      ["shadcn", ["bg-background", "border", "border-primary"]],
      ["outlined", ["bg-transparent", "border", "border-primary"]],
      ["ghost", ["bg-transparent", "shadow-none", "border", "border-primary"]],
    ])("applies variant %s correctly", (variant, expectedClasses) => {
      const {getAllByTestId} = render(
        <Input testID="input" variant={variant} />,
      );
      const [wrapper] = getAllByTestId("input");
      for (const cls of expectedClasses) {
        expect(wrapper.props.className).toContain(cls);
      }
    });

    it.each<[size: "sm" | "md" | "lg" | "xl", expectedClasses: string[]]>([
      ["sm", ["h-8"]],
      ["md", ["h-9"]],
      ["lg", ["h-10"]],
      ["xl", ["h-12"]],
    ])("applies size %s correctly", (size, expectedClasses) => {
      const {getAllByTestId} = render(<Input testID="input" size={size} />);
      const [wrapper] = getAllByTestId("input");
      for (const cls of expectedClasses) {
        expect(wrapper.props.className).toContain(cls);
      }
    });

    it.each<
      [borderRadius: "none" | "sm" | "md" | "lg" | "xl", expectedClass: string]
    >([
      ["none", "rounded-none"],
      ["sm", "rounded-sm"],
      ["md", "rounded-md"],
      ["lg", "rounded-lg"],
      ["xl", "rounded-xl"],
    ])("applies borderRadius %s correctly", (borderRadius, expectedClass) => {
      const {getAllByTestId} = render(
        <Input testID="input" borderRadius={borderRadius} />,
      );
      const [wrapper] = getAllByTestId("input");
      expect(wrapper.props.className).toContain(expectedClass);
    });

    it.each<
      [color: "primary" | "secondary" | "success" | "warning" | "destructive"]
    >([["primary"], ["secondary"], ["success"], ["warning"], ["destructive"]])(
      "applies color %s on border",
      (color) => {
        const {getAllByTestId} = render(<Input testID="input" color={color} />);
        const [wrapper] = getAllByTestId("input");
        expect(wrapper.props.className).toContain(`border border-${color}`);
      },
    );

    it("emits a className string on wrapper", () => {
      const {getAllByTestId} = render(<Input testID="input" />);
      const [wrapper] = getAllByTestId("input");
      expect(typeof wrapper.props.className).toBe("string");
      expect(wrapper.props.className.length).toBeGreaterThan(0);
    });
  });

  describe("interaction", () => {
    it("calls onChangeText when text changes", () => {
      const onChangeText = jest.fn();
      const {getByPlaceholderText} = render(
        <Input
          testID="input"
          placeholder="Type here"
          onChangeText={onChangeText}
        />,
      );
      const field = getByPlaceholderText("Type here");
      fireEvent.changeText(field, "hello");
      expect(onChangeText).toHaveBeenCalledWith("hello");
    });

    it("shows clear button when clearable and value is not empty", () => {
      const {getByTestId} = render(
        <Input testID="input" clearable value="abc" />,
      );
      expect(getByTestId("input-clear-button")).toBeTruthy();
    });

    it("clears value when clear button is pressed", () => {
      const onChangeText = jest.fn();
      const {getByTestId} = render(
        <Input
          testID="input"
          clearable
          value="abc"
          onChangeText={onChangeText}
        />,
      );
      const clearBtn = getByTestId("input-clear-button");
      fireEvent.press(clearBtn);
      expect(onChangeText).toHaveBeenCalledWith("");
    });

    it("prevents input when disabled", () => {
      const onChangeText = jest.fn();
      const {getByPlaceholderText} = render(
        <Input
          testID="input"
          disabled
          placeholder="Disabled"
          onChangeText={onChangeText}
        />,
      );
      const field = getByPlaceholderText("Disabled");
      fireEvent.changeText(field, "x");
      expect(onChangeText).not.toHaveBeenCalled();
    });

    it("prevents input when readOnly", () => {
      const onChangeText = jest.fn();
      const {getByPlaceholderText} = render(
        <Input
          testID="input"
          readOnly
          placeholder="ReadOnly"
          onChangeText={onChangeText}
        />,
      );
      const field = getByPlaceholderText("ReadOnly");
      fireEvent.changeText(field, "x");
      expect(onChangeText).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("is accessible by default", () => {
      const {getAllByTestId} = render(<Input testID="input" />);
      const [wrapper] = getAllByTestId("input");
      expect(wrapper.props.accessible).toBe(true);
    });
  });
});
