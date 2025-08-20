import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogProps,
  DialogContentComponentProps,
  DialogTriggerProps,
  DialogCloseComponentProps,
} from "../dialog";
import {Text, View} from "react-native";

function TestDialog({
  rootProps = {},
  triggerProps = {},
  contentProps = {},
  closeProps = {},
}: {
  rootProps?: Omit<Partial<DialogProps>, "children">;
  triggerProps?: Omit<Partial<DialogTriggerProps>, "children">;
  contentProps?: Omit<Partial<DialogContentComponentProps>, "children">;
  closeProps?: Omit<Partial<DialogCloseComponentProps>, "children">;
}) {
  return (
    <Dialog {...rootProps}>
      <DialogTrigger {...triggerProps} testID="trigger">
        <Text>Open dialog</Text>
      </DialogTrigger>
      <DialogContent {...contentProps} testID="content">
        <Text testID="dialog-body">Dialog body</Text>
        <DialogClose {...closeProps} testID="close">
          <Text>Close</Text>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  afterEach(cleanup);

  describe("Structure and rendering", () => {
    it("renders without crashing", () => {
      render(<TestDialog />);
    });

    it("renders trigger and content components", () => {
      const {getByTestId} = render(<TestDialog />);
      expect(getByTestId("trigger")).toBeTruthy();
      // Content is not rendered by default when dialog is closed
      expect(() => getByTestId("content")).toThrow();
    });

    it("renders content when dialog is open by default", () => {
      const {getByTestId} = render(
        <TestDialog rootProps={{defaultOpen: true}} />,
      );
      expect(getByTestId("content")).toBeTruthy();
    });
  });

  describe("Component props", () => {
    it("respects the controlled open prop", () => {
      const {getByTestId} = render(<TestDialog rootProps={{open: true}} />);

      expect(getByTestId("content")).toBeTruthy();
    });

    it("calls onOpenChange when trigger is pressed", () => {
      const onOpenChange = jest.fn();
      const {getByTestId} = render(<TestDialog rootProps={{onOpenChange}} />);

      fireEvent.press(getByTestId("trigger"));

      expect(onOpenChange).toHaveBeenCalled();
    });

    it("accepts borderRadius values from none to xl", () => {
      const radii = ["none", "sm", "md", "lg", "xl"] as const;
      radii.forEach((r) => {
        const {getByTestId, unmount} = render(
          <Dialog defaultOpen>
            <DialogContent borderRadius={r} testID="content">
              <Text>Body</Text>
            </DialogContent>
          </Dialog>,
        );
        expect(getByTestId("content")).toBeTruthy();
        unmount();
      });
    });

    it("clones props to the child when asChild is true", () => {
      const {getByTestId} = render(
        <Dialog defaultOpen>
          <DialogContent asChild baseClassName="bg-red-500">
            <View testID="child" />
          </DialogContent>
        </Dialog>,
      );

      expect(getByTestId("child").props.className).toContain("bg-red-500");
    });

    it("accepts modal prop on DialogContent", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent modal={false}>
            <Text>Content</Text>
          </DialogContent>
        </Dialog>,
      );
    });

    it("accepts forceMount prop on DialogContent", () => {
      const {getByTestId} = render(
        <Dialog defaultOpen>
          <DialogContent testID="content" forceMount>
            <Text>Body</Text>
          </DialogContent>
        </Dialog>,
      );
      expect(getByTestId("content")).toBeTruthy();
    });

    it("attaches advanced event handlers to DialogContent", () => {
      const onOpenAutoFocus = jest.fn();
      const onCloseAutoFocus = jest.fn();
      const onEscapeKeyDown = jest.fn();
      const onPointerDownOutside = jest.fn();
      const onInteractOutside = jest.fn();

      const {getByTestId} = render(
        <Dialog defaultOpen>
          <DialogContent
            testID="content"
            onOpenAutoFocus={onOpenAutoFocus}
            onCloseAutoFocus={onCloseAutoFocus}
            onEscapeKeyDown={onEscapeKeyDown}
            onPointerDownOutside={onPointerDownOutside}
            onInteractOutside={onInteractOutside}
          >
            <Text>Body</Text>
          </DialogContent>
        </Dialog>,
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
        <Dialog defaultOpen>
          <DialogPortal>
            <DialogOverlay testID="overlay" />
            <DialogContent testID="content">
              <DialogHeader testID="header">
                <DialogTitle testID="title">Dialog title</DialogTitle>
                <DialogDescription testID="description">
                  Dialog description
                </DialogDescription>
              </DialogHeader>
              <DialogFooter testID="footer">
                <DialogClose testID="closeBtn">
                  <Text>Close</Text>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>,
      );

      expect(getByTestId("overlay")).toBeTruthy();
      expect(getByTestId("content")).toBeTruthy();
      expect(getByTestId("header")).toBeTruthy();
      expect(getByTestId("footer")).toBeTruthy();
      expect(getByTestId("title")).toBeTruthy();
      expect(getByTestId("description")).toBeTruthy();
    });

    it("has heading accessibility role for DialogTitle", () => {
      const {getByTestId} = render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle testID="title">Dialog title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const title = getByTestId("title");
      expect(title.props.accessibilityRole).toBe("heading");
    });

    it("clones props when asChild is true for DialogTitle", () => {
      const {getByTestId} = render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle asChild baseClassName="text-red-500">
              <Text testID="child-title">Hi</Text>
            </DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      expect(getByTestId("child-title").props.className).toContain(
        "text-red-500",
      );
    });

    it("clones props when asChild is true for DialogContent", () => {
      const {getByTestId} = render(
        <Dialog defaultOpen>
          <DialogContent asChild baseClassName="bg-blue-500">
            <View testID="child-content" />
          </DialogContent>
        </Dialog>,
      );

      expect(getByTestId("child-content").props.className).toContain(
        "bg-blue-500",
      );
    });

    it("clones props when asChild is true for DialogOverlay", () => {
      const {getByTestId} = render(
        <Dialog defaultOpen>
          <DialogPortal>
            <DialogOverlay asChild baseClassName="opacity-50">
              <View testID="child-overlay" />
            </DialogOverlay>
            <DialogContent>
              <DialogClose testID="closeBtn">
                <Text>close</Text>
              </DialogClose>
            </DialogContent>
          </DialogPortal>
        </Dialog>,
      );

      expect(getByTestId("child-overlay").props.className).toContain(
        "opacity-50",
      );
    });
  });
});
