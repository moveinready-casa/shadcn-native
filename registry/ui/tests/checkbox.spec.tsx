import React from "react";
import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, render, fireEvent} from "@testing-library/react-native";
import {Checkbox} from "../checkbox.tsx";

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
      expect(checkbox.props.accessibilityState.checked).toBe(true);
    });

    it("sets accessibility state correctly when disabled", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" disabled />);
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.accessibilityState.disabled).toBe(true);
    });

    it("maintains indeterminate state and prevents toggle when indeterminate is true", () => {
      const onCheckedChange = jest.fn();
      const {getByTestId} = render(
        <Checkbox
          testID="checkbox"
          checked="indeterminate"
          onCheckedChange={onCheckedChange}
        />,
      );
      const checkbox = getByTestId("checkbox");

      expect(checkbox.props.accessibilityState.checked).toBe("mixed");

      fireEvent.press(checkbox);

      expect(onCheckedChange).not.toHaveBeenCalled();
      expect(checkbox.props.accessibilityState.checked).toBe("mixed");
    });
  });

  describe("style", () => {
    it("applies default size correctly", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" />);
      const icon = getByTestId("checkbox-icon");
      expect(icon.props.style.height).toBe(14); // h-3.5 = 14px
      expect(icon.props.style.width).toBe(14); // w-3.5 = 14px
    });

    it("applies small size correctly", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" size="sm" />);
      const icon = getByTestId("checkbox-icon");
      expect(icon.props.style.height).toBe(8); // h-2 = 8px
      expect(icon.props.style.width).toBe(8); // w-2 = 8px
    });

    it("applies large size correctly", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" size="lg" />);
      const icon = getByTestId("checkbox-icon");
      expect(icon.props.style.height).toBe(20); // h-5 = 20px
      expect(icon.props.style.width).toBe(20); // w-5 = 20px
    });

    it("applies xl size correctly", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" size="xl" />);
      const icon = getByTestId("checkbox-icon");
      expect(icon.props.style.height).toBe(24); // h-6 = 24px
      expect(icon.props.style.width).toBe(24); // w-6 = 24px
    });

    it("applies primary color correctly", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" color="primary" defaultChecked />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("bg-primary");
    });

    it("applies secondary color correctly", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" color="secondary" defaultChecked />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("bg-secondary");
    });

    it("applies success color correctly", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" color="success" defaultChecked />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("bg-success");
    });

    it("applies warning color correctly", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" color="warning" defaultChecked />,
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("bg-warning");
    });

    it("applies destructive color correctly", () => {
      const {getByTestId} = render(
        <Checkbox testID="checkbox" color="destructive" defaultChecked />,
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
      expect(checkbox.props.className).toContain("rounded-[4px]");
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
      expect(checkbox.props.accessibilityState.disabled).toBe(true);
    });

    it("applies animate-pulse when loading is true", () => {
      const {getByTestId} = render(<Checkbox testID="checkbox" loading />);
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.className).toContain("animate-pulse");
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
      expect(checkbox.props.accessibilityState.checked).toBe(false);

      fireEvent.press(checkbox);
      expect(checkbox.props.accessibilityState.checked).toBe(true);

      fireEvent.press(checkbox);
      expect(checkbox.props.accessibilityState.checked).toBe(false);
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
      expect(checkbox.props.accessibilityState.disabled).toBe(true);
    });
  });
});
