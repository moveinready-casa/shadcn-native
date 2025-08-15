import React from "react";
import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import {Text, View} from "react-native";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "../tabs.tsx";

function TestTabs({
  rootProps = {},
  listProps = {},
  accountTriggerProps = {},
  passwordTriggerProps = {},
  accountContentProps = {},
  passwordContentProps = {},
}: {
  rootProps?: Record<string, unknown>;
  listProps?: Record<string, unknown>;
  accountTriggerProps?: Record<string, unknown>;
  passwordTriggerProps?: Record<string, unknown>;
  accountContentProps?: Record<string, unknown>;
  passwordContentProps?: Record<string, unknown>;
}) {
  return (
    <Tabs {...rootProps}>
      <TabsList testID="list" {...listProps}>
        <TabsTrigger
          testID="trigger-account"
          value="account"
          {...accountTriggerProps}
        >
          <Text>Account</Text>
        </TabsTrigger>
        <TabsTrigger
          testID="trigger-password"
          value="password"
          {...passwordTriggerProps}
        >
          <Text>Password</Text>
        </TabsTrigger>
      </TabsList>
      <TabsContent
        testID="content-account"
        value="account"
        {...accountContentProps}
      >
        <Text>Account content</Text>
      </TabsContent>
      <TabsContent
        testID="content-password"
        value="password"
        {...passwordContentProps}
      >
        <Text>Password content</Text>
      </TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  afterEach(cleanup);

  describe("structure & accessibility", () => {
    it("renders without crashing", () => {
      render(<TestTabs />);
    });

    it("sets accessibility roles for list and triggers", () => {
      const {getByTestId} = render(
        <TestTabs rootProps={{defaultValue: "account"}} />,
      );
      expect(getByTestId("list").props.accessibilityRole).toBe("tablist");
      expect(getByTestId("trigger-account").props.accessibilityRole).toBe(
        "tab",
      );
      expect(getByTestId("trigger-password").props.accessibilityRole).toBe(
        "tab",
      );
    });

    it("marks the selected trigger via accessibilityState.selected", () => {
      const {getByTestId} = render(
        <TestTabs rootProps={{defaultValue: "account"}} />,
      );
      expect(
        getByTestId("trigger-account").props.accessibilityState?.selected,
      ).toBe(true);
      expect(
        getByTestId("trigger-password").props.accessibilityState?.selected,
      ).not.toBe(true);
    });
  });

  describe("uncontrolled behavior (defaultValue)", () => {
    it("shows the default tab content initially and hides others", () => {
      const {queryByTestId} = render(
        <TestTabs rootProps={{defaultValue: "account"}} />,
      );
      expect(queryByTestId("content-account")).toBeTruthy();
      expect(queryByTestId("content-password")).toBeFalsy();
    });

    it("changes selected tab and content on trigger press", () => {
      const {getByTestId, queryByTestId} = render(
        <TestTabs rootProps={{defaultValue: "account"}} />,
      );

      fireEvent.press(getByTestId("trigger-password"));

      expect(queryByTestId("content-password")).toBeTruthy();
      expect(queryByTestId("content-account")).toBeFalsy();

      expect(
        getByTestId("trigger-password").props.accessibilityState?.selected,
      ).toBe(true);
      expect(
        getByTestId("trigger-account").props.accessibilityState?.selected,
      ).not.toBe(true);
    });
  });

  describe("controlled behavior (value)", () => {
    it("respects the controlled value and calls onValueChange on press", () => {
      const onValueChange = jest.fn();
      const {getByTestId, queryByTestId, rerender} = render(
        <TestTabs rootProps={{value: "account", onValueChange}} />,
      );

      expect(queryByTestId("content-account")).toBeTruthy();
      expect(queryByTestId("content-password")).toBeFalsy();

      fireEvent.press(getByTestId("trigger-password"));
      expect(onValueChange).toHaveBeenCalledWith("password");
      expect(queryByTestId("content-account")).toBeTruthy();
      expect(queryByTestId("content-password")).toBeFalsy();

      rerender(<TestTabs rootProps={{value: "password", onValueChange}} />);
      expect(queryByTestId("content-password")).toBeTruthy();
      expect(queryByTestId("content-account")).toBeFalsy();
    });
  });

  describe("props", () => {
    it("disables a trigger when disabled is true", () => {
      const {getByTestId, queryByTestId} = render(
        <TestTabs
          rootProps={{defaultValue: "account"}}
          passwordTriggerProps={{disabled: true}}
        />,
      );

      fireEvent.press(getByTestId("trigger-password"));
      expect(queryByTestId("content-account")).toBeTruthy();
      expect(queryByTestId("content-password")).toBeFalsy();
      expect(
        getByTestId("trigger-password").props.accessibilityState?.disabled,
      ).toBe(true);
    });

    it("disables all triggers when list disabled is true", () => {
      const {getByTestId, queryByTestId} = render(
        <TestTabs
          rootProps={{defaultValue: "account"}}
          listProps={{disabled: true}}
        />,
      );

      expect(
        getByTestId("trigger-account").props.accessibilityState?.disabled,
      ).toBe(true);
      expect(
        getByTestId("trigger-password").props.accessibilityState?.disabled,
      ).toBe(true);

      fireEvent.press(getByTestId("trigger-password"));
      expect(queryByTestId("content-account")).toBeTruthy();
      expect(queryByTestId("content-password")).toBeFalsy();
    });

    it("supports vertical orientation on the list (adds a vertical layout class)", () => {
      const {getByTestId} = render(
        <TestTabs
          rootProps={{defaultValue: "account", orientation: "vertical"}}
        />,
      );
      const list = getByTestId("list");
      expect(list.props.className ?? "").toEqual(
        expect.stringContaining("flex-col"),
      );
    });

    it("applies shadcn/ui-like styles on list and triggers", () => {
      const {getByTestId} = render(
        <TestTabs rootProps={{defaultValue: "account"}} />,
      );
      const list = getByTestId("list");
      const trigger = getByTestId("trigger-account");

      expect(list.props.className ?? "").toEqual(
        expect.stringContaining("bg-muted"),
      );
      expect(trigger.props.className ?? "").toEqual(
        expect.stringContaining("text-sm"),
      );
    });

    describe("size variants", () => {
      const sizeTests = [
        {size: "sm", expectedClass: "h-9"},
        {size: "md", expectedClass: "h-10"},
        {size: "lg", expectedClass: "h-11"},
      ];

      sizeTests.forEach(({size, expectedClass}) => {
        it(`applies ${size} size variant correctly`, () => {
          const {getByTestId} = render(
            <TestTabs rootProps={{defaultValue: "account", size}} />,
          );
          expect(getByTestId("list").props.className ?? "").toEqual(
            expect.stringContaining(expectedClass),
          );
        });
      });
    });

    describe("color variants", () => {
      const colorTests = [
        {color: "destructive", expectedClass: "destructive"},
        {color: "secondary", expectedClass: "secondary"},
      ];

      colorTests.forEach(({color, expectedClass}) => {
        it(`applies ${color} color variant correctly`, () => {
          const {getByTestId} = render(
            <TestTabs
              rootProps={{defaultValue: "account"}}
              accountTriggerProps={{color}}
            />,
          );
          expect(getByTestId("trigger-account").props.className ?? "").toEqual(
            expect.stringContaining(expectedClass),
          );
        });
      });
    });

    describe("variant styles", () => {
      const variantTests = [
        {
          variant: "shadcn",
          expectedListClass: "bg-muted",
          description: "applies default shadcn styling",
        },
        {
          variant: "underlined",
          expectedTriggerClass: "border-b-2",
          description: "adds underline/border on active trigger",
        },
        {
          variant: "outlined",
          expectedTriggerClass: "",
          description: "applies no additional styling",
        },
        {
          variant: "ghost",
          expectedTriggerClass: "",
          description: "applies no additional styling",
        },
      ];

      variantTests.forEach(
        ({variant, expectedListClass, expectedTriggerClass, description}) => {
          it(`${description} for ${variant} variant`, () => {
            const {getByTestId} = render(
              <TestTabs rootProps={{defaultValue: "account", variant}} />,
            );

            if (expectedListClass) {
              expect(getByTestId("list").props.className ?? "").toEqual(
                expect.stringContaining(expectedListClass),
              );
            }

            if (expectedTriggerClass !== undefined) {
              if (expectedTriggerClass === "") {
                expect(
                  getByTestId("trigger-account").props.className,
                ).toBeDefined();
              } else {
                expect(
                  getByTestId("trigger-account").props.className ?? "",
                ).toEqual(expect.stringContaining(expectedTriggerClass));
              }
            }
          });
        },
      );
    });

    describe("border radius", () => {
      const borderRadiusTests = [
        {borderRadius: "sm", expectedClass: "rounded-sm"},
        {borderRadius: "xl", expectedClass: "rounded-xl"},
      ];

      borderRadiusTests.forEach(({borderRadius, expectedClass}) => {
        it(`applies ${borderRadius} border radius correctly`, () => {
          const {getByTestId} = render(
            <TestTabs rootProps={{defaultValue: "account", borderRadius}} />,
          );
          expect(getByTestId("list").props.className ?? "").toEqual(
            expect.stringContaining(expectedClass),
          );
        });
      });
    });
  });

  describe("asChild support", () => {
    it("clones props to nearest child when asChild is true on TabsList", () => {
      const {getByTestId} = render(
        <Tabs>
          <TabsList asChild>
            <View testID="list-child" />
          </TabsList>
          <TabsContent value="a">
            <Text>A</Text>
          </TabsContent>
        </Tabs>,
      );
      expect(getByTestId("list-child").props.accessibilityRole).toBe("tablist");
    });

    it("clones props to nearest child when asChild is true on TabsTrigger", () => {
      const {getByTestId} = render(
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger asChild value="a" className="text-red-500">
              <Text testID="trigger-child">A</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="a">
            <Text>A</Text>
          </TabsContent>
        </Tabs>,
      );
      expect(getByTestId("trigger-child").props.accessibilityRole).toBe("tab");
      expect(getByTestId("trigger-child").props.className).toEqual(
        expect.stringContaining("text-red-500"),
      );
    });

    it("clones props to nearest child when asChild is true on TabsContent", () => {
      const {getByTestId} = render(
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
          </TabsList>
          <TabsContent asChild value="a" className="text-blue-500">
            <Text testID="content-child">A content</Text>
          </TabsContent>
        </Tabs>,
      );
      expect(getByTestId("content-child").props.className).toEqual(
        expect.stringContaining("text-blue-500"),
      );
    });

    it("renders start and end content in triggers", () => {
      const {getByTestId} = render(
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger
              value="a"
              startContent={<Text testID="start">S</Text>}
              endContent={<Text testID="end">E</Text>}
            >
              <Text>Label</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="a">
            <Text>A</Text>
          </TabsContent>
        </Tabs>,
      );
      expect(getByTestId("start")).toBeTruthy();
      expect(getByTestId("end")).toBeTruthy();
    });
  });
});
