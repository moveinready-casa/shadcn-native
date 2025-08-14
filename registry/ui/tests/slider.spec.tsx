import React from "react";
import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import {Slider} from "../slider.tsx";

describe("Slider", () => {
  afterEach(cleanup);

  describe("structure", () => {
    it("renders without crashing", () => {
      render(<Slider testID="slider" />);
    });

    it("sets accessibility role to adjustable", () => {
      const {getByTestId} = render(<Slider testID="slider" />);
      const slider = getByTestId("slider");
      expect(slider.props.accessibilityRole).toBe("adjustable");
    });
  });

  describe("uncontrolled behavior (defaultValue)", () => {
    it("uses defaultValue initially and updates on valueChange", () => {
      const onValueChange = jest.fn();
      const {getByTestId} = render(
        <Slider
          testID="slider"
          defaultValue={[30]}
          onValueChange={onValueChange}
        />,
      );
      const slider = getByTestId("slider");

      expect(slider.props.value).toBe(30);

      fireEvent(slider, "valueChange", 45);
      expect(onValueChange).toHaveBeenCalledWith([45]);
      expect(getByTestId("slider").props.value).toBe(45);
    });

    it("calls onValueCommit on sliding complete with the final value", () => {
      const onValueCommit = jest.fn();
      const {getByTestId} = render(
        <Slider
          testID="slider"
          defaultValue={[10]}
          onValueCommit={onValueCommit}
        />,
      );
      const slider = getByTestId("slider");

      fireEvent(slider, "slidingComplete", 22);
      expect(onValueCommit).toHaveBeenCalledWith([22]);
    });
  });

  describe("controlled behavior (value)", () => {
    it("respects controlled value and does not update without rerender", () => {
      const onValueChange = jest.fn();
      const {getByTestId, rerender} = render(
        <Slider testID="slider" value={[25]} onValueChange={onValueChange} />,
      );
      const slider = getByTestId("slider");
      expect(slider.props.value).toBe(25);

      fireEvent(slider, "valueChange", 40);
      expect(onValueChange).toHaveBeenCalledWith([40]);
      expect(getByTestId("slider").props.value).toBe(25);

      rerender(
        <Slider testID="slider" value={[60]} onValueChange={onValueChange} />,
      );
      expect(getByTestId("slider").props.value).toBe(60);
    });

    it("throws when both value and defaultValue are provided", () => {
      expect(() =>
        render(<Slider value={[10]} defaultValue={[5]} />),
      ).toThrow();
    });
  });

  describe("props", () => {
    it("forwards min, max and step to the underlying component", () => {
      const {getByTestId} = render(
        <Slider testID="slider" min={10} max={90} step={5} />,
      );
      const slider = getByTestId("slider");
      expect(slider.props.minimumValue).toBe(10);
      expect(slider.props.maximumValue).toBe(90);
      expect(slider.props.step).toBe(5);
    });

    it("uses default min=0, max=100, step=1 when not provided", () => {
      const {getByTestId} = render(<Slider testID="slider" />);
      const slider = getByTestId("slider");
      expect(slider.props.minimumValue).toBe(0);
      expect(slider.props.maximumValue).toBe(100);
      expect(slider.props.step).toBe(1);
    });

    it("forwards orientation, dir, name, form, inverted and minStepsBetweenThumbs as props", () => {
      const {getByTestId} = render(
        <Slider
          testID="slider"
          orientation="vertical"
          dir="rtl"
          name="volume"
          form="settings"
          inverted
          minStepsBetweenThumbs={2}
        />,
      );
      const slider = getByTestId("slider");
      expect(slider.props.orientation).toBe("vertical");
      expect(slider.props.dir).toBe("rtl");
      expect(slider.props.name).toBe("volume");
      expect(slider.props.form).toBe("settings");
      expect(slider.props.inverted).toBe(true);
      expect(slider.props.minStepsBetweenThumbs).toBe(2);
    });

    it("applies disabled state and prevents changes", () => {
      const onValueChange = jest.fn();
      const {getByTestId} = render(
        <Slider testID="slider" disabled onValueChange={onValueChange} />,
      );
      const slider = getByTestId("slider");
      expect(slider.props.accessibilityState).toMatchObject({disabled: true});
      expect(slider.props.disabled).toBe(true);
      if (typeof slider.props.className === "string") {
        expect(slider.props.className).toContain("opacity-50");
      }

      fireEvent(slider, "valueChange", 70);
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });
});
