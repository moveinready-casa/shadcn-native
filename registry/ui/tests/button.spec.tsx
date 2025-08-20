import React from "react";
import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, render, fireEvent} from "@testing-library/react-native";
import {Text, View} from "react-native";
import {Button} from "../button";

describe("Button", () => {
  afterEach(cleanup);

  describe("Props", () => {
    it("renders without crashing", () => {
      render(<Button>Button</Button>);
    });

    it("shows loading indicator when loading is true", () => {
      const {getByTestId} = render(
        <Button testID="button" loading>
          Button
        </Button>,
      );
      expect(getByTestId("button-loading-spinner")).toBeTruthy();
    });

    it("renders custom spinner when provided", () => {
      const CustomSpinner = () => <Text testID="custom-spinner">Loading</Text>;
      const {getByTestId} = render(
        <Button testID="button" loading spinner={<CustomSpinner />}>
          Button
        </Button>,
      );
      expect(getByTestId("custom-spinner")).toBeTruthy();
    });

    it("renders start content correctly", () => {
      const StartIcon = () => <Text testID="start-icon">→</Text>;
      const {getByTestId} = render(
        <Button testID="button" startContent={<StartIcon />}>
          Button
        </Button>,
      );
      expect(getByTestId("start-icon")).toBeTruthy();
    });

    it("renders end content correctly", () => {
      const EndIcon = () => <Text testID="end-icon">←</Text>;
      const {getByTestId} = render(
        <Button testID="button" endContent={<EndIcon />}>
          Button
        </Button>,
      );
      expect(getByTestId("end-icon")).toBeTruthy();
    });

    it("clones props to the nearest child when asChild is true", () => {
      const {getByTestId} = render(
        <Button asChild variant="destructive">
          <View testID="child">
            <Text>Custom Button</Text>
          </View>
        </Button>,
      );

      const child = getByTestId("child");
      expect(child).toBeTruthy();
      expect(child.props.className).toContain("bg-destructive");
    });
  });

  describe("Classes", () => {
    it("applies default variant correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" variant="default">
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.className).toContain("bg-primary");
    });

    it("applies destructive variant correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" variant="destructive">
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.className).toContain("bg-destructive");
    });

    it("applies outline variant correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" variant="outline">
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.className).toContain("border");
      expect(button.props.className).toContain("bg-background");
    });

    it("applies secondary variant correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" variant="secondary">
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.className).toContain("bg-secondary");
    });

    it("applies ghost variant correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" variant="ghost">
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.className).toContain("hover:bg-accent");
    });

    it("applies link variant correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" variant="link">
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.className).toContain("underline-offset-4");
    });

    it("applies default size correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" size="default">
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.className).toContain("h-9");
      expect(button.props.className).toContain("px-4");
    });

    it("applies sm size correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" size="sm">
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.className).toContain("h-8");
      expect(button.props.className).toContain("px-3");
    });

    it("applies lg size correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" size="lg">
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.className).toContain("h-10");
      expect(button.props.className).toContain("px-6");
    });

    it("applies icon size correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" size="icon">
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.className).toContain("size-9");
    });

    it("applies none radius correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" borderRadius="none">
          Button
        </Button>,
      );
      expect(getByTestId("button").props.className).toContain("rounded-none");
    });

    it("applies sm radius correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" borderRadius="sm">
          Button
        </Button>,
      );
      expect(getByTestId("button").props.className).toContain("rounded-sm");
    });

    it("applies md radius correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" borderRadius="md">
          Button
        </Button>,
      );
      expect(getByTestId("button").props.className).toContain("rounded-md");
    });

    it("applies lg radius correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" borderRadius="lg">
          Button
        </Button>,
      );
      expect(getByTestId("button").props.className).toContain("rounded-lg");
    });

    it("applies xl radius correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" borderRadius="xl">
          Button
        </Button>,
      );
      expect(getByTestId("button").props.className).toContain("rounded-xl");
    });

    it("applies disabled style correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" disabled>
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.className).toContain("opacity-50");
    });

    it("applies custom className correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" className="custom-class">
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.className).toContain("custom-class");
    });
  });

  describe("Interaction", () => {
    it("calls onPress when pressed", () => {
      const onPress = jest.fn();
      const {getByTestId} = render(
        <Button testID="button" onPress={onPress}>
          Button
        </Button>,
      );
      const button = getByTestId("button");
      fireEvent.press(button);
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("calls onPressStart when press starts", () => {
      const onPressStart = jest.fn();
      const {getByTestId} = render(
        <Button testID="button" onPressStart={onPressStart}>
          Button
        </Button>,
      );
      const button = getByTestId("button");
      fireEvent(button, "pressIn");
      expect(onPressStart).toHaveBeenCalledTimes(1);
    });

    it("calls onPressEnd when press ends", () => {
      const onPressEnd = jest.fn();
      const {getByTestId} = render(
        <Button testID="button" onPressEnd={onPressEnd}>
          Button
        </Button>,
      );
      const button = getByTestId("button");
      fireEvent(button, "pressOut");
      expect(onPressEnd).toHaveBeenCalledTimes(1);
    });

    it("prevents press events when disabled", () => {
      const onPress = jest.fn();
      const {getByTestId} = render(
        <Button testID="button" disabled onPress={onPress}>
          Button
        </Button>,
      );
      const button = getByTestId("button");

      expect(button.props.onPress).toBeUndefined();
      expect(button.props.accessibilityState).toEqual({disabled: true});
    });

    it("disables interaction when loading", () => {
      const onPress = jest.fn();
      const {getByTestId} = render(
        <Button testID="button" loading onPress={onPress}>
          Button
        </Button>,
      );
      const button = getByTestId("button");

      expect(button.props.onPress).toBeUndefined();
      expect(button.props.accessibilityState).toEqual({disabled: true});
    });
  });

  describe("Accessibility", () => {
    it("renders with accessibility role of button", () => {
      const {getByTestId} = render(<Button testID="button">Button</Button>);
      const button = getByTestId("button");
      expect(button.props.accessibilityRole).toBe("button");
    });

    it("sets accessibility state when disabled", () => {
      const {getByTestId} = render(
        <Button testID="button" disabled>
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.accessibilityState).toEqual({disabled: true});
    });
  });
});
