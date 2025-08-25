import React from "react";
import {afterEach, describe, expect, it} from "@jest/globals";
import {cleanup, render} from "@testing-library/react-native";
import {Text} from "react-native";
import {Badge} from "../badge";

describe("Badge", () => {
  afterEach(cleanup);

  describe("Structure and rendering", () => {
    it("renders without crashing", () => {
      render(<Badge>Badge</Badge>);
    });

    it("renders its children", () => {
      const {getByText} = render(<Badge testID="badge">Content</Badge>);
      expect(getByText("Content")).toBeTruthy();
    });
  });

  describe("Variant styling", () => {
    it("applies default variant correctly", () => {
      const {getByTestId} = render(
        <Badge testID="badge" variant="default">
          Badge
        </Badge>,
      );
      const badge = getByTestId("badge");
      expect(badge.props.className).toContain("bg-primary");
    });

    it("applies secondary variant correctly", () => {
      const {getByTestId} = render(
        <Badge testID="badge" variant="secondary">
          Badge
        </Badge>,
      );
      const badge = getByTestId("badge");
      expect(badge.props.className).toContain("bg-secondary");
    });

    it("applies destructive variant correctly", () => {
      const {getByTestId} = render(
        <Badge testID="badge" variant="destructive">
          Badge
        </Badge>,
      );
      const badge = getByTestId("badge");
      expect(badge.props.className).toContain("bg-destructive");
    });

    it("applies outline variant correctly", () => {
      const {getByTestId} = render(
        <Badge testID="badge" variant="outline">
          Badge
        </Badge>,
      );
      const badge = getByTestId("badge");
      expect(badge.props.className).toContain("border");
    });
  });

  describe("Border radius variants", () => {
    it("applies none radius correctly", () => {
      const {getByTestId} = render(
        <Badge testID="badge" borderRadius="none">
          Badge
        </Badge>,
      );
      expect(getByTestId("badge").props.className).toContain("rounded-none");
    });

    it("applies sm radius correctly", () => {
      const {getByTestId} = render(
        <Badge testID="badge" borderRadius="sm">
          Badge
        </Badge>,
      );
      expect(getByTestId("badge").props.className).toContain("rounded-sm");
    });

    it("applies md radius correctly", () => {
      const {getByTestId} = render(
        <Badge testID="badge" borderRadius="md">
          Badge
        </Badge>,
      );
      expect(getByTestId("badge").props.className).toContain("rounded-md");
    });

    it("applies lg radius correctly", () => {
      const {getByTestId} = render(
        <Badge testID="badge" borderRadius="lg">
          Badge
        </Badge>,
      );
      expect(getByTestId("badge").props.className).toContain("rounded-lg");
    });
  });

  describe("Disabled state", () => {
    it("applies disabled style correctly", () => {
      const {getByTestId} = render(
        <Badge testID="badge" disabled>
          Badge
        </Badge>,
      );
      const badge = getByTestId("badge");
      expect(badge.props.className).toContain("opacity-50");
      expect(badge.props.accessibilityState).toEqual({disabled: true});
    });
  });

  describe("Indicator", () => {
    it("renders custom indicator when provided as function", () => {
      const {getByTestId} = render(
        <Badge
          status="loading"
          indicator={(state: "idle" | "loading" | "error") => (
            <Text testID="indicator">{state}</Text>
          )}
        >
          Badge
        </Badge>,
      );
      expect(getByTestId("indicator").children.join("")).toBe("loading");
    });

    it("shows default loading icon when status is loading and no indicator provided", () => {
      const {getByTestId} = render(<Badge status="loading">Badge</Badge>);
      expect(getByTestId("badge-loading-icon")).toBeTruthy();
    });

    it("shows default error icon when status is error and no indicator provided", () => {
      const {getByTestId} = render(<Badge status="error">Badge</Badge>);
      expect(getByTestId("badge-error-icon")).toBeTruthy();
    });

    it("shows no default icon when status is idle", () => {
      const {queryByTestId} = render(<Badge status="idle">Badge</Badge>);
      expect(queryByTestId("badge-loading-icon")).toBeFalsy();
      expect(queryByTestId("badge-error-icon")).toBeFalsy();
    });
  });

  describe("asChild prop", () => {
    it("clones props to the nearest child when asChild is true", () => {
      const {getByTestId} = render(
        <Badge asChild className="text-red-500">
          <Text testID="child">Badge</Text>
        </Badge>,
      );

      expect(getByTestId("child")).toBeTruthy();
      expect(getByTestId("child").props.className).toContain("text-red-500");
    });
  });
});
