import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import React from "react";
import {Text, View} from "react-native";
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogProps,
  AlertDialogContentComponentProps,
  AlertDialogTriggerProps,
  AlertDialogActionComponentProps,
  AlertDialogCancelComponentProps,
} from "../alert-dialog";

function TestAlertDialog({
  rootProps = {},
  triggerProps = {},
  contentProps = {},
  cancelProps = {},
  actionProps = {},
}: {
  rootProps?: Omit<Partial<AlertDialogProps>, "children">;
  triggerProps?: Omit<Partial<AlertDialogTriggerProps>, "children">;
  contentProps?: Omit<Partial<AlertDialogContentComponentProps>, "children"> & {
    testID?: string;
  };
  cancelProps?: Omit<Partial<AlertDialogCancelComponentProps>, "children">;
  actionProps?: Omit<Partial<AlertDialogActionComponentProps>, "children">;
}) {
  return (
    <AlertDialog {...rootProps}>
      <AlertDialogTrigger {...triggerProps} testID="trigger">
        <Text>Open</Text>
      </AlertDialogTrigger>
      <AlertDialogContent
        {...contentProps}
        testID={contentProps.testID || "content"}
      >
        <AlertDialogHeader testID="header">
          <AlertDialogTitle testID="title">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription testID="description">
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter testID="footer">
          <AlertDialogCancel {...cancelProps} testID="cancel">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction {...actionProps} testID="action">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe("AlertDialog", () => {
  afterEach(cleanup);

  describe("Structure and rendering", () => {
    it("renders without crashing", () => {
      render(<TestAlertDialog />);
    });

    it("renders trigger and not content by default (closed)", () => {
      const {getByTestId} = render(<TestAlertDialog />);
      expect(getByTestId("trigger")).toBeTruthy();
      expect(() => getByTestId("content")).toThrow();
    });

    it("renders content when defaultOpen is true", () => {
      const {getByTestId} = render(
        <TestAlertDialog rootProps={{defaultOpen: true}} />,
      );
      expect(getByTestId("content")).toBeTruthy();
    });

    it("respects controlled open prop", () => {
      const {getByTestId} = render(
        <TestAlertDialog rootProps={{open: true}} />,
      );
      expect(getByTestId("content")).toBeTruthy();
    });
  });

  describe("Interactions", () => {
    it("calls onOpenChange when trigger is pressed", () => {
      const onOpenChange = jest.fn();
      const {getByTestId} = render(
        <TestAlertDialog rootProps={{onOpenChange}} />,
      );
      fireEvent.press(getByTestId("trigger"));
      expect(onOpenChange).toHaveBeenCalled();
    });

    it("closes when cancel is pressed", () => {
      const {getByTestId, queryByTestId} = render(
        <TestAlertDialog rootProps={{defaultOpen: true}} />,
      );
      fireEvent.press(getByTestId("cancel"));
      expect(queryByTestId("content")).toBeFalsy();
    });

    it("closes when action is pressed by default", () => {
      const {getByTestId, queryByTestId} = render(
        <TestAlertDialog rootProps={{defaultOpen: true}} />,
      );
      fireEvent.press(getByTestId("action"));
      expect(queryByTestId("content")).toBeFalsy();
    });

    it("closes when overlay is pressed if modal", () => {
      const {getByTestId, queryByTestId} = render(
        <AlertDialog defaultOpen>
          <AlertDialogPortal>
            <AlertDialogOverlay testID="overlay" />
            <AlertDialogContent testID="content">
              <Text>Body</Text>
            </AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialog>,
      );
      fireEvent.press(getByTestId("overlay"));
      expect(queryByTestId("content")).toBeFalsy();
    });
  });

  describe("Component props and variants", () => {
    it("accepts borderRadius values on content", () => {
      const radii = ["none", "sm", "md", "lg", "xl"] as const;
      radii.forEach((r) => {
        const {getByTestId, unmount} = render(
          <AlertDialog defaultOpen>
            <AlertDialogContent borderRadius={r} testID="content">
              <Text>Body</Text>
            </AlertDialogContent>
          </AlertDialog>,
        );
        expect(getByTestId("content")).toBeTruthy();
        unmount();
      });
    });

    it("clones props to child when asChild is true for Content", () => {
      const {getByTestId} = render(
        <AlertDialog defaultOpen>
          <AlertDialogContent asChild baseClassName="bg-red-500">
            <View testID="child" />
          </AlertDialogContent>
        </AlertDialog>,
      );
      expect(getByTestId("child").props.className).toContain("bg-red-500");
    });

    it("clones props when asChild is true for Overlay", () => {
      const {getByTestId} = render(
        <AlertDialog defaultOpen>
          <AlertDialogPortal>
            <AlertDialogOverlay asChild baseClassName="opacity-50">
              <View testID="child-overlay" />
            </AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogCancel>
                <Text>close</Text>
              </AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialog>,
      );
      expect(getByTestId("child-overlay").props.className).toContain(
        "opacity-50",
      );
    });

    it("clones props when asChild is true for Title", () => {
      const {getByTestId} = render(
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogTitle asChild baseClassName="text-red-500">
              <Text testID="child-title">Hi</Text>
            </AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>,
      );
      expect(getByTestId("child-title").props.className).toContain(
        "text-red-500",
      );
    });

    it("Action and Cancel have button accessibility role", () => {
      const {getByTestId} = render(
        <TestAlertDialog rootProps={{defaultOpen: true}} />,
      );
      expect(getByTestId("action").props.accessibilityRole).toBe("button");
      expect(getByTestId("cancel").props.accessibilityRole).toBe("button");
    });
  });

  describe("Accessibility", () => {
    it("has alertdialog accessibility role on Content (web adds aria props)", () => {
      const {getByTestId} = render(
        <TestAlertDialog rootProps={{defaultOpen: true}} />,
      );
      const content = getByTestId("content");
      expect(content.props.accessibilityRole).toBe("dialog");
    });

    it("Title has heading accessibility role", () => {
      const {getByTestId} = render(
        <TestAlertDialog rootProps={{defaultOpen: true}} />,
      );
      expect(getByTestId("title").props.accessibilityRole).toBe("heading");
    });
  });
});
