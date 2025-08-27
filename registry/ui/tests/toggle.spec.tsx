import React from "react";
import {afterEach, describe, expect, it, jest, test} from "@jest/globals";
import {cleanup, render, fireEvent} from "@testing-library/react-native";
import {Text, View} from "react-native";
import {Toggle} from "../toggle.tsx";

describe("Toggle", () => {
  afterEach(cleanup);

  describe("structure", () => {
    it("renders without crashing", () => {
      render(
        <Toggle testID="toggle" aria-label="Toggle bold">
          Toggle
        </Toggle>,
      );
    });

    it("renders with accessibility role of button", () => {
      const {getByTestId} = render(
        <Toggle testID="toggle" aria-label="Toggle italic" />,
      );
      const toggle = getByTestId("toggle");
      expect(toggle.props.accessibilityRole).toBe("button");
    });
  });

  describe("props", () => {
    it("respects defaultPressed (uncontrolled)", () => {
      const {getByTestId} = render(
        <Toggle testID="toggle" defaultPressed aria-label="Toggle italic" />,
      );
      const toggle = getByTestId("toggle");
      expect(toggle.props.accessibilityState).toMatchObject({selected: true});
    });

    it("respects the controlled pressed prop", () => {
      const {getByTestId, rerender} = render(
        <Toggle testID="toggle" pressed={false} aria-label="Toggle italic" />,
      );
      const toggle = getByTestId("toggle");
      expect(toggle.props.accessibilityState).toMatchObject({selected: false});

      rerender(
        <Toggle testID="toggle" pressed={true} aria-label="Toggle italic" />,
      );
      expect(toggle.props.accessibilityState).toMatchObject({selected: true});
    });

    it("calls onPressedChange with the new value on press (uncontrolled)", () => {
      const onPressedChange = jest.fn();
      const {getByTestId} = render(
        <Toggle
          testID="toggle"
          defaultPressed={false}
          onPressedChange={onPressedChange}
          aria-label="Toggle italic"
        />,
      );
      const toggle = getByTestId("toggle");
      fireEvent.press(toggle);
      expect(onPressedChange).toHaveBeenCalledTimes(1);
      expect(onPressedChange).toHaveBeenCalledWith(true);
    });

    it("does not change visual state when controlled without rerender", () => {
      const onPressedChange = jest.fn();
      const {getByTestId} = render(
        <Toggle
          testID="toggle"
          pressed={false}
          onPressedChange={onPressedChange}
          aria-label="Toggle italic"
        />,
      );
      const toggle = getByTestId("toggle");
      fireEvent.press(toggle);
      expect(onPressedChange).toHaveBeenCalledWith(true);
      expect(toggle.props.accessibilityState).toMatchObject({selected: false});
    });

    it("prevents interaction when disabled", () => {
      const onPressedChange = jest.fn();
      const onPress = jest.fn();
      const {getByTestId} = render(
        <Toggle
          testID="toggle"
          disabled
          onPressedChange={onPressedChange}
          onPress={onPress}
          aria-label="Toggle italic"
        />,
      );
      const toggle = getByTestId("toggle");
      fireEvent.press(toggle);
      expect(onPressedChange).not.toHaveBeenCalled();
      expect(onPress).not.toHaveBeenCalled();
      expect(toggle.props.accessibilityState).toMatchObject({disabled: true});
    });

    it("applies custom className correctly", () => {
      const {getByTestId} = render(
        <Toggle testID="toggle" className="custom-class" aria-label="t" />,
      );
      const toggle = getByTestId("toggle");
      expect(toggle.props.className).toContain("custom-class");
    });

    it("clones props to the nearest child when asChild is true", () => {
      const {getByTestId} = render(
        <Toggle asChild variant="outline" aria-label="Toggle">
          <View testID="child">
            <Text>Custom</Text>
          </View>
        </Toggle>,
      );

      const child = getByTestId("child");
      expect(child).toBeTruthy();
      expect(child.props.className).toContain("border");
    });
  });

  describe("style", () => {
    describe("variants", () => {
      test.each([
        {
          variant: "default",
          expectedClasses: ["bg-transparent", "rounded-md", "text-sm"],
        },
        {
          variant: "outline",
          expectedClasses: ["border", "border-input", "bg-transparent"],
        },
      ])(
        "applies $variant variant correctly",
        ({
          variant,
          expectedClasses,
        }: {
          variant: string;
          expectedClasses: string[];
        }) => {
          const {getByTestId} = render(
            <Toggle
              testID="toggle"
              variant={variant as "default" | "outline"}
              aria-label="t"
            />,
          );
          const toggle = getByTestId("toggle");
          expectedClasses.forEach((className: string) => {
            expect(toggle.props.className).toContain(className);
          });
        },
      );
    });

    it("applies selected styles when pressed is true (controlled)", () => {
      const {getByTestId} = render(
        <Toggle testID="toggle" pressed aria-label="t" />,
      );
      const toggle = getByTestId("toggle");
      expect(toggle.props.accessibilityState).toMatchObject({selected: true});
      expect(toggle.props.className).toContain("bg-accent");
      expect(toggle.props.className).toContain("text-accent-foreground");
    });

    describe("sizes", () => {
      test.each([
        {
          size: "sm",
          expectedClasses: ["h-8", "px-1.5", "min-w-8"],
        },
        {
          size: "md",
          expectedClasses: ["h-9", "px-2", "min-w-9"],
        },
        {
          size: "lg",
          expectedClasses: ["h-10", "px-2.5", "min-w-10"],
        },
        {
          size: "xl",
          expectedClasses: ["h-11", "px-3", "min-w-11"],
        },
      ])(
        "applies $size size correctly",
        ({
          size,
          expectedClasses,
        }: {
          size: string;
          expectedClasses: string[];
        }) => {
          const {getByTestId} = render(
            <Toggle
              testID="toggle"
              size={size as "sm" | "md" | "lg" | "xl"}
              aria-label="t"
            />,
          );
          const toggle = getByTestId("toggle");
          expectedClasses.forEach((className: string) => {
            expect(toggle.props.className).toContain(className);
          });
        },
      );
    });

    it("applies disabled style correctly", () => {
      const {getByTestId} = render(
        <Toggle testID="toggle" disabled aria-label="t" />,
      );
      const toggle = getByTestId("toggle");
      expect(toggle.props.className).toContain("opacity-50");
      expect(toggle.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe("interaction", () => {
    it("toggles selection on press (uncontrolled)", () => {
      const {getByTestId} = render(
        <Toggle testID="toggle" defaultPressed={false} aria-label="t" />,
      );
      const toggle = getByTestId("toggle");
      expect(toggle.props.accessibilityState.selected).toBe(false);

      fireEvent.press(toggle);
      expect(toggle.props.accessibilityState.selected).toBe(true);

      fireEvent.press(toggle);
      expect(toggle.props.accessibilityState.selected).toBe(false);
    });

    it("calls onPress when pressed", () => {
      const onPress = jest.fn();
      const {getByTestId} = render(
        <Toggle testID="toggle" onPress={onPress} aria-label="t" />,
      );
      const toggle = getByTestId("toggle");
      fireEvent.press(toggle);
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });
});
