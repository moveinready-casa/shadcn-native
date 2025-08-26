import React from "react";
import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, render} from "@testing-library/react-native";
import {Progress} from "../progress.tsx";

describe("Progress", () => {
  afterEach(cleanup);

  describe("structure", () => {
    it("renders without crashing", () => {
      render(<Progress testID="progress" />);
    });

    it("sets accessibility role to progressbar", () => {
      const {getByTestId} = render(<Progress testID="progress" />);
      const progress = getByTestId("progress");
      expect(progress.props.accessibilityRole).toBe("progressbar");
    });
  });

  describe("accessibility", () => {
    it("maps value to accessibilityValue.now and defaults min=0 when max is not provided", () => {
      const {getByTestId} = render(<Progress testID="progress" value={50} />);
      const progress = getByTestId("progress");

      expect(progress.props.accessibilityValue).toMatchObject({
        min: 0,
        now: 50,
      });
    });

    it("sets accessibilityValue.max when provided and preserves now", () => {
      const {getByTestId} = render(
        <Progress testID="progress" value={50} max={200} />,
      );
      const progress = getByTestId("progress");

      expect(progress.props.accessibilityValue).toMatchObject({
        min: 0,
        max: 200,
        now: 50,
      });
    });

    it("uses getValueLabel when provided for accessibilityValue.text", () => {
      const getValueLabel = jest.fn((v: number | null, m?: number) =>
        v === null || m === undefined ? "Loading" : `${v} of ${m} tickets`,
      );
      const {getByTestId} = render(
        <Progress
          testID="progress"
          value={33}
          max={99}
          getValueLabel={getValueLabel}
        />,
      );
      const progress = getByTestId("progress");

      expect(getValueLabel).toHaveBeenCalledWith(33, 99);
      expect(progress.props.accessibilityValue.text).toBe("33 of 99 tickets");
    });

    it("represents indeterminate when value is null", () => {
      const {getByTestId} = render(<Progress testID="progress" value={null} />);
      const progress = getByTestId("progress");

      expect(progress.props.accessibilityState?.busy).toBe(true);
      expect(progress.props.accessibilityValue?.now).toBeUndefined();
    });

    it("updates accessibilityValue.now on rerender when value changes", () => {
      const {getByTestId, rerender} = render(
        <Progress testID="progress" value={10} />,
      );
      const progress = getByTestId("progress");
      expect(progress.props.accessibilityValue).toMatchObject({now: 10});

      rerender(<Progress testID="progress" value={75} />);
      expect(progress.props.accessibilityValue).toMatchObject({now: 75});
    });
  });

  describe("style", () => {
    it("accepts baseClassName override for track", () => {
      const {getByTestId} = render(
        <Progress testID="progress" baseClassName="custom-track" />,
      );
      const root = getByTestId("progress");

      expect(root.props.className).toContain("custom-track");
    });

    it("applies animated style to the fill for value-based animation", () => {
      const {getByTestId} = render(<Progress testID="progress" value={40} />);
      const root = getByTestId("progress");
      const fill = root.children?.[0];

      expect(fill.props.style).toBeDefined();
    });

    const sizes = [
      ["sm", "h-1.5"],
      ["md", "h-2"],
      ["lg", "h-3"],
      ["xl", "h-4"],
    ] as const;

    it.each(sizes)(
      "applies size=%s height on track",
      (size: "sm" | "md" | "lg" | "xl", expectedClass: string) => {
        const {getByTestId} = render(
          <Progress testID="progress" size={size} />,
        );
        const root = getByTestId("progress");
        expect(root.props.className).toContain(expectedClass);
      },
    );

    const supportedColors = [
      "primary",
      "success",
      "warning",
      "destructive",
    ] as const;

    const expectedLightHex: Record<(typeof supportedColors)[number], string> = {
      primary: "#343434",
      success: "#22c55e",
      warning: "#eab308",
      destructive: "#ef4444",
    };

    it.each(supportedColors)(
      "applies color=%s on fill (light theme)",
      (color) => {
        const {getByTestId} = render(
          <Progress testID="progress" color={color} />,
        );
        const root = getByTestId("progress");
        const fill = root.children?.[0];
        const styleArray = Array.isArray(fill.props.style)
          ? fill.props.style
          : [fill.props.style];
        const merged = Object.assign({}, ...styleArray);
        expect(merged.backgroundColor).toBe(expectedLightHex[color]);
      },
    );
  });

  describe("props passthrough", () => {
    it("passes through underlying view props (e.g. accessibilityLabel)", () => {
      const {getByTestId} = render(
        <Progress testID="progress" accessibilityLabel="Upload progress" />,
      );
      const root = getByTestId("progress");
      expect(root.props.accessibilityLabel).toBe("Upload progress");
    });
  });
});
