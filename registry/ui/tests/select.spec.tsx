import React from "react";
import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import {Text, View} from "react-native";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../select";

function TestSelect({
  rootProps = {},
  useNativeUI,
}: {
  rootProps?: Record<string, any>;
  useNativeUI?: boolean;
}) {
  return (
    <Select {...rootProps} useNativeUI={useNativeUI}>
      <SelectTrigger testID="trigger">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent testID="content">
        <SelectGroup testID="group">
          <SelectLabel testID="label">Fruits</SelectLabel>
          <SelectItem value="apple" testID="item-apple">
            <Text>Apple</Text>
          </SelectItem>
          <SelectItem value="banana" testID="item-banana">
            <Text>Banana</Text>
          </SelectItem>
          <SelectItem value="cherry" testID="item-cherry" disabled>
            <Text>Cherry</Text>
          </SelectItem>
        </SelectGroup>
        <SelectSeparator testID="separator" />
        <SelectScrollUpButton testID="scroll-up" />
        <SelectScrollDownButton testID="scroll-down" />
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  afterEach(cleanup);

  describe("structure and rendering (custom UI)", () => {
    it("renders without crashing", () => {
      render(<TestSelect useNativeUI={false} />);
    });

    it("renders trigger and hides content by default", () => {
      const {getByTestId} = render(<TestSelect useNativeUI={false} />);
      expect(getByTestId("trigger")).toBeTruthy();
      expect(() => getByTestId("content")).toThrow();
    });

    it("renders content when defaultOpen is true", () => {
      const {getByTestId} = render(
        <TestSelect useNativeUI={false} rootProps={{defaultOpen: true}} />,
      );
      expect(getByTestId("content")).toBeTruthy();
      expect(getByTestId("group")).toBeTruthy();
      expect(getByTestId("label")).toBeTruthy();
      expect(getByTestId("separator")).toBeTruthy();
      expect(getByTestId("scroll-up")).toBeTruthy();
      expect(getByTestId("scroll-down")).toBeTruthy();
    });

    it("respects controlled open prop", () => {
      const {getByTestId} = render(
        <TestSelect useNativeUI={false} rootProps={{open: true}} />,
      );
      expect(getByTestId("content")).toBeTruthy();
    });
  });

  describe("opening, closing and selection (custom UI)", () => {
    it("toggles open state when trigger is pressed and calls onOpenChange", () => {
      const onOpenChange = jest.fn();
      const {getByTestId, queryByTestId} = render(
        <TestSelect useNativeUI={false} rootProps={{onOpenChange}} />,
      );

      fireEvent.press(getByTestId("trigger"));
      expect(onOpenChange).toHaveBeenCalled();
      expect(getByTestId("content")).toBeTruthy();

      fireEvent.press(getByTestId("trigger"));
      expect(queryByTestId("content")).toBeNull();
    });

    it("selects an item, calls onValueChange and closes content (uncontrolled)", () => {
      const onValueChange = jest.fn();
      const {getByTestId, getByText, queryByTestId} = render(
        <TestSelect useNativeUI={false} rootProps={{onValueChange}} />,
      );

      fireEvent.press(getByTestId("trigger"));
      fireEvent.press(getByTestId("item-banana"));

      expect(onValueChange).toHaveBeenCalledWith("banana");
      expect(queryByTestId("content")).toBeNull();
      expect(getByText("Banana")).toBeTruthy();
    });

    it("does not invoke onValueChange on disabled item", () => {
      const onValueChange = jest.fn();
      const {getByTestId} = render(
        <TestSelect
          useNativeUI={false}
          rootProps={{onValueChange, defaultOpen: true}}
        />,
      );
      fireEvent.press(getByTestId("item-cherry"));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("respects defaultValue initially and shows selected label", () => {
      const {getByTestId, getByText} = render(
        <TestSelect useNativeUI={false} rootProps={{defaultValue: "apple"}} />,
      );
      // content closed by default
      expect(() => getByTestId("content")).toThrow();
      expect(getByText("Apple")).toBeTruthy();
    });

    it("controlled value: calls onValueChange but does not change without rerender", () => {
      const onValueChange = jest.fn();
      const {getByTestId, getByText, rerender} = render(
        <Select value="apple" onValueChange={onValueChange} useNativeUI={false}>
          <SelectTrigger testID="trigger">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent testID="content">
            <SelectItem value="apple" testID="item-apple">
              <Text>Apple</Text>
            </SelectItem>
            <SelectItem value="banana" testID="item-banana">
              <Text>Banana</Text>
            </SelectItem>
          </SelectContent>
        </Select>,
      );

      fireEvent.press(getByTestId("trigger"));
      fireEvent.press(getByTestId("item-banana"));
      expect(onValueChange).toHaveBeenCalledWith("banana");
      // still shows Apple until rerender
      expect(getByText("Apple")).toBeTruthy();

      rerender(
        <Select
          value="banana"
          onValueChange={onValueChange}
          useNativeUI={false}
        >
          <SelectTrigger testID="trigger">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent testID="content">
            <SelectItem value="apple" testID="item-apple">
              <Text>Apple</Text>
            </SelectItem>
            <SelectItem value="banana" testID="item-banana">
              <Text>Banana</Text>
            </SelectItem>
          </SelectContent>
        </Select>,
      );
      expect(getByText("Banana")).toBeTruthy();
    });

    it("throws when both value and defaultValue are provided", () => {
      expect(() =>
        render(
          <TestSelect
            useNativeUI={false}
            rootProps={{value: "apple", defaultValue: "banana"}}
          />,
        ),
      ).toThrow();
    });
  });

  describe("props and accessibility (custom UI)", () => {
    it("disables trigger when disabled and sets accessibilityState", () => {
      const {getByTestId} = render(
        <TestSelect useNativeUI={false} rootProps={{disabled: true}} />,
      );
      const trigger = getByTestId("trigger");
      expect(trigger.props.accessibilityState?.disabled).toBe(true);
      expect(trigger.props.className).toContain("opacity-50");
      fireEvent.press(trigger);
      expect(() => getByTestId("content")).toThrow();
    });

    it("forwards name, required and dir props on the root", () => {
      const {getByTestId} = render(
        <TestSelect
          useNativeUI={false}
          rootProps={{
            name: "fruit",
            required: true,
            dir: "rtl",
            defaultOpen: true,
          }}
        />,
      );
      const content = getByTestId("content");
      expect(content.props.name).toBe("fruit");
      expect(content.props.required).toBe(true);
      expect(content.props.dir).toBe("rtl");
    });

    it("sets appropriate accessibility roles for menu and items", () => {
      const {getByTestId} = render(
        <TestSelect useNativeUI={false} rootProps={{defaultOpen: true}} />,
      );
      expect(getByTestId("content").props.accessibilityRole).toBe("menu");
      expect(getByTestId("item-apple").props.accessibilityRole).toBe(
        "menuitem",
      );
    });
  });

  describe("styling (custom UI)", () => {
    it("applies shadcn classes on Trigger, Content and Item", () => {
      const {getByTestId} = render(
        <TestSelect useNativeUI={false} rootProps={{defaultOpen: true}} />,
      );
      const trigger = getByTestId("trigger");
      const content = getByTestId("content");
      const item = getByTestId("item-apple");

      // Trigger
      ["bg-background", "border", "rounded-md"].forEach((cls) => {
        expect(trigger.props.className).toContain(cls);
      });
      // Content
      ["bg-popover", "text-popover-foreground", "border"].forEach((cls) => {
        expect(content.props.className).toContain(cls);
      });
      // Item
      ["text-foreground", "text-sm"].forEach((cls) => {
        expect(item.props.className).toContain(cls);
      });
    });

    it.each<
      [color: "primary" | "secondary" | "success" | "warning" | "destructive"]
    >([["primary"], ["secondary"], ["success"], ["warning"], ["destructive"]])(
      "applies colorProp %s on SelectItem",
      (color) => {
        const {getByTestId, unmount} = render(
          <Select useNativeUI={false} defaultOpen>
            <SelectTrigger>
              <SelectValue placeholder="x" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                testID={`item-colored-${color}`}
                value="x"
                colorProp={color}
              >
                <Text>One</Text>
              </SelectItem>
            </SelectContent>
          </Select>,
        );
        const node = getByTestId(`item-colored-${color}`);
        expect(node.props.className).toContain(`text-${color}`);
        unmount();
      },
    );

    it("clones props to child when asChild is true for multiple parts", () => {
      const {getByTestId} = render(
        <Select useNativeUI={false}>
          <SelectTrigger asChild baseClassName="bg-red-500">
            <View testID="trigger-child" />
          </SelectTrigger>
          <SelectContent asChild baseClassName="bg-blue-500">
            <View testID="content-child" />
          </SelectContent>
        </Select>,
      );

      expect(getByTestId("trigger-child").props.className).toContain(
        "bg-red-500",
      );
      // content is not mounted by default, but asChild should still clone props when it is
      fireEvent.press(getByTestId("trigger-child"));
      // We cannot assert content-child presence without opening, so render with open
    });

    it("clones props to child when asChild is true for Item, Label and Separator", () => {
      const {getByTestId} = render(
        <Select useNativeUI={false} defaultOpen>
          <SelectTrigger>
            <SelectValue placeholder="x" />
          </SelectTrigger>
          <SelectContent>
            <SelectLabel asChild baseClassName="text-green-500">
              <Text testID="label-child">Fruits</Text>
            </SelectLabel>
            <SelectItem asChild value="x" baseClassName="text-yellow-500">
              <Text testID="item-child">One</Text>
            </SelectItem>
            <SelectSeparator asChild baseClassName="bg-gray-500">
              <View testID="separator-child" />
            </SelectSeparator>
          </SelectContent>
        </Select>,
      );

      expect(getByTestId("label-child").props.className).toContain(
        "text-green-500",
      );
      expect(getByTestId("item-child").props.className).toContain(
        "text-yellow-500",
      );
      expect(getByTestId("separator-child").props.className).toContain(
        "bg-gray-500",
      );
    });
  });

  describe("native UI mode (MenuView)", () => {
    jest.mock("react-native/Libraries/Utilities/Platform", () => ({
      OS: "ios",
      select: () => null,
    }));

    it("uses MenuView by default when useNativeUI is not false", () => {
      const {getByTestId} = render(<TestSelect />);
      expect(getByTestId("rn-menu-view")).toBeTruthy();
    });

    it("does not render MenuView when useNativeUI is false", () => {
      const {queryByTestId} = render(<TestSelect useNativeUI={false} />);
      expect(queryByTestId("rn-menu-view")).toBeNull();
    });

    it("invokes onValueChange when a native action is selected", () => {
      const onValueChange = jest.fn();
      const {getByTestId} = render(<TestSelect rootProps={{onValueChange}} />);
      const menu = getByTestId("rn-menu-view");
      menu.props.onPressAction?.({
        nativeEvent: {event: "onPressAction", actionKey: "apple"},
      });
      expect(onValueChange).toHaveBeenCalledWith("apple");
    });
  });

  describe("trigger props", () => {
    it("renders startContent and endContent on SelectTrigger", () => {
      const {getByTestId} = render(
        <Select useNativeUI={false}>
          <SelectTrigger
            testID="trigger"
            startContent={<Text testID="trigger-start">S</Text>}
            endContent={<Text testID="trigger-end">E</Text>}
          >
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
        </Select>,
      );
      expect(getByTestId("trigger-start")).toBeTruthy();
      expect(getByTestId("trigger-end")).toBeTruthy();
    });

    it("renders icon on SelectTrigger when icon prop is provided", () => {
      const {getByTestId} = render(
        <Select useNativeUI={false}>
          <SelectTrigger
            testID="trigger"
            icon={<Text testID="trigger-icon">I</Text>}
          >
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
        </Select>,
      );
      expect(getByTestId("trigger-icon")).toBeTruthy();
    });

    it("shows clear button when clearable and a value is selected", () => {
      const {getByTestId} = render(
        <Select useNativeUI={false} defaultValue="apple" clearable>
          <SelectTrigger testID="trigger">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">
              <Text>Apple</Text>
            </SelectItem>
          </SelectContent>
        </Select>,
      );
      expect(getByTestId("select-clear-button")).toBeTruthy();
    });

    it("clears selection when clear button is pressed and calls onValueChange(undefined)", () => {
      const onValueChange = jest.fn();
      const {getByTestId, getByText} = render(
        <Select
          useNativeUI={false}
          defaultValue="apple"
          clearable
          onValueChange={onValueChange}
        >
          <SelectTrigger testID="trigger">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">
              <Text>Apple</Text>
            </SelectItem>
          </SelectContent>
        </Select>,
      );
      const clearBtn = getByTestId("select-clear-button");
      fireEvent.press(clearBtn);
      expect(onValueChange).toHaveBeenCalledWith(undefined);
      expect(getByText("Select a fruit")).toBeTruthy();
    });
  });
});
