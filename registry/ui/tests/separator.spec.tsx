import React from "react";
import {afterEach, describe, expect, it} from "@jest/globals";
import {cleanup, render} from "@testing-library/react-native";
import {View} from "react-native";
import {Separator} from "../separator.tsx";

describe("Separator", () => {
  afterEach(cleanup);

  describe("structure", () => {
    it("renders without crashing", () => {
      render(<Separator testID="separator" />);
    });
  });

  describe("accessibility", () => {
    it("does not set accessibility attributes by default (decorative)", () => {
      const {getByTestId} = render(<Separator testID="separator" />);
      const sep = getByTestId("separator");
      expect(sep.props.accessibilityRole).toBeUndefined();
      expect(sep.props.role).toBeUndefined();
      expect(sep.props["aria-orientation"]).toBeUndefined();
      expect(sep.props.accessible).toBeUndefined();
    });

    it("sets accessibility attributes when decorative is false", () => {
      const {getByTestId} = render(
        <Separator decorative={false} testID="separator" />,
      );
      const sep = getByTestId("separator");
      expect(sep.props.accessibilityRole).toBe("separator");
      expect(sep.props.role).toBe("separator");
      expect(sep.props["aria-orientation"]).toBe("horizontal");
      expect(sep.props["aria-hidden"]).toBeUndefined();
    });
  });

  describe("orientation and classes", () => {
    it("defaults to horizontal classes and no aria-orientation when decorative (default)", () => {
      const {getByTestId} = render(<Separator testID="separator" />);
      const sep = getByTestId("separator");
      const cls: string = sep.props.className || "";
      ["shrink-0", "bg-border", "h-px", "w-full"].forEach((token) => {
        expect(cls).toContain(token);
      });
      expect(sep.props["aria-orientation"]).toBeUndefined();
    });

    it("applies vertical orientation classes (decorative)", () => {
      const {getByTestId} = render(
        <Separator orientation="vertical" testID="separator" />,
      );
      const sep = getByTestId("separator");
      const cls: string = sep.props.className || "";
      ["h-full", "w-px"].forEach((token) => {
        expect(cls).toContain(token);
      });
      expect(sep.props["aria-orientation"]).toBeUndefined();
    });

    it("sets aria-orientation when decorative is false", () => {
      const {getByTestId} = render(
        <Separator
          orientation="vertical"
          decorative={false}
          testID="separator"
        />,
      );
      const sep = getByTestId("separator");
      expect(sep.props["aria-orientation"]).toBe("vertical");
    });
  });

  describe("asChild and styling", () => {
    it("clones props to child when asChild is true (decorative=false)", () => {
      const {getByTestId} = render(
        <Separator asChild decorative={false} baseClassName="bg-red-500">
          <View testID="child" />
        </Separator>,
      );
      const child = getByTestId("child");
      expect(child.props.className).toContain("bg-red-500");
      expect(child.props.accessibilityRole).toBe("separator");
    });

    it("applies className when baseClassName is not provided", () => {
      const {getByTestId} = render(
        <Separator testID="separator" className="only-class" />,
      );
      expect(getByTestId("separator").props.className).toContain("only-class");
    });

    it("uses baseClassName when provided (taking precedence over className)", () => {
      const {getByTestId} = render(
        <Separator
          testID="separator"
          baseClassName="base-x"
          className="extra-y"
        />,
      );
      const node = getByTestId("separator");
      expect(node.props.className).toContain("base-x");
      expect(node.props.className).not.toContain("extra-y");
    });
  });
});
