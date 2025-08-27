import React from "react";
import {afterEach, describe, expect, it} from "@jest/globals";
import {cleanup, render} from "@testing-library/react-native";
import {Slider} from "../slider.tsx";

describe("Slider", () => {
  afterEach(cleanup);

  describe("styling", () => {
    it("renders without crashing", () => {
      render(<Slider testID="slider" />);
    });

    it("applies default styling classes", () => {
      const {getByTestId} = render(<Slider testID="slider" />);
      const slider = getByTestId("slider");

      expect(slider).toBeTruthy();
    });

    describe("Size variants", () => {
      it.each([{size: "sm"}, {size: "md"}, {size: "lg"}])(
        "applies $size size variant styling",
        ({size}) => {
          const {getByTestId} = render(
            <Slider testID="slider" size={size as any} />,
          );
          expect(getByTestId("slider")).toBeTruthy();
        },
      );
    });

    describe("Color variants", () => {
      it.each([
        {color: "default"},
        {color: "secondary"},
        {color: "destructive"},
        {color: "warning"},
        {color: "success"},
      ])("applies $color color variant styling", ({color}) => {
        const {getByTestId} = render(
          <Slider testID="slider" color={color as any} />,
        );
        expect(getByTestId("slider")).toBeTruthy();
      });
    });

    describe("Border radius variants", () => {
      it.each([
        {borderRadius: "none"},
        {borderRadius: "sm"},
        {borderRadius: "md"},
        {borderRadius: "lg"},
        {borderRadius: "xl"},
        {borderRadius: "full"},
      ])(
        "applies $borderRadius border radius variant styling",
        ({borderRadius}) => {
          const {getByTestId} = render(
            <Slider testID="slider" borderRadius={borderRadius as any} />,
          );
          expect(getByTestId("slider")).toBeTruthy();
        },
      );
    });

    describe("Orientation variants", () => {
      it.each([{orientation: "horizontal"}, {orientation: "vertical"}])(
        "applies $orientation orientation styling",
        ({orientation}) => {
          const {getByTestId} = render(
            <Slider testID="slider" orientation={orientation as any} />,
          );
          expect(getByTestId("slider")).toBeTruthy();
        },
      );
    });

    it("applies disabled styling", () => {
      const {getByTestId} = render(
        <Slider testID="disabled-slider" disabled />,
      );
      const slider = getByTestId("disabled-slider");

      expect(slider.props.accessibilityState).toMatchObject({disabled: true});
    });

    it("combines multiple styling variants", () => {
      const {getByTestId} = render(
        <Slider
          testID="combined-slider"
          size="lg"
          color="destructive"
          borderRadius="full"
          orientation="vertical"
          disabled
        />,
      );
      const slider = getByTestId("combined-slider");

      expect(slider).toBeTruthy();
      expect(slider.props.accessibilityState).toMatchObject({disabled: true});
    });
  });
});
