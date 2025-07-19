import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import {
  Accordion,
  AccordionContent,
  AccordionContentProps,
  AccordionItem,
  AccordionItemProps,
  AccordionProps,
  AccordionTrigger,
  AccordionTriggerProps,
} from "../accordion";
import {Text, View} from "react-native";

describe("Accordion", () => {
  afterEach(cleanup);

  const TestAccordion = ({
    rootProps,
    itemProps,
    triggerProps,
    contentProps,
  }: {
    rootProps?: Omit<Partial<AccordionProps>, "children">;
    itemProps?: Omit<Partial<AccordionItemProps>, "children">;
    triggerProps?: Omit<Partial<AccordionTriggerProps>, "children">;
    contentProps?: Omit<Partial<AccordionContentProps>, "children">;
  }) => {
    return (
      <Accordion {...rootProps}>
        <AccordionItem value="item-1" {...itemProps}>
          <AccordionTrigger {...triggerProps}>
            <Text testID="trigger-1">Test item 1 trigger</Text>
          </AccordionTrigger>
          <AccordionContent {...contentProps}>
            <Text testID="content-1">Test item 1 content</Text>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" {...itemProps}>
          <AccordionTrigger {...triggerProps}>
            <Text testID="trigger-2">Test item 2 trigger</Text>
          </AccordionTrigger>
          <AccordionContent {...contentProps}>
            <Text testID="content-2">Test item 2 content</Text>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            <Text testID="trigger-3">Test item 3 trigger</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text testID="content-3">Test item 3 content</Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };
  describe("Structure and rendering", () => {
    it("renders the accordion without errors", () => {
      render(<TestAccordion />);
    });

    it("renders with all items closed by default", () => {
      const {getAllByRole} = render(<TestAccordion />);

      const buttons = getAllByRole("button");

      buttons.forEach((button) => {
        expect(button.props.accessibilityHint).toBe("Expands the content");
      });
    });
  });

  describe("Interactions", () => {
    it("expands the content when the trigger is pressed", () => {
      const {queryAllByTestId} = render(<TestAccordion />);

      const trigger = queryAllByTestId("trigger-1")[0];
      fireEvent.press(trigger);

      expect(queryAllByTestId("content-1")[1]).toBeVisible();
    });

    it("allows multiple open items when type is multiple", () => {
      const {queryAllByTestId} = render(
        <TestAccordion rootProps={{type: "multiple"}} />,
      );

      const trigger1 = queryAllByTestId("trigger-1")[0];
      const trigger2 = queryAllByTestId("trigger-2")[0];
      fireEvent.press(trigger1);
      fireEvent.press(trigger2);

      expect(queryAllByTestId("content-1")[1]).toBeVisible();
      expect(queryAllByTestId("content-2")[1]).toBeVisible();
    });

    it("does not allow multiple open items when type is single", () => {
      const {queryAllByTestId} = render(
        <TestAccordion rootProps={{type: "single"}} />,
      );

      const trigger1 = queryAllByTestId("trigger-1")[0];
      fireEvent.press(trigger1);
      expect(queryAllByTestId("content-1")[1]).toBeVisible();

      const trigger2 = queryAllByTestId("trigger-2")[0];
      fireEvent.press(trigger2);
      expect(queryAllByTestId("content-2")[1]).toBeVisible();
      expect(queryAllByTestId("content-1")[1]).toBeFalsy();
    });

    it("collapses the content when the trigger is pressed", () => {
      const {queryAllByTestId} = render(
        <TestAccordion
          rootProps={{type: "multiple", defaultValue: ["item-1", "item-2"]}}
        />,
      );

      const trigger1 = queryAllByTestId("trigger-1")[0];
      const trigger2 = queryAllByTestId("trigger-2")[0];
      fireEvent.press(trigger1);
      fireEvent.press(trigger2);

      expect(queryAllByTestId("content-1")[1]).toBeFalsy();
      expect(queryAllByTestId("content-2")[1]).toBeFalsy();
    });
  });

  describe("Component Props", () => {
    describe("Root", () => {
      it("clones prop to the nearest child when asChild is true", () => {
        const {queryAllByTestId} = render(
          <Accordion asChild type="multiple">
            <View testID="child" />
          </Accordion>,
        );

        expect(queryAllByTestId("child")[0]).toHaveProp(
          "accessibilityRole",
          "list",
        );
      });

      it("does not allow multiple open items when type is single", () => {
        expect(() =>
          render(
            <TestAccordion
              rootProps={{type: "single", value: ["item-1", "item-2"]}}
            />,
          ),
        ).toThrow("Value must be a string when type is single");
      });

      it("allows multiple open items when type is multiple", () => {
        const {getAllByRole} = render(
          <TestAccordion
            rootProps={{
              type: "multiple",
              value: ["item-1", "item-2"],
            }}
          />,
        );

        const buttons = getAllByRole("button");

        expect(buttons[0].props.accessibilityHint).toBe("Collapse the content");
        expect(buttons[1].props.accessibilityHint).toBe("Collapse the content");
        expect(buttons[2].props.accessibilityHint).toBe("Expands the content");
      });

      it("sets controlled state when value is provided", () => {
        const {queryAllByTestId} = render(
          <TestAccordion
            rootProps={{type: "multiple", value: ["item-1", "item-2"]}}
          />,
        );

        expect(queryAllByTestId("content-1")[1]).toBeVisible();
        expect(queryAllByTestId("content-2")[1]).toBeVisible();

        const trigger1 = queryAllByTestId("trigger-1")[0];
        const trigger2 = queryAllByTestId("trigger-2")[0];
        fireEvent.press(trigger1);
        fireEvent.press(trigger2);

        expect(queryAllByTestId("content-1")[1]).toBeTruthy();
        expect(queryAllByTestId("content-2")[1]).toBeTruthy();
      });

      it("sets uncontrolled defaults when defaultValue is provided", () => {
        const {queryAllByTestId} = render(
          <TestAccordion
            rootProps={{type: "multiple", defaultValue: ["item-1", "item-2"]}}
          />,
        );

        expect(queryAllByTestId("content-1")[1]).toBeVisible();
        expect(queryAllByTestId("content-2")[1]).toBeVisible();

        const trigger1 = queryAllByTestId("trigger-1")[0];
        const trigger2 = queryAllByTestId("trigger-2")[0];
        fireEvent.press(trigger1);
        fireEvent.press(trigger2);

        expect(queryAllByTestId("content-1")[1]).toBeFalsy();
        expect(queryAllByTestId("content-2")[1]).toBeFalsy();
      });

      it("runs onValueChange when value changes", () => {
        const onValueChange = jest.fn();
        const {queryAllByTestId} = render(
          <TestAccordion rootProps={{onValueChange: onValueChange}} />,
        );
        const trigger1 = queryAllByTestId("trigger-1")[0];
        fireEvent.press(trigger1);

        expect(onValueChange).toHaveBeenCalled();
      });

      it("disables manual closing when collapsible is false", () => {
        const {queryAllByTestId} = render(
          <TestAccordion rootProps={{collapsible: false}} />,
        );

        const trigger1 = queryAllByTestId("trigger-1")[0];
        fireEvent.press(trigger1);
        expect(queryAllByTestId("content-1")[1]).toBeTruthy();
        fireEvent.press(trigger1);
        expect(queryAllByTestId("content-1")[1]).toBeTruthy();

        const trigger2 = queryAllByTestId("trigger-2")[0];
        fireEvent.press(trigger2);
        expect(queryAllByTestId("content-2")[1]).toBeTruthy();
        expect(queryAllByTestId("content-1")[1]).toBeFalsy();
      });

      it("prevents all interactions when disabled is true", () => {
        const {queryAllByTestId} = render(
          <TestAccordion rootProps={{disabled: true}} />,
        );

        const trigger1 = queryAllByTestId("trigger-1")[0];
        fireEvent.press(trigger1);
        expect(queryAllByTestId("content-1")[1]).toBeFalsy();
      });
    });

    describe("Item", () => {
      it("clones props to the nearest child when asChild is true", () => {
        const {queryAllByTestId} = render(
          <Accordion>
            <AccordionItem asChild value="item-1" className="text-red-500">
              <Text testID="child">Hello</Text>
            </AccordionItem>
          </Accordion>,
        );

        expect(queryAllByTestId("child")[0]).toHaveProp(
          "className",
          "border-b last:border-b-0 text-red-500",
        );
      });

      it("disabled overrides root disabled", () => {
        const {queryAllByTestId} = render(
          <TestAccordion
            rootProps={{disabled: false}}
            itemProps={{disabled: true}}
          />,
        );

        const trigger1 = queryAllByTestId("trigger-1")[0];
        fireEvent.press(trigger1);
        expect(queryAllByTestId("content-1")[1]).toBeFalsy();
      });
    });

    describe("Trigger", () => {
      it("clones props to the nearest child when asChild is true", () => {
        const {queryAllByTestId} = render(
          <Accordion>
            <AccordionItem value="item-1">
              <AccordionTrigger asChild className="text-red-500">
                <Text testID="child">Hello</Text>
              </AccordionTrigger>
            </AccordionItem>
          </Accordion>,
        );

        expect(queryAllByTestId("child")[0]).toHaveProp(
          "className",
          "text-red-500",
        );
      });
    });

    describe("Content", () => {
      it("clones props to the nearest child when asChild is true", () => {
        const {queryAllByTestId} = render(
          <Accordion value="item-1">
            <AccordionItem value="item-1">
              <AccordionContent asChild className="text-red-500">
                <Text testID="child">Hello</Text>
              </AccordionContent>
            </AccordionItem>
          </Accordion>,
        );

        expect(queryAllByTestId("child")[0]).toHaveProp(
          "className",
          "text-red-500",
        );
      });
    });
  });
});
