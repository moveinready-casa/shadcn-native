import React from "react";
import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, render, fireEvent} from "@testing-library/react-native";
import {Text, View, Platform} from "react-native";
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

    it("applies fullWidth class when fullWidth is true", () => {
      const {getByTestId} = render(
        <Button testID="button" fullWidth>
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.className).toContain("w-full");
    });

    it("applies baseClassName correctly", () => {
      const {getByTestId} = render(
        <Button testID="button" baseClassName="custom-base-class">
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.className).toContain("custom-base-class");
    });
  });

  describe("Classes", () => {
    describe("Variants", () => {
      it.each([
        {variant: "default", expectedClasses: ["bg-primary"]},
        {variant: "destructive", expectedClasses: ["bg-destructive"]},
        {variant: "warning", expectedClasses: ["bg-warning"]},
        {variant: "outline", expectedClasses: ["border", "bg-background"]},
        {variant: "secondary", expectedClasses: ["bg-secondary"]},
        {variant: "ghost", expectedClasses: ["hover:bg-accent"]},
        {variant: "link", expectedClasses: ["underline-offset-4"]},
      ])("applies $variant variant correctly", ({variant, expectedClasses}) => {
        const {getByTestId} = render(
          <Button testID="button" variant={variant as any}>
            Button
          </Button>,
        );
        const button = getByTestId("button");
        expectedClasses.forEach((className) => {
          expect(button.props.className).toContain(className);
        });
      });
    });

    describe("Sizes", () => {
      it.each([
        {size: "sm", expectedClasses: ["h-8", "px-3"]},
        {size: "md", expectedClasses: ["h-9", "px-4"]},
        {size: "lg", expectedClasses: ["h-10", "px-6"]},
        {size: "xl", expectedClasses: ["h-11", "px-8"]},
        {size: "icon", expectedClasses: ["size-9"]},
      ])("applies $size size correctly", ({size, expectedClasses}) => {
        const {getByTestId} = render(
          <Button testID="button" size={size as any}>
            Button
          </Button>,
        );
        const button = getByTestId("button");
        expectedClasses.forEach((className) => {
          expect(button.props.className).toContain(className);
        });
      });
    });

    describe("Border Radius", () => {
      it.each([
        {borderRadius: "none", expectedClass: "rounded-none"},
        {borderRadius: "sm", expectedClass: "rounded-sm"},
        {borderRadius: "md", expectedClass: "rounded-md"},
        {borderRadius: "lg", expectedClass: "rounded-lg"},
        {borderRadius: "xl", expectedClass: "rounded-xl"},
      ])(
        "applies $borderRadius radius correctly",
        ({borderRadius, expectedClass}) => {
          const {getByTestId} = render(
            <Button testID="button" borderRadius={borderRadius as any}>
              Button
            </Button>,
          );
          expect(getByTestId("button").props.className).toContain(
            expectedClass,
          );
        },
      );
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

    it("applies baseClassName with higher priority than variant", () => {
      const {getByTestId} = render(
        <Button testID="button" variant="default" baseClassName="bg-blue-500">
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.className).toContain("bg-blue-500");
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

    it("prevents press events when both loading and disabled", () => {
      const onPress = jest.fn();
      const {getByTestId} = render(
        <Button testID="button" loading disabled onPress={onPress}>
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

    it("sets accessibility state when loading", () => {
      const {getByTestId} = render(
        <Button testID="button" loading>
          Button
        </Button>,
      );
      const button = getByTestId("button");
      expect(button.props.accessibilityState).toEqual({disabled: true});
    });

    it("sets accessible to true", () => {
      const {getByTestId} = render(<Button testID="button">Button</Button>);
      const button = getByTestId("button");
      expect(button.props.accessible).toBe(true);
    });
  });

  describe("State Management", () => {
    it("tracks pressed state correctly", () => {
      const onPressStart = jest.fn();
      const onPressEnd = jest.fn();
      const {getByTestId} = render(
        <Button
          testID="button"
          onPressStart={onPressStart}
          onPressEnd={onPressEnd}
        >
          Button
        </Button>,
      );
      const button = getByTestId("button");

      fireEvent(button, "pressIn");
      expect(onPressStart).toHaveBeenCalledTimes(1);

      fireEvent(button, "pressOut");
      expect(onPressEnd).toHaveBeenCalledTimes(1);
    });

    it("handles focus ring state on web", () => {
      const {getByTestId} = render(<Button testID="button">Button</Button>);
      const button = getByTestId("button");

      // Focus ring props should be applied on web
      if (Platform.OS === "web") {
        expect(button.props.onFocus).toBeDefined();
        expect(button.props.onBlur).toBeDefined();
      }
    });
  });
});
