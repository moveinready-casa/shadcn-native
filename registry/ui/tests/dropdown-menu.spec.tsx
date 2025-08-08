import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import React from "react";
import {Text, View} from "react-native";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuArrow,
} from "../dropdown-menu";

function TestDropdown({
  rootProps = {},
  triggerText = "Open",
  itemProps = {},
}: {
  rootProps?: Record<string, any>;
  triggerText?: string;
  itemProps?: Record<string, any>;
}) {
  return (
    <DropdownMenu {...rootProps}>
      <DropdownMenuTrigger testID="trigger">
        <Text>{triggerText}</Text>
      </DropdownMenuTrigger>
      <DropdownMenuContent testID="content">
        <DropdownMenuLabel testID="label">Actions</DropdownMenuLabel>
        <DropdownMenuGroup testID="group">
          <DropdownMenuItem testID="item" {...itemProps}>
            <Text>Item 1</Text>
          </DropdownMenuItem>
          <DropdownMenuItem testID="disabled-item" disabled>
            <Text>Disabled</Text>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator testID="separator" />
        <DropdownMenuCheckboxItem testID="checkbox">
          <Text>Checked item</Text>
        </DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup testID="radiogroup">
          <DropdownMenuRadioItem testID="radio-pedro" value="pedro">
            <Text>Pedro</Text>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem testID="radio-colm" value="colm">
            <Text>Colm</Text>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger testID="sub-trigger">
            <Text>More</Text>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent testID="sub-content">
            <DropdownMenuItem testID="sub-item">
              <Text>Sub item</Text>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuArrow testID="arrow" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  afterEach(cleanup);

  describe("Structure and rendering", () => {
    it("renders without crashing", () => {
      render(<TestDropdown />);
    });

    it("renders trigger and hides content by default", () => {
      const {getByTestId} = render(<TestDropdown />);
      expect(getByTestId("trigger")).toBeTruthy();
      expect(() => getByTestId("content")).toThrow();
    });

    it("renders content when defaultOpen is true", () => {
      const {getByTestId} = render(
        <TestDropdown rootProps={{defaultOpen: true}} />,
      );
      expect(getByTestId("content")).toBeTruthy();
    });

    it("respects controlled open prop", () => {
      const {getByTestId} = render(<TestDropdown rootProps={{open: true}} />);
      expect(getByTestId("content")).toBeTruthy();
    });
  });

  describe("Opening and closing", () => {
    it("toggles open state when trigger is pressed and calls onOpenChange", () => {
      const onOpenChange = jest.fn();
      const {getByTestId, queryByTestId} = render(
        <TestDropdown rootProps={{onOpenChange}} />,
      );

      fireEvent.press(getByTestId("trigger"));
      expect(onOpenChange).toHaveBeenCalled();
      expect(getByTestId("content")).toBeTruthy();

      // Close again
      fireEvent.press(getByTestId("trigger"));
      expect(queryByTestId("content")).toBeNull();
    });

    it("closes when selecting a regular item by default and calls onSelect", () => {
      const onSelect = jest.fn();
      const {getByTestId, queryByTestId} = render(
        <TestDropdown rootProps={{defaultOpen: true}} itemProps={{onSelect}} />,
      );
      fireEvent.press(getByTestId("item"));
      expect(onSelect).toHaveBeenCalled();
      expect(queryByTestId("content")).toBeNull();
    });

    it("does not invoke onSelect on disabled item", () => {
      const onSelect = jest.fn();
      const {getByTestId} = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>
            <Text>Open</Text>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled onSelect={onSelect} testID="disabled">
              <Text>Disabled</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      fireEvent.press(getByTestId("disabled"));
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe("Submenu", () => {
    it("opens sub content when sub trigger is pressed", () => {
      const {getByTestId} = render(
        <TestDropdown rootProps={{defaultOpen: true}} />,
      );
      fireEvent.press(getByTestId("sub-trigger"));
      expect(getByTestId("sub-content")).toBeTruthy();
    });
  });

  describe("Checkbox item", () => {
    it("toggles checked state in uncontrolled mode and calls onCheckedChange", () => {
      const onCheckedChange = jest.fn();
      const {getByTestId} = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>
            <Text>Open</Text>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              testID="checkbox"
              onCheckedChange={onCheckedChange}
            >
              <Text>Checked item</Text>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      fireEvent.press(getByTestId("checkbox"));
      expect(onCheckedChange).toHaveBeenCalled();
    });

    it("respects controlled checked prop", () => {
      const {getByTestId} = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>
            <Text>Open</Text>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem testID="checkbox" checked>
              <Text>Checked item</Text>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(getByTestId("checkbox")).toBeTruthy();
    });
  });

  describe("Radio group", () => {
    it("changes value in uncontrolled mode and calls onValueChange", () => {
      const onValueChange = jest.fn();
      const {getByTestId} = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>
            <Text>Open</Text>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              testID="radiogroup"
              onValueChange={onValueChange}
            >
              <DropdownMenuRadioItem testID="radio-a" value="a">
                <Text>A</Text>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem testID="radio-b" value="b">
                <Text>B</Text>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      fireEvent.press(getByTestId("radio-b"));
      expect(onValueChange).toHaveBeenCalledWith("b");
    });

    it("respects controlled value prop", () => {
      const {getByTestId} = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>
            <Text>Open</Text>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup testID="radiogroup" value="colm">
              <DropdownMenuRadioItem testID="radio-pedro" value="pedro">
                <Text>Pedro</Text>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem testID="radio-colm" value="colm">
                <Text>Colm</Text>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(getByTestId("radio-colm")).toBeTruthy();
    });
  });

  describe("Portal and Arrow", () => {
    it("renders content in portal and shows arrow when open", () => {
      const {getByTestId} = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>
            <Text>Open</Text>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent testID="content">
              <DropdownMenuArrow testID="arrow" />
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>,
      );

      expect(getByTestId("content")).toBeTruthy();
      expect(getByTestId("arrow")).toBeTruthy();
    });
  });

  describe("asChild and styling", () => {
    it("clones props to child when asChild is true for Trigger", () => {
      const {getByTestId} = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild baseClassName="bg-red-500">
            <View testID="trigger-child" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Text>Item</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(getByTestId("trigger-child").props.className).toContain(
        "bg-red-500",
      );
    });

    it("clones props to child when asChild is true for Content", () => {
      const {getByTestId} = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>
            <Text>Open</Text>
          </DropdownMenuTrigger>
          <DropdownMenuContent asChild baseClassName="bg-blue-500">
            <View testID="content-child" />
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(getByTestId("content-child").props.className).toContain(
        "bg-blue-500",
      );
    });

    it("clones props to child when asChild is true for Item", () => {
      const {getByTestId} = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>
            <Text>Open</Text>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild baseClassName="text-green-500">
              <Text testID="item-child">Item</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(getByTestId("item-child").props.className).toContain(
        "text-green-500",
      );
    });
  });

  describe("Accessibility roles", () => {
    it("sets appropriate accessibility roles for menu and items", () => {
      const {getByTestId} = render(
        <TestDropdown rootProps={{defaultOpen: true}} />,
      );
      expect(getByTestId("content").props.accessibilityRole).toBe("menu");
      expect(getByTestId("item").props.accessibilityRole).toBe("menuitem");
      expect(getByTestId("checkbox").props.accessibilityRole).toBe("checkbox");
      expect(getByTestId("radiogroup").props.accessibilityRole).toBe(
        "radiogroup",
      );
      expect(getByTestId("radio-pedro").props.accessibilityRole).toBe("radio");
      expect(getByTestId("separator").props.accessibilityRole).toBe(
        "separator",
      );
    });
  });

  describe("Styling and state variants", () => {
    it("accepts color variants on DropdownMenuItem", () => {
      const colorVariants = [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ] as const;

      colorVariants.forEach((color) => {
        const {getByTestId, unmount} = render(
          <DropdownMenu defaultOpen>
            <DropdownMenuTrigger>
              <Text>Open</Text>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem testID={`item-${color}`} color={color}>
                <Text>Item</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>,
        );

        expect(getByTestId(`item-${color}`)).toBeTruthy();
        unmount();
      });
    });

    it("applies opacity style when disabled", () => {
      const {getByTestId} = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>
            <Text>Open</Text>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled testID="disabled-item-state">
              <Text>Disabled</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      const node = getByTestId("disabled-item-state");
      expect(node.props.className).toContain("opacity-50");
    });

    it("applies animate-pulse style when loading", () => {
      const {getByTestId} = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>
            <Text>Open</Text>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem loading testID="loading-item">
              <Text>Loading</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(getByTestId("loading-item").props.className).toContain(
        "animate-pulse",
      );
    });
  });
});
