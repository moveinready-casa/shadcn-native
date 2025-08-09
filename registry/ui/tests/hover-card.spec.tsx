import React from "react";
import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import {Text, View} from "react-native";

import {HoverCard, HoverCardTrigger, HoverCardContent} from "../hover-card.tsx";

function TestHoverCard({
  rootProps = {},
  triggerProps = {},
  contentProps = {},
}: {
  rootProps?: Record<string, unknown>;
  triggerProps?: Record<string, unknown>;
  contentProps?: Record<string, unknown>;
}) {
  return (
    <HoverCard {...rootProps} testID="root">
      <HoverCardTrigger {...triggerProps} testID="trigger">
        <Text>Trigger</Text>
      </HoverCardTrigger>
      <HoverCardContent {...contentProps} testID="content">
        <Text testID="body">Card body</Text>
      </HoverCardContent>
    </HoverCard>
  );
}

describe("HoverCard", () => {
  afterEach(cleanup);

  describe("Structure and rendering", () => {
    it("renders without crashing", () => {
      render(<TestHoverCard />);
    });

    it("renders trigger and hides content by default", () => {
      const {getByTestId} = render(<TestHoverCard />);
      expect(getByTestId("trigger")).toBeTruthy();
      expect(() => getByTestId("content")).toThrow();
    });

    it("renders content when defaultOpen is true", () => {
      const {getByTestId} = render(
        <TestHoverCard rootProps={{defaultOpen: true}} />,
      );
      expect(getByTestId("content")).toBeTruthy();
    });

    it("respects controlled open prop", () => {
      const {getByTestId} = render(<TestHoverCard rootProps={{open: true}} />);
      expect(getByTestId("content")).toBeTruthy();
    });
  });

  describe("Opening and closing interactions", () => {
    it("opens on hover over the trigger", () => {
      const {getByTestId} = render(<TestHoverCard />);
      const trigger = getByTestId("trigger");

      fireEvent(trigger, "mouseEnter");
      expect(getByTestId("content")).toBeTruthy();
    });

    it("closes when hovering away from the root hit box", () => {
      const {getByTestId} = render(
        <TestHoverCard rootProps={{defaultOpen: true}} />,
      );
      const root = getByTestId("root");

      expect(getByTestId("content")).toBeTruthy();
      fireEvent(root, "mouseLeave");
      expect(() => getByTestId("content")).toThrow();
    });

    it("calls onOpenChange when state changes", () => {
      const onOpenChange = jest.fn();
      const {getByTestId} = render(
        <TestHoverCard rootProps={{onOpenChange}} />,
      );
      const trigger = getByTestId("trigger");

      fireEvent(trigger, "mouseEnter");
      expect(onOpenChange).toHaveBeenCalledWith(true);

      const root = getByTestId("root");
      fireEvent(root, "mouseLeave");
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("does not auto-close in controlled mode", () => {
      const onOpenChange = jest.fn();
      const {getByTestId} = render(
        <TestHoverCard rootProps={{open: true, onOpenChange}} />,
      );
      const root = getByTestId("root");

      fireEvent(root, "mouseLeave");
      expect(getByTestId("content")).toBeTruthy();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Component Props", () => {
    it("clones props to child when asChild is true for Trigger", () => {
      const {getByTestId} = render(
        <HoverCard defaultOpen>
          <HoverCardTrigger asChild baseClassName="bg-red-500" testID="trigger">
            <View testID="trigger-child" />
          </HoverCardTrigger>
          <HoverCardContent>
            <Text>Body</Text>
          </HoverCardContent>
        </HoverCard>,
      );
      expect(getByTestId("trigger-child").props.className).toContain(
        "bg-red-500",
      );
    });

    it("clones props to child when asChild is true for Content", () => {
      const {getByTestId} = render(
        <HoverCard defaultOpen>
          <HoverCardTrigger>
            <Text>Open</Text>
          </HoverCardTrigger>
          <HoverCardContent asChild baseClassName="bg-blue-500">
            <View testID="content-child" />
          </HoverCardContent>
        </HoverCard>,
      );
      expect(getByTestId("content-child").props.className).toContain(
        "bg-blue-500",
      );
    });

    it("applies shadcn/ui design token classes on Content by default", () => {
      const {getByTestId} = render(
        <HoverCard defaultOpen>
          <HoverCardTrigger>
            <Text>Open</Text>
          </HoverCardTrigger>
          <HoverCardContent testID="content">
            <Text>Body</Text>
          </HoverCardContent>
        </HoverCard>,
      );
      const node = getByTestId("content");
      const className = node.props.className as string;

      [
        "z-50",
        "rounded-md",
        "border",
        "border-border",
        "bg-popover",
        "text-popover-foreground",
        "shadow-md",
        "p-4",
      ].forEach((token) => expect(className).toContain(token));
    });

    it("applies disabled styles to trigger when disabled", () => {
      const {getByTestId} = render(
        <HoverCard>
          <HoverCardTrigger disabled testID="trigger">
            <Text>Open</Text>
          </HoverCardTrigger>
          <HoverCardContent testID="content">
            <Text>Body</Text>
          </HoverCardContent>
        </HoverCard>,
      );

      const trigger = getByTestId("trigger");
      expect(trigger.props.className).toContain("opacity-50");

      expect(() => getByTestId("content")).toThrow();
      fireEvent.press(trigger);
      expect(() => getByTestId("content")).toThrow();
    });

    it("applies loading styles to trigger when loading", () => {
      const {getByTestId} = render(
        <HoverCard>
          <HoverCardTrigger loading testID="trigger">
            <Text>Open</Text>
          </HoverCardTrigger>
          <HoverCardContent testID="content">
            <Text>Body</Text>
          </HoverCardContent>
        </HoverCard>,
      );

      const trigger = getByTestId("trigger");
      const className = trigger.props.className;
      expect(className).toContain("animate-pulse");
      expect(className).toContain("opacity-80");

      expect(() => getByTestId("content")).toThrow();
      fireEvent.press(trigger);
      expect(() => getByTestId("content")).toThrow();
    });
  });
});
