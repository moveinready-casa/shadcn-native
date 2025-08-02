import React from "react";
import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, render, fireEvent} from "@testing-library/react-native";
import {View, Text} from "react-native";
import {Checkbox} from "../checkbox";

describe("Checkbox", () => {
  afterEach(cleanup);

  describe("structure", () => {
    it("renders without crashing", () => {
      render(<Checkbox testID="checkbox" />);
    });

    it("renders with accessibility role of checkbox", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" />);
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.accessibilityRole).toBe("checkbox");
    });

    it("renders custom spinner when provided", () => {
      const CustomSpinner = () => (
        <Text testID="custom-spinner">Loading...</Text>
      );
      const {getByTestId} = render(
        <Checkbox testID="checkbox" loading spinner={<CustomSpinner />} />,
      );
      expect(getByTestId("custom-spinner")).toBeTruthy();
    });

    it("clones props to the nearest child when asChild is true", () => {
      const {getByTestId} = render(
        <Checkbox asChild>
          <View testID="child" />
        </Checkbox>,
      );
      expect(getByTestId("child")).toHaveProp("accessibilityRole", "checkbox");
    });
  });

  describe("props", () => {
    it("renders as checked when defaultChecked is true", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" defaultChecked />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.accessibilityState).toMatchObject({checked: true});
    });

    it("respects the controlled checked prop", () => {
      const {getByTestId, rerender} = render(
        <Checkbox testID="checkbox" checked={false} />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.accessibilityState).toMatchObject({checked: false});

      rerender(<Checkbox testID="checkbox" checked={true} />);
      expect(checkbox.props.accessibilityState).toMatchObject({checked: true});
    });

    it("sets accessibility state correctly when checked", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" defaultChecked />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.accessibilityState).toEqual({checked: true});
    });

    it("sets accessibility state correctly when disabled", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" disabled />);
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.accessibilityState).toEqual({disabled: true});
    });

    it("maintains indeterminate state and prevents toggle when indeterminate is true", () => {
      const onCheckedChange = jest.fn();
      const {getByTestId} = render(
        <Checkbox
          testID="checkbox"
          indeterminate
          onCheckedChange={onCheckedChange}
        />,
      );
      const checkbox = getByTestId("checkbox");

      expect(checkbox.props.accessibilityState).toEqual({checked: "mixed"});

      fireEvent.press(checkbox);

      expect(onCheckedChange).not.toHaveBeenCalled();
      expect(checkbox.props.accessibilityState).toEqual({checked: "mixed"});
    });
  });

  describe("style", () => {
    it("applies default size correctly", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" />);
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("h-4");
      expect(checkbox.props.className).toContain("w-4");
    });

    it("applies small size correctly", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" size="sm" />);
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("h-3");
      expect(checkbox.props.className).toContain("w-3");
    });

    it("applies large size correctly", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" size="lg" />);
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("h-5");
      expect(checkbox.props.className).toContain("w-5");
    });

    it("applies primary color correctly", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" color="primary" />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("bg-primary");
    });

    it("applies secondary color correctly", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" color="secondary" />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("bg-secondary");
    });

    it("applies success color correctly", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" color="success" />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("bg-success");
    });

    it("applies warning color correctly", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" color="warning" />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("bg-warning");
    });

    it("applies destructive color correctly", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" color="destructive" />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("bg-destructive");
    });

    it("applies none radius correctly", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" radius="none" />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("rounded-none");
    });

    it("applies sm radius correctly", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" radius="sm" />);
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("rounded-sm");
    });

    it("applies md radius correctly", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" radius="md" />);
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("rounded-md");
    });

    it("applies lg radius correctly", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" radius="lg" />);
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("rounded-lg");
    });

    it("applies full radius correctly", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" radius="full" />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("rounded-full");
    });

    it("applies disabled style correctly", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" disabled />);
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("opacity-50");
      expect(checkbox.props.accessibilityState).toEqual({disabled: true});
    });

    it("applies animate-pulse when loading is true", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" loading />);
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("animate-pulse");
    });

    it("applies line-through style when lineThrough is true", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" lineThrough />);
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("line-through");
    });

    it("applies custom className correctly", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" className="custom-class" />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("custom-class");
    });
  });

  describe("interaction", () => {
    it("toggles between checked and unchecked on press (uncontrolled)", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" defaultChecked={false} />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.accessibilityState).toMatchObject({checked: false});

      fireEvent.press(checkbox);
      expect(checkbox.props.accessibilityState).toMatchObject({checked: true});

      fireEvent.press(checkbox);
      expect(checkbox.props.accessibilityState).toMatchObject({checked: false});
    });

    it("calls onCheckedChange with the new value", () => {
      const onCheckedChange = jest.fn();
      const {getByTestId} = render(
        <Checkbox testID="checkbox" onCheckedChange={onCheckedChange} />,
      );
      const checkbox = getByTestId("checkbox");
      fireEvent.press(checkbox);
      expect(onCheckedChange).toHaveBeenCalledTimes(1);
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it("prevents interaction when loading", () => {
      const onCheckedChange = jest.fn();
      const {getByTestId} = render(
        <Checkbox
          testID="checkbox"
          loading
          onCheckedChange={onCheckedChange}
        />,
      );
      const checkbox = getByTestId("checkbox");
      fireEvent.press(checkbox);
      expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it("prevents interaction when disabled", () => {
      const onCheckedChange = jest.fn();
      const {getByTestId} = render(
        <Checkbox
          testID="checkbox"
          disabled
          onCheckedChange={onCheckedChange}
        />,
      );
      const checkbox = getByTestId("checkbox");
      fireEvent.press(checkbox);
      expect(onCheckedChange).not.toHaveBeenCalled();
      expect(checkbox.props.accessibilityState).toMatchObject({disabled: true});
    });
  });
});
