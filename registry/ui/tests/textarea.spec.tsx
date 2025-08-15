import React from "react";
import {afterEach, describe, expect, it} from "@jest/globals";
import {cleanup, render} from "@testing-library/react-native";
import {Textarea} from "../textarea";

describe("Textarea", () => {
  afterEach(cleanup);

  describe("Props", () => {
    it("renders without crashing", () => {
      render(<Textarea testID="textarea" />);
    });

    it("renders with placeholder text", () => {
      const {getByTestId} = render(
        <Textarea testID="textarea" placeholder="Enter text here" />,
      );
      const textarea = getByTestId("textarea");
      expect(textarea.props.placeholder).toBe("Enter text here");
    });

    it("renders with value", () => {
      const {getByTestId} = render(
        <Textarea testID="textarea" value="Sample text" />,
      );
      const textarea = getByTestId("textarea");
      expect(textarea.props.value).toBe("Sample text");
    });

    it("renders with multiline prop", () => {
      const {getByTestId} = render(<Textarea testID="textarea" />);
      const textarea = getByTestId("textarea");
      expect(textarea.props.multiline).toBe(true);
    });
  });

  describe("Styles", () => {
    describe("Variants", () => {
      const variants = [
        {variant: "shadcn", expectedClass: "border-input"},
        {variant: "ghost", expectedClass: "bg-transparent"},
      ];

      variants.forEach(({variant, expectedClass}) => {
        it(`applies ${variant} variant correctly`, () => {
          const {getByTestId} = render(
            <Textarea
              testID="textarea"
              variant={variant as "shadcn" | "ghost"}
            />,
          );
          const textarea = getByTestId("textarea");
          expect(textarea.props.className).toContain(expectedClass);
        });
      });
    });

    describe("Colors", () => {
      const colors = [
        {color: "default", expectedClass: "focus-visible:ring-ring"},
        {color: "secondary", expectedClass: "focus-visible:ring-secondary"},
        {color: "destructive", expectedClass: "focus-visible:ring-destructive"},
        {color: "warning", expectedClass: "focus-visible:ring-warning"},
        {color: "success", expectedClass: "focus-visible:ring-success"},
      ];

      colors.forEach(({color, expectedClass}) => {
        it(`applies ${color} color correctly`, () => {
          const {getByTestId} = render(
            <Textarea
              testID="textarea"
              color={
                color as
                  | "default"
                  | "secondary"
                  | "destructive"
                  | "warning"
                  | "success"
              }
            />,
          );
          const textarea = getByTestId("textarea");
          expect(textarea.props.className).toContain(expectedClass);
        });
      });
    });

    describe("Border Radius", () => {
      const borderRadii = [
        {borderRadius: "none", expectedClass: "rounded-none"},
        {borderRadius: "sm", expectedClass: "rounded-sm"},
        {borderRadius: "md", expectedClass: "rounded-md"},
        {borderRadius: "lg", expectedClass: "rounded-lg"},
        {borderRadius: "xl", expectedClass: "rounded-xl"},
      ];

      borderRadii.forEach(({borderRadius, expectedClass}) => {
        it(`applies ${borderRadius} border radius correctly`, () => {
          const {getByTestId} = render(
            <Textarea
              testID="textarea"
              borderRadius={borderRadius as "none" | "sm" | "md" | "lg" | "xl"}
            />,
          );
          const textarea = getByTestId("textarea");
          expect(textarea.props.className).toContain(expectedClass);
        });
      });
    });

    it("applies disabled style correctly", () => {
      const {getByTestId} = render(<Textarea testID="textarea" disabled />);
      const textarea = getByTestId("textarea");
      expect(textarea.props.className).toContain("opacity-50");
    });

    it("applies loading style correctly", () => {
      const {getByTestId} = render(<Textarea testID="textarea" loading />);
      const textarea = getByTestId("textarea");
      expect(textarea.props.className).toContain("opacity-80");
      expect(textarea.props.className).toContain("animate-pulse");
    });

    it("applies base className correctly", () => {
      const {getByTestId} = render(
        <Textarea testID="textarea" baseClassName="custom-base-class" />,
      );
      const textarea = getByTestId("textarea");
      expect(textarea.props.className).toContain("custom-base-class");
    });

    it("applies className prop correctly", () => {
      const {getByTestId} = render(
        <Textarea testID="textarea" className="custom-class" />,
      );
      const textarea = getByTestId("textarea");
      expect(textarea.props.className).toContain("custom-class");
    });

    it("prioritizes baseClassName over className", () => {
      const {getByTestId} = render(
        <Textarea
          testID="textarea"
          baseClassName="base-class"
          className="regular-class"
        />,
      );
      const textarea = getByTestId("textarea");
      expect(textarea.props.className).toContain("base-class");
      expect(textarea.props.className).not.toContain("regular-class");
    });
  });
});
