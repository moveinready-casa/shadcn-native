import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbEllipsis,
} from "../breadcrumb";
import {View} from "react-native";

afterEach(cleanup);

// Test helper for basic breadcrumb structure
const TestBreadcrumb = ({
  rootProps,
  itemProps,
  linkProps,
  pageProps,
  separatorProps,
  includeEllipsis = false,
}: {
  rootProps?: any;
  itemProps?: any;
  linkProps?: any;
  pageProps?: any;
  separatorProps?: any;
  includeEllipsis?: boolean;
}) => {
  return (
    <Breadcrumb testID="breadcrumb-root" {...rootProps}>
      <BreadcrumbList testID="breadcrumb-list">
        <BreadcrumbItem testID="item-1" {...itemProps}>
          <BreadcrumbLink testID="link-home" {...linkProps}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator testID="separator-1" {...separatorProps}>
          /
        </BreadcrumbSeparator>
        {includeEllipsis && (
          <>
            <BreadcrumbItem testID="item-ellipsis">
              <BreadcrumbEllipsis testID="ellipsis">...</BreadcrumbEllipsis>
            </BreadcrumbItem>
            <BreadcrumbSeparator testID="separator-ellipsis">
              /
            </BreadcrumbSeparator>
          </>
        )}
        <BreadcrumbItem testID="item-current" {...itemProps}>
          <BreadcrumbPage testID="page-current" {...pageProps}>
            Current
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

describe("Breadcrumb", () => {
  describe("Root Component", () => {
    it("renders without crashing", () => {
      render(<TestBreadcrumb />);
    });

    it("sets accessibilityRole=navigation on the root", () => {
      const {getByTestId} = render(<TestBreadcrumb />);
      expect(getByTestId("breadcrumb-root").props.accessibilityRole).toBe(
        "navigation",
      );
    });

    it("applies isDisabled to child links", () => {
      const {getByTestId} = render(
        <TestBreadcrumb rootProps={{isDisabled: true}} />,
      );
      expect(
        getByTestId("link-home").props.accessibilityState?.disabled,
      ).toBeTruthy();
    });

    it("renders custom separator from separator prop", () => {
      const {getByText} = render(
        <TestBreadcrumb rootProps={{separator: "-"}} />,
      );
      expect(getByText("-")).toBeTruthy();
    });

    it("supports size prop", () => {
      const {getByTestId} = render(<TestBreadcrumb rootProps={{size: "sm"}} />);
      expect(getByTestId("breadcrumb-root").props.className).toContain(
        "text-sm",
      );
    });

    it("supports color prop", () => {
      const {getByTestId} = render(
        <TestBreadcrumb rootProps={{color: "primary"}} />,
      );
      expect(getByTestId("breadcrumb-root").props.className).toBeTruthy();
    });

    it("supports variant prop", () => {
      const {getByTestId} = render(
        <TestBreadcrumb rootProps={{variant: "bordered"}} />,
      );
      expect(getByTestId("breadcrumb-root").props.className).toContain(
        "border",
      );
    });

    it("supports radius prop", () => {
      const {getByTestId} = render(
        <TestBreadcrumb rootProps={{radius: "sm"}} />,
      );
      expect(getByTestId("breadcrumb-root").props.className).toContain(
        "rounded",
      );
    });

    it("supports underline prop", () => {
      const {getByTestId} = render(
        <TestBreadcrumb rootProps={{underline: "hover"}} />,
      );
      expect(getByTestId("breadcrumb-root").props.className).toContain(
        "hover:underline",
      );
    });

    it("handles maxItems prop for collapsing", () => {
      const {queryByText} = render(
        <Breadcrumb maxItems={2} itemsBeforeCollapse={1} itemsAfterCollapse={1}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Level 1</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink>Level 2</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Level 3</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(queryByText("Level 2")).toBeNull();
    });

    it("clones props to child when asChild is true", () => {
      const {getByTestId} = render(
        <Breadcrumb asChild>
          <View testID="custom-child" />
        </Breadcrumb>,
      );
      expect(getByTestId("custom-child").props.accessibilityRole).toBe(
        "navigation",
      );
    });
  });

  describe("BreadcrumbList", () => {
    it("renders as an ordered list", () => {
      const {getByTestId} = render(<TestBreadcrumb />);
      expect(getByTestId("breadcrumb-list").props.accessibilityRole).toBe(
        "list",
      );
    });

    it("applies custom className", () => {
      const customClass = "custom-list-class";
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList testID="list" className={customClass}>
            <BreadcrumbItem>
              <BreadcrumbLink>Test</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(getByTestId("list").props.className).toContain(customClass);
    });
  });

  describe("BreadcrumbItem", () => {
    it("renders without crashing", () => {
      render(<TestBreadcrumb />);
    });

    it("supports isCurrent prop", () => {
      const {getByTestId} = render(
        <TestBreadcrumb itemProps={{isCurrent: true}} />,
      );
      expect(getByTestId("item-1")).toBeTruthy();
    });

    it("supports isLast prop", () => {
      const {getByTestId} = render(
        <TestBreadcrumb itemProps={{isLast: true}} />,
      );
      expect(getByTestId("item-1")).toBeTruthy();
    });

    it("supports disabled prop", () => {
      const {getByTestId} = render(
        <TestBreadcrumb itemProps={{disabled: true}} />,
      );
      expect(
        getByTestId("link-home").props.accessibilityState?.disabled,
      ).toBeTruthy();
    });

    it("supports startContent prop", () => {
      const {getByText} = render(
        <TestBreadcrumb itemProps={{startContent: "🏠"}} />,
      );
      expect(getByText("🏠")).toBeTruthy();
    });

    it("supports endContent prop", () => {
      const {getByText} = render(
        <TestBreadcrumb itemProps={{endContent: "→"}} />,
      );
      expect(getByText("→")).toBeTruthy();
    });

    it("supports hideSeparator prop", () => {
      const {queryByTestId} = render(
        <TestBreadcrumb itemProps={{hideSeparator: true}} />,
      );
      expect(queryByTestId("separator-1")).toBeFalsy();
    });

    it("supports color prop", () => {
      const {getByTestId} = render(
        <TestBreadcrumb itemProps={{color: "primary"}} />,
      );
      expect(getByTestId("item-1").props.className).toBeTruthy();
    });

    it("supports size prop", () => {
      const {getByTestId} = render(<TestBreadcrumb itemProps={{size: "sm"}} />);
      expect(getByTestId("item-1").props.className).toBeTruthy();
    });

    it("supports underline prop", () => {
      const {getByTestId} = render(
        <TestBreadcrumb itemProps={{underline: "always"}} />,
      );
      expect(getByTestId("item-1").props.className).toBeTruthy();
    });
  });

  describe("BreadcrumbLink", () => {
    it("renders interactive link", () => {
      const onPress = jest.fn();
      const {getByTestId} = render(<TestBreadcrumb linkProps={{onPress}} />);

      fireEvent.press(getByTestId("link-home"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("does not trigger onPress when disabled", () => {
      const onPress = jest.fn();
      const {getByTestId} = render(
        <TestBreadcrumb linkProps={{onPress, isDisabled: true}} />,
      );

      fireEvent.press(getByTestId("link-home"));
      expect(onPress).not.toHaveBeenCalled();
    });

    it("supports href prop for navigation", () => {
      const {getByTestId} = render(
        <TestBreadcrumb linkProps={{href: "/home"}} />,
      );
      expect(getByTestId("link-home").props.href).toBe("/home");
    });

    it("supports isDisabled prop", () => {
      const {getByTestId} = render(
        <TestBreadcrumb linkProps={{isDisabled: true}} />,
      );
      expect(
        getByTestId("link-home").props.accessibilityState?.disabled,
      ).toBeTruthy();
    });

    it("supports asChild prop", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <View testID="custom-link">Custom Link</View>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(getByTestId("custom-link")).toBeTruthy();
    });

    it("supports onPressStart and onPressEnd events", () => {
      const onPressStart = jest.fn();
      const onPressEnd = jest.fn();
      const {getByTestId} = render(
        <TestBreadcrumb linkProps={{onPressStart, onPressEnd}} />,
      );

      fireEvent(getByTestId("link-home"), "pressIn");
      expect(onPressStart).toHaveBeenCalled();

      fireEvent(getByTestId("link-home"), "pressOut");
      expect(onPressEnd).toHaveBeenCalled();
    });
  });

  describe("BreadcrumbPage", () => {
    it("renders current page without link behavior", () => {
      const onPress = jest.fn();
      const {getByTestId} = render(<TestBreadcrumb pageProps={{onPress}} />);

      fireEvent.press(getByTestId("page-current"));
      expect(onPress).not.toHaveBeenCalled();
    });

    it("has aria-current=page attribute", () => {
      const {getByTestId} = render(<TestBreadcrumb />);
      expect(getByTestId("page-current").props["aria-current"]).toBe("page");
    });

    it("supports custom className", () => {
      const customClass = "custom-page-class";
      const {getByTestId} = render(
        <TestBreadcrumb pageProps={{className: customClass}} />,
      );
      expect(getByTestId("page-current").props.className).toContain(
        customClass,
      );
    });

    it("supports asChild prop", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage asChild>
                <View testID="custom-page">Custom Page</View>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(getByTestId("custom-page")).toBeTruthy();
    });
  });

  describe("BreadcrumbSeparator", () => {
    it("renders separator content", () => {
      const {getByText} = render(<TestBreadcrumb />);
      expect(getByText("/")).toBeTruthy();
    });

    it("renders custom separator content", () => {
      const {getByText} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>→</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(getByText("→")).toBeTruthy();
    });

    it("has aria-hidden=true attribute", () => {
      const {getByTestId} = render(<TestBreadcrumb />);
      expect(getByTestId("separator-1").props["aria-hidden"]).toBe(true);
    });

    it("supports custom className", () => {
      const customClass = "custom-separator-class";
      const {getByTestId} = render(
        <TestBreadcrumb separatorProps={{className: customClass}} />,
      );
      expect(getByTestId("separator-1").props.className).toContain(customClass);
    });

    it("supports asChild prop", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator asChild>
              <View testID="custom-separator">|</View>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(getByTestId("custom-separator")).toBeTruthy();
    });
  });

  describe("BreadcrumbEllipsis", () => {
    it("renders ellipsis content", () => {
      const {getByTestId} = render(<TestBreadcrumb includeEllipsis />);
      expect(getByTestId("ellipsis")).toBeTruthy();
    });

    it("renders default ellipsis character", () => {
      const {getByText} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(getByText("…") || getByText("...")).toBeTruthy();
    });

    it("supports custom ellipsis content", () => {
      const {getByText} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbEllipsis>More...</BreadcrumbEllipsis>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(getByText("More...")).toBeTruthy();
    });

    it("supports custom className", () => {
      const customClass = "custom-ellipsis-class";
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbEllipsis testID="ellipsis" className={customClass}>
                ...
              </BreadcrumbEllipsis>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(getByTestId("ellipsis").props.className).toContain(customClass);
    });

    it("supports asChild prop", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbEllipsis asChild>
                <View testID="custom-ellipsis">***</View>
              </BreadcrumbEllipsis>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(getByTestId("custom-ellipsis")).toBeTruthy();
    });
  });

  describe("Integration", () => {
    it("handles onAction callback from root", () => {
      const onAction = jest.fn();
      const {getByTestId} = render(
        <Breadcrumb onAction={onAction}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink testID="actionable-link" key="home">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      fireEvent.press(getByTestId("actionable-link"));
      expect(onAction).toHaveBeenCalledWith("home");
    });

    it("supports nested routing components", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <View testID="router-link" href="/home">
                  Home
                </View>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(getByTestId("router-link").props.href).toBe("/home");
    });

    it("maintains proper accessibility hierarchy", () => {
      const {getByTestId} = render(<TestBreadcrumb />);

      expect(getByTestId("breadcrumb-root").props.accessibilityRole).toBe(
        "navigation",
      );
      expect(getByTestId("breadcrumb-list").props.accessibilityRole).toBe(
        "list",
      );
      expect(getByTestId("separator-1").props["aria-hidden"]).toBe(true);
      expect(getByTestId("page-current").props["aria-current"]).toBe("page");
    });
  });
});
