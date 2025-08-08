import {describe, expect, it, jest} from "@jest/globals";
import {fireEvent, render, screen} from "@testing-library/react-native";
import React from "react";
import {Text, Pressable} from "react-native";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "../drawer";

describe("Drawer", () => {
  it("renders the trigger", () => {
    render(
      <Drawer>
        <DrawerTrigger>
          <Text>Open Drawer</Text>
        </DrawerTrigger>
      </Drawer>,
    );
    expect(screen.getByText("Open Drawer")).toBeTruthy();
  });

  it("renders the content", () => {
    render(
      <Drawer>
        <DrawerContent>
          <Text>Drawer Content</Text>
        </DrawerContent>
      </Drawer>,
    );
    expect(screen.getByText("Drawer Content")).toBeTruthy();
  });

  it("disables the trigger", () => {
    const {getByTestId} = render(
      <Drawer>
        <DrawerTrigger testID="open-drawer" disabled>
          <Text>Open</Text>
        </DrawerTrigger>
      </Drawer>,
    );

    expect(getByTestId("open-drawer").props.accessibilityState?.disabled).toBe(
      true,
    );
  });

  it("renders header, title, and description", () => {
    render(
      <Drawer>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              <Text>Drawer Title</Text>
            </DrawerTitle>
            <DrawerDescription>
              <Text>Drawer Description</Text>
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    );

    expect(screen.getByText("Drawer Title")).toBeTruthy();
    expect(screen.getByText("Drawer Description")).toBeTruthy();
  });

  it("renders footer", () => {
    render(
      <Drawer>
        <DrawerContent>
          <DrawerFooter>
            <Text>Drawer Footer</Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );

    expect(screen.getByText("Drawer Footer")).toBeTruthy();
  });

  it("clones props when asChild is true for DrawerClose", () => {
    const {getByTestId} = render(
      <Drawer>
        <DrawerContent>
          <DrawerClose asChild>
            <Pressable testID="child-close">
              <Text>Close</Text>
            </Pressable>
          </DrawerClose>
        </DrawerContent>
      </Drawer>,
    );

    const closeButton = getByTestId("child-close");
    expect(closeButton.props.accessibilityRole).toBe("button");
  });

  it("clones props when asChild is true for DrawerTrigger", () => {
    const {getByTestId} = render(
      <Drawer>
        <DrawerTrigger asChild>
          <Pressable testID="child-open">
            <Text>Open</Text>
          </Pressable>
        </DrawerTrigger>
      </Drawer>,
    );

    const openButton = getByTestId("child-open");
    expect(openButton.props.accessibilityRole).toBe("button");
  });

  it("calls onClose when DrawerClose is pressed", () => {
    const onClose = jest.fn();
    const {getByText} = render(
      <Drawer>
        <DrawerContent onClose={onClose}>
          <DrawerClose>
            <Text>Close</Text>
          </DrawerClose>
        </DrawerContent>
      </Drawer>,
    );

    fireEvent.press(getByText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when DrawerClose is disabled", () => {
    const onClose = jest.fn();
    const {getByText} = render(
      <Drawer>
        <DrawerContent onClose={onClose}>
          <DrawerClose disabled>
            <Text>Close</Text>
          </DrawerClose>
        </DrawerContent>
      </Drawer>,
    );

    fireEvent.press(getByText("Close"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
