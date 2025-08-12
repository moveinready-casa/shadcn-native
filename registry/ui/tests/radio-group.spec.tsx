import React from "react";
import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import {Text, View} from "react-native";
import {
  RadioGroup,
  RadioGroupItem,
} from "../radio-group.tsx";

function TestRadioGroup({
  rootProps = {},
  defaultValue,
  value,
  onValueChange,
}: {
  rootProps?: Record<string, unknown>;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <RadioGroup
      testID="group"
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      {...rootProps}
    >
      <RadioGroupItem testID="radio-apple" value="apple">
        <Text>Apple</Text>
      </RadioGroupItem>
      <RadioGroupItem testID="radio-banana" value="banana">
        <Text>Banana</Text>
      </RadioGroupItem>
      <RadioGroupItem testID="radio-cherry" value="cherry">
        <Text>Cherry</Text>
      </RadioGroupItem>
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  afterEach(cleanup);

  describe("structure", () => {
    it("renders without crashing", () => {
      render(<TestRadioGroup />);
    });

    it("sets accessibility roles for group and items", () => {
      const {getByTestId} = render(<TestRadioGroup />);
      expect(getByTestId("group").props.accessibilityRole).toBe("radiogroup");
      expect(getByTestId("radio-apple").props.accessibilityRole).toBe("radio");
    });
  });

  describe("uncontrolled behavior", () => {
    it("selects the defaultValue initially", () => {
      const {getByTestId} = render(<TestRadioGroup defaultValue="banana" />);
      expect(
        getByTestId("radio-banana").props.accessibilityState?.selected,
      ).toBe(true);
      expect(
        getByTestId("radio-apple").props.accessibilityState?.selected,
      ).not.toBe(true);
    });

    it("changes selection on item press and calls onValueChange", () => {
      const onValueChange = jest.fn();
      const {getByTestId} = render(
        <TestRadioGroup defaultValue="apple" onValueChange={onValueChange} />,
      );

      fireEvent.press(getByTestId("radio-banana"));
      expect(onValueChange).toHaveBeenCalledWith("banana");
      expect(
        getByTestId("radio-banana").props.accessibilityState?.selected,
      ).toBe(true);
      expect(
        getByTestId("radio-apple").props.accessibilityState?.selected,
      ).not.toBe(true);
    });

    it("ignores presses on the already selected item", () => {
      const onValueChange = jest.fn();
      const {getByTestId} = render(
        <TestRadioGroup defaultValue="banana" onValueChange={onValueChange} />,
      );
      fireEvent.press(getByTestId("radio-banana"));
      expect(onValueChange).not.toHaveBeenCalled();
      expect(
        getByTestId("radio-banana").props.accessibilityState?.selected,
      ).toBe(true);
    });
  });

  describe("controlled behavior", () => {
    it("respects the controlled value prop and does not change without rerender", () => {
      const onValueChange = jest.fn();
      const {getByTestId, rerender} = render(
        <TestRadioGroup value="cherry" onValueChange={onValueChange} />,
      );

      expect(
        getByTestId("radio-cherry").props.accessibilityState?.selected,
      ).toBe(true);

      fireEvent.press(getByTestId("radio-apple"));
      expect(onValueChange).toHaveBeenCalledWith("apple");
      expect(
        getByTestId("radio-cherry").props.accessibilityState?.selected,
      ).toBe(true);

      rerender(<TestRadioGroup value="apple" onValueChange={onValueChange} />);
      expect(
        getByTestId("radio-apple").props.accessibilityState?.selected,
      ).toBe(true);
    });
  });

  describe("props", () => {
    it("disables all items when group is disabled", () => {
      const onValueChange = jest.fn();
      const {getByTestId} = render(
        <TestRadioGroup
          rootProps={{disabled: true}}
          onValueChange={onValueChange}
        />,
      );
      const apple = getByTestId("radio-apple");
      expect(apple.props.accessibilityState?.disabled).toBe(true);
      fireEvent.press(apple);
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("disables a single item when item is disabled", () => {
      const onValueChange = jest.fn();
      const {getByTestId} = render(
        <RadioGroup testID="group" onValueChange={onValueChange}>
          <RadioGroupItem testID="radio-a" value="a">
            <Text>A</Text>
          </RadioGroupItem>
          <RadioGroupItem testID="radio-b" value="b" disabled>
            <Text>B</Text>
          </RadioGroupItem>
        </RadioGroup>,
      );

      fireEvent.press(getByTestId("radio-b"));
      expect(onValueChange).not.toHaveBeenCalled();
      expect(getByTestId("radio-b").props.accessibilityState?.disabled).toBe(
        true,
      );
    });

    it("accepts and forwards name, required, dir and loop props on the root", () => {
      const {getByTestId} = render(
        <TestRadioGroup
          rootProps={{name: "fruit", required: true, dir: "rtl", loop: true}}
        />,
      );
      const group = getByTestId("group");
      expect(group.props.name).toBe("fruit");
      expect(group.props.required).toBe(true);
      expect(group.props.dir).toBe("rtl");
      expect(group.props.loop).toBe(true);
    });

    it("throws when both value and defaultValue are provided", () => {
      expect(() =>
        render(<TestRadioGroup value="apple" defaultValue="banana" />),
      ).toThrow();
    });
  });

  describe("orientation and styling", () => {
    it("uses vertical orientation by default (flex-col)", () => {
      const {getByTestId} = render(<TestRadioGroup />);
      const group = getByTestId("group");
      expect(group.props.className).toContain("flex-col");
    });

    it("uses horizontal orientation when specified (flex-row)", () => {
      const {getByTestId} = render(
        <TestRadioGroup rootProps={{orientation: "horizontal"}} />,
      );
      const group = getByTestId("group");
      expect(group.props.className).toContain("flex-row");
    });
  });

  describe("asChild support", () => {
    it("clones props to nearest child when asChild is true on group", () => {
      const {getByTestId} = render(
        <RadioGroup asChild orientation="horizontal">
          <View testID="group-child" />
        </RadioGroup>,
      );
      expect(getByTestId("group-child").props.className).toContain("flex-row");
      expect(getByTestId("group-child").props.accessibilityRole).toBe(
        "radiogroup",
      );
    });

    it("clones props to nearest child when asChild is true on item", () => {
      const {getByTestId} = render(
        <RadioGroup>
          <RadioGroupItem asChild value="x">
            <Text testID="item-child">Label</Text>
          </RadioGroupItem>
        </RadioGroup>,
      );
      expect(getByTestId("item-child").props.accessibilityRole).toBe("radio");
    });
  });
});
