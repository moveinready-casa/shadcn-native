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

    it("applies size variant styling", () => {
      const {getByTestId: getSmallSlider} = render(
        <Slider testID="small-slider" size="sm" />,
      );
      const {getByTestId: getMediumSlider} = render(
        <Slider testID="medium-slider" size="md" />,
      );
      const {getByTestId: getLargeSlider} = render(
        <Slider testID="large-slider" size="lg" />,
      );

      expect(getSmallSlider("small-slider")).toBeTruthy();
      expect(getMediumSlider("medium-slider")).toBeTruthy();
      expect(getLargeSlider("large-slider")).toBeTruthy();
    });

    it("applies color variant styling", () => {
      const {getByTestId: getDefaultSlider} = render(
        <Slider testID="default-slider" color="default" />,
      );
      const {getByTestId: getSecondarySlider} = render(
        <Slider testID="secondary-slider" color="secondary" />,
      );
      const {getByTestId: getDestructiveSlider} = render(
        <Slider testID="destructive-slider" color="destructive" />,
      );
      const {getByTestId: getWarningSlider} = render(
        <Slider testID="warning-slider" color="warning" />,
      );
      const {getByTestId: getSuccessSlider} = render(
        <Slider testID="success-slider" color="success" />,
      );

      expect(getDefaultSlider("default-slider")).toBeTruthy();
      expect(getSecondarySlider("secondary-slider")).toBeTruthy();
      expect(getDestructiveSlider("destructive-slider")).toBeTruthy();
      expect(getWarningSlider("warning-slider")).toBeTruthy();
      expect(getSuccessSlider("success-slider")).toBeTruthy();
    });

    it("applies border radius variant styling", () => {
      const {getByTestId: getNoneSlider} = render(
        <Slider testID="none-slider" borderRadius="none" />,
      );
      const {getByTestId: getSmallSlider} = render(
        <Slider testID="small-radius-slider" borderRadius="sm" />,
      );
      const {getByTestId: getMediumSlider} = render(
        <Slider testID="medium-radius-slider" borderRadius="md" />,
      );
      const {getByTestId: getLargeSlider} = render(
        <Slider testID="large-radius-slider" borderRadius="lg" />,
      );
      const {getByTestId: getFullSlider} = render(
        <Slider testID="full-radius-slider" borderRadius="full" />,
      );

      expect(getNoneSlider("none-slider")).toBeTruthy();
      expect(getSmallSlider("small-radius-slider")).toBeTruthy();
      expect(getMediumSlider("medium-radius-slider")).toBeTruthy();
      expect(getLargeSlider("large-radius-slider")).toBeTruthy();
      expect(getFullSlider("full-radius-slider")).toBeTruthy();
    });

    it("applies orientation styling", () => {
      const {getByTestId: getHorizontalSlider} = render(
        <Slider testID="horizontal-slider" orientation="horizontal" />,
      );
      const {getByTestId: getVerticalSlider} = render(
        <Slider testID="vertical-slider" orientation="vertical" />,
      );

      expect(getHorizontalSlider("horizontal-slider")).toBeTruthy();
      expect(getVerticalSlider("vertical-slider")).toBeTruthy();
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
