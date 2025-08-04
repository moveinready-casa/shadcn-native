import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleComponentProps,
  CollapsibleTriggerComponentProps,
  CollapsibleContentComponentProps,
} from "../collapsible.tsx";
import {Text, View} from "react-native";

function TestCollapsible({
  rootProps = {},
  triggerProps = {},
  contentProps = {},
}: {
  rootProps?: Omit<CollapsibleComponentProps, "children">;
  triggerProps?: Omit<CollapsibleTriggerComponentProps, "children">;
  contentProps?: Omit<CollapsibleContentComponentProps, "children">;
}) {
  return (
    <Collapsible {...rootProps} testID="collapsible">
      <CollapsibleTrigger {...triggerProps} testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent {...contentProps} testID="content">
        <Text>Hidden content</Text>
      </CollapsibleContent>
    </Collapsible>
  );
}

describe("Collapsible", () => {
  afterEach(cleanup);

  describe("Structure and rendering", () => {
    it("renders without crashing", () => {
      render(<TestCollapsible />);
    });

    it("is closed by default", () => {
      const {getByTestId} = render(<TestCollapsible />);
      const collapsible = getByTestId("collapsible");
      expect(collapsible.props.accessibilityState.expanded).toBe(false);
    });
  });

  describe("Interactions", () => {
    it("expands the content when the trigger is pressed", () => {
      const {queryAllByTestId} = render(<TestCollapsible />);
      const trigger = queryAllByTestId("trigger")[0];

      fireEvent.press(trigger);

      expect(queryAllByTestId("content")[0]).toBeTruthy();
    });

    it("collapses the content when the trigger is pressed again", () => {
      const {queryAllByTestId} = render(
        <TestCollapsible rootProps={{defaultOpen: true}} />,
      );
      const trigger = queryAllByTestId("trigger")[0];

      fireEvent.press(trigger);

      expect(queryAllByTestId("content")[0]).toBeFalsy();
    });

    it("does not respond to interaction when disabled", () => {
      const {queryAllByTestId} = render(
        <TestCollapsible rootProps={{disabled: true}} />,
      );
      const trigger = queryAllByTestId("trigger")[0];

      fireEvent.press(trigger);

      expect(queryAllByTestId("content")[0]).toBeFalsy();
    });
  });

  describe("Component props", () => {
    it("respects the controlled open prop", () => {
      const {queryAllByTestId} = render(
        <TestCollapsible rootProps={{open: true}} />,
      );

      expect(queryAllByTestId("content")[0]).toBeTruthy();

      const trigger = queryAllByTestId("trigger")[0];
      fireEvent.press(trigger);

      expect(queryAllByTestId("content")[0]).toBeTruthy();
    });

    it("calls onOpenChange when the open state changes", () => {
      const onOpenChange = jest.fn();
      const {queryAllByTestId} = render(
        <TestCollapsible rootProps={{onOpenChange}} />,
      );
      const trigger = queryAllByTestId("trigger")[0];

      fireEvent.press(trigger);

      expect(onOpenChange).toHaveBeenCalled();
    });

    it("clones props to the child when asChild is true", () => {
      const {getByTestId} = render(
        <Collapsible asChild baseClassName="bg-red-500">
          <View testID="child" />
        </Collapsible>,
      );

      expect(getByTestId("child").props.className).toBe("bg-red-500");
    });
  });
});
