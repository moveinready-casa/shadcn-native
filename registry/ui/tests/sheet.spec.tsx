import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import React from "react";
import {Text, View} from "react-native";
import {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetProps,
  SheetContentComponentProps,
  SheetTriggerProps,
  SheetCloseComponentProps,
} from "../sheet";

function TestSheet({
  rootProps = {},
  triggerProps = {},
  contentProps = {},
  closeProps = {},
}: {
  rootProps?: Omit<Partial<SheetProps>, "children">;
  triggerProps?: Omit<Partial<SheetTriggerProps>, "children">;
  contentProps?: Omit<Partial<SheetContentComponentProps>, "children">;
  closeProps?: Omit<Partial<SheetCloseComponentProps>, "children">;
}) {
  return (
    <Sheet {...rootProps}>
      <SheetTrigger {...triggerProps} testID="trigger">
        <Text>Open sheet</Text>
      </SheetTrigger>
      <SheetContent {...contentProps} testID="content">
        <Text testID="sheet-body">Sheet body</Text>
        <SheetClose {...closeProps} testID="close">
          <Text>Close</Text>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}

describe("Sheet", () => {
  afterEach(cleanup);

  describe("Structure and rendering", () => {
    it("renders without crashing", () => {
      render(<TestSheet />);
    });

    it("renders trigger and content components", () => {
      const {getByTestId} = render(<TestSheet />);
      expect(getByTestId("trigger")).toBeTruthy();
      // Content is not rendered by default when sheet is closed
      expect(() => getByTestId("content")).toThrow();
    });

    it("renders content when sheet is open by default", () => {
      const {getByTestId} = render(
        <TestSheet rootProps={{defaultOpen: true}} />,
      );
      expect(getByTestId("content")).toBeTruthy();
    });
  });

  describe("Component props", () => {
    it("respects the controlled open prop", () => {
      const {getByTestId} = render(<TestSheet rootProps={{open: true}} />);
      expect(getByTestId("content")).toBeTruthy();
    });

    it("calls onOpenChange when trigger is pressed", () => {
      const onOpenChange = jest.fn();
      const {getByTestId} = render(<TestSheet rootProps={{onOpenChange}} />);
      fireEvent.press(getByTestId("trigger"));
      expect(onOpenChange).toHaveBeenCalled();
    });

    it("accepts side values: top, bottom, left, right", () => {
      const sides = ["top", "bottom", "left", "right"] as const;
      sides.forEach((side) => {
        const {getByTestId, unmount} = render(
          <Sheet defaultOpen>
            <SheetContent side={side} testID="content">
              <Text>Body</Text>
            </SheetContent>
          </Sheet>,
        );
        expect(getByTestId("content")).toBeTruthy();
        unmount();
      });
    });

    it("clones props to the child when asChild is true", () => {
      const {getByTestId} = render(
        <Sheet defaultOpen>
          <SheetContent asChild baseClassName="bg-red-500">
            <View testID="child" />
          </SheetContent>
        </Sheet>,
      );

      expect(getByTestId("child").props.className).toContain("bg-red-500");
    });

    it("accepts modal prop on SheetContent", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent modal={false}>
            <Text>Content</Text>
          </SheetContent>
        </Sheet>,
      );
    });

    it("accepts forceMount prop on SheetContent", () => {
      const {getByTestId} = render(
        <Sheet defaultOpen>
          <SheetContent testID="content" forceMount>
            <Text>Body</Text>
          </SheetContent>
        </Sheet>,
      );
      expect(getByTestId("content")).toBeTruthy();
    });

    it("attaches advanced event handlers to SheetContent", () => {
      const onOpenAutoFocus = jest.fn();
      const onCloseAutoFocus = jest.fn();
      const onEscapeKeyDown = jest.fn();
      const onPointerDownOutside = jest.fn();
      const onInteractOutside = jest.fn();

      const {getByTestId} = render(
        <Sheet defaultOpen>
          <SheetContent
            testID="content"
            onOpenAutoFocus={onOpenAutoFocus}
            onCloseAutoFocus={onCloseAutoFocus}
            onEscapeKeyDown={onEscapeKeyDown}
            onPointerDownOutside={onPointerDownOutside}
            onInteractOutside={onInteractOutside}
          >
            <Text>Body</Text>
          </SheetContent>
        </Sheet>,
      );

      const content = getByTestId("content");
      expect(content.props.onOpenAutoFocus).toBe(onOpenAutoFocus);
      expect(content.props.onCloseAutoFocus).toBe(onCloseAutoFocus);
      expect(content.props.onEscapeKeyDown).toBe(onEscapeKeyDown);
      expect(content.props.onPointerDownOutside).toBe(onPointerDownOutside);
      expect(content.props.onInteractOutside).toBe(onInteractOutside);
    });
  });

  describe("Sub-components", () => {
    it("renders Overlay, Header, Footer, Title, and Description when open", () => {
      const {getByTestId} = render(
        <Sheet defaultOpen>
          <SheetPortal>
            <SheetOverlay testID="overlay" />
            <SheetContent testID="content">
              <SheetHeader testID="header">
                <SheetTitle testID="title">Sheet title</SheetTitle>
                <SheetDescription testID="description">
                  Sheet description
                </SheetDescription>
              </SheetHeader>
              <SheetFooter testID="footer">
                <SheetClose testID="closeBtn">
                  <Text>Close</Text>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </SheetPortal>
        </Sheet>,
      );

      expect(getByTestId("overlay")).toBeTruthy();
      expect(getByTestId("content")).toBeTruthy();
      expect(getByTestId("header")).toBeTruthy();
      expect(getByTestId("footer")).toBeTruthy();
      expect(getByTestId("title")).toBeTruthy();
      expect(getByTestId("description")).toBeTruthy();
    });

    it("has heading accessibility role for SheetTitle", () => {
      const {getByTestId} = render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle testID="title">Sheet title</SheetTitle>
          </SheetContent>
        </Sheet>,
      );

      const title = getByTestId("title");
      expect(title.props.accessibilityRole).toBe("heading");
    });

    it("clones props when asChild is true for SheetTitle", () => {
      const {getByTestId} = render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle asChild baseClassName="text-red-500">
              <Text testID="child-title">Hi</Text>
            </SheetTitle>
          </SheetContent>
        </Sheet>,
      );

      expect(getByTestId("child-title").props.className).toContain(
        "text-red-500",
      );
    });

    it("clones props when asChild is true for SheetContent", () => {
      const {getByTestId} = render(
        <Sheet defaultOpen>
          <SheetContent asChild baseClassName="bg-blue-500">
            <View testID="child-content" />
          </SheetContent>
        </Sheet>,
      );

      expect(getByTestId("child-content").props.className).toContain(
        "bg-blue-500",
      );
    });

    it("clones props when asChild is true for SheetOverlay", () => {
      const {getByTestId} = render(
        <Sheet defaultOpen>
          <SheetPortal>
            <SheetOverlay asChild baseClassName="opacity-50">
              <View testID="child-overlay" />
            </SheetOverlay>
            <SheetContent>
              <SheetClose testID="closeBtn">
                <Text>close</Text>
              </SheetClose>
            </SheetContent>
          </SheetPortal>
        </Sheet>,
      );

      expect(getByTestId("child-overlay").props.className).toContain(
        "opacity-50",
      );
    });
  });
});
