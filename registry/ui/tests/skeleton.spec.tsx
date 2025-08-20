import React from "react";
import {afterEach, describe, expect, it} from "@jest/globals";
import {cleanup, render} from "@testing-library/react-native";
import {Skeleton} from "../skeleton";

describe("Skeleton", () => {
  afterEach(cleanup);

  describe("Structure and rendering", () => {
    it("renders without crashing", () => {
      render(<Skeleton />);
    });

    it("forwards testID and other props", () => {
      const {getByTestId} = render(
        <Skeleton testID="skeleton" accessibilityLabel="loading" />,
      );
      const skel = getByTestId("skeleton");
      expect(skel).toBeTruthy();
      expect(skel.props.accessibilityLabel).toBe("loading");
    });
  });

  describe("Base styling", () => {
    it("applies default md border radius", () => {
      const {getByTestId} = render(<Skeleton testID="skeleton" />);
      expect(getByTestId("skeleton").props.className).toContain("rounded-md");
    });
  });

  describe("Border radius variants", () => {
    const cases = [
      ["none", "rounded-none"],
      ["sm", "rounded-sm"],
      ["md", "rounded-md"],
      ["lg", "rounded-lg"],
      ["xl", "rounded-xl"],
      ["full", "rounded-full"],
    ] as const;

    it.each(cases)("applies %s radius correctly", (radius, expectedClass) => {
      const {getByTestId} = render(
        <Skeleton testID="skeleton" borderRadius={radius} />,
      );
      expect(getByTestId("skeleton").props.className).toContain(expectedClass);
    });
  });
});
