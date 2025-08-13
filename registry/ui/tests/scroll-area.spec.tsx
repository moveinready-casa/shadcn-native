import React from "react";
import {afterEach, describe, expect, it} from "@jest/globals";
import {cleanup, render} from "@testing-library/react-native";
import {ScrollArea} from "../scroll-area";
import {Text, View} from "react-native";

describe("ScrollArea", () => {
  afterEach(cleanup);

  describe("structure", () => {
    it("renders without crashing", () => {
      render(<ScrollArea testID="scroll-area">Content</ScrollArea>);
    });
  });

  describe("classes", () => {
    const radii = [
      ["none", "rounded-none"],
      ["sm", "rounded-sm"],
      ["md", "rounded-md"],
      ["lg", "rounded-lg"],
      ["xl", "rounded-xl"],
    ] as const;

    it.each(radii)(
      "applies borderRadius=%s",
      (radius: "none" | "sm" | "md" | "lg" | "xl", expectedClass: string) => {
        const {getByTestId} = render(
          <ScrollArea testID="scroll-area" borderRadius={radius}>
            Content
          </ScrollArea>,
        );
        const root = getByTestId("scroll-area");
        expect(root.props.className).toContain(expectedClass);
      },
    );

    it("applies disabled style when disabled is true", () => {
      const {getByTestId} = render(
        <ScrollArea testID="scroll-area" disabled>
          Content
        </ScrollArea>,
      );
      const root = getByTestId("scroll-area");
      expect(root.props.className).toContain("opacity-50");
    });

    it("applies loading style when loading is true", () => {
      const {getByTestId} = render(
        <ScrollArea testID="scroll-area" loading>
          Content
        </ScrollArea>,
      );
      const root = getByTestId("scroll-area");
      expect(root.props.className).toContain("animate-pulse");
    });

    it("applies className when baseClassName is not provided", () => {
      const {getByTestId} = render(
        <ScrollArea testID="scroll-area" className="only-class">
          Content
        </ScrollArea>,
      );
      const root = getByTestId("scroll-area");
      expect(root.props.className).toContain("only-class");
    });

    it("uses baseClassName when provided (taking precedence over className)", () => {
      const {getByTestId} = render(
        <ScrollArea
          testID="scroll-area"
          baseClassName="base-x"
          className="extra-y"
        >
          Content
        </ScrollArea>,
      );
      const root = getByTestId("scroll-area");
      expect(root.props.className).toContain("base-x");
      expect(root.props.className).not.toContain("extra-y");
    });
  });

  describe("behavior", () => {
    it("disables scrolling when disabled is true", () => {
      const {getByTestId} = render(
        <ScrollArea testID="scroll-area" disabled>
          Content
        </ScrollArea>,
      );
      const root = getByTestId("scroll-area");
      expect(root.props.scrollEnabled).toBe(false);
    });

    it("disables scrolling when loading is true", () => {
      const {getByTestId} = render(
        <ScrollArea testID="scroll-area" loading>
          Content
        </ScrollArea>,
      );
      const root = getByTestId("scroll-area");
      expect(root.props.scrollEnabled).toBe(false);
    });

    it("allows scrolling when both disabled and loading are false", () => {
      const {getByTestId} = render(
        <ScrollArea testID="scroll-area">Content</ScrollArea>,
      );
      const root = getByTestId("scroll-area");
      expect(root.props.scrollEnabled).toBe(true);
    });

    it("clones props to child when asChild is true", () => {
      const {getByTestId} = render(
        <ScrollArea asChild>
          <View testID="child" />
        </ScrollArea>,
      );
      const child = getByTestId("child");
      expect(child.props.className).toBeDefined();
    });

    it("passes through underlying ScrollView props (e.g., accessibilityLabel)", () => {
      const {getByTestId} = render(
        <ScrollArea
          testID="scroll-area"
          accessibilityLabel="Scrollable content"
        >
          <Text>Content</Text>
        </ScrollArea>,
      );
      const root = getByTestId("scroll-area");
      expect(root.props.accessibilityLabel).toBe("Scrollable content");
    });
  });
});
