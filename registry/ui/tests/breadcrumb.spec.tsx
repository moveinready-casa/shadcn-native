import {describe, expect, it, jest} from "@jest/globals";
import {
  Breadcrumb,
  BreadcrumbContext,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbItemContext,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../breadcrumb";
import {render} from "@testing-library/react-native";
import {useContext} from "react";
import {View} from "react-native";

Object.defineProperty(global, "window", {
  value: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  writable: true,
});

function TestBreadcrumb({
  disabled,
  startContent,
  endContent,
}: {
  disabled?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList testID="breadcrumb-list">
        <BreadcrumbItem testID="breadcrumb-item-1" disabled={disabled}>
          <BreadcrumbLink
            testID="breadcrumb-link-1"
            startContent={startContent}
            endContent={endContent}
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator testID="breadcrumb-separator" />
        <BreadcrumbEllipsis testID="breadcrumb-ellipsis" />
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

describe("Breadcrumb", () => {
  it("renders without crashing", () => {
    render(<TestBreadcrumb />);
  });

  describe("Breadcrumb", () => {
    it("passes context to children", () => {
      function BreadcrumbChild() {
        const context = useContext(BreadcrumbContext);
        expect(context?.navProps).toBeTruthy();
        expect(context?.listProps).toBeTruthy();
        return null;
      }

      render(
        <Breadcrumb>
          <BreadcrumbChild />
        </Breadcrumb>,
      );
    });

    it("handles accessibility props", () => {
      const {getByTestId} = render(
        <Breadcrumb testID="breadcrumb">
          <View />
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb")).toHaveProp("accessible", true);
      expect(getByTestId("breadcrumb")).toHaveProp("role", "navigation");
      expect(getByTestId("breadcrumb")).toHaveProp(
        "accessibilityRole",
        "navigation",
      );
    });

    it("passes props to the first child when asChild is true", () => {
      const {getByTestId} = render(
        <Breadcrumb asChild>
          <View testID="breadcrumb-child" />
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-child")).toHaveProp("accessible", true);
      expect(getByTestId("breadcrumb-child")).toHaveProp("role", "navigation");
      expect(getByTestId("breadcrumb-child")).toHaveProp(
        "accessibilityRole",
        "navigation",
      );
    });

    it("allows custom props to be passed to the underlying view", () => {
      const {getByTestId} = render(
        <Breadcrumb
          testID="breadcrumb"
          className="text-red-500"
          aria-label="breadcrumb"
        >
          <View testID="breadcrumb-child" />
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb")).toHaveProp("className", "text-red-500");
      expect(getByTestId("breadcrumb")).toHaveProp("aria-label", "breadcrumb");
    });

    it("allows custom baseClassName to be passed", () => {
      const {getByTestId} = render(
        <Breadcrumb testID="breadcrumb" baseClassName="text-red-500">
          <View testID="breadcrumb-child" />
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb")).toHaveProp("className", "text-red-500");
    });
  });

  describe("BreadcrumbList", () => {
    it("does not render when not wrapped in a Breadcrumb", () => {
      expect(() =>
        render(
          <BreadcrumbList>
            <View />
          </BreadcrumbList>,
        ),
      ).toThrow("BreadcrumbList must be used within a Breadcrumb");
    });

    it("handles accessibility props", () => {
      const {getByTestId} = render(<TestBreadcrumb />);

      expect(getByTestId("breadcrumb-list")).toHaveProp("accessible", false);
      expect(getByTestId("breadcrumb-list")).toHaveProp("role", "list");
      expect(getByTestId("breadcrumb-list")).toHaveProp(
        "accessibilityRole",
        "list",
      );
    });

    it("clones the list props to the first child when asChild is true", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList asChild>
            <View testID="breadcrumb-list-child" />
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-list-child")).toHaveProp(
        "accessible",
        false,
      );
      expect(getByTestId("breadcrumb-list-child")).toHaveProp("role", "list");
      expect(getByTestId("breadcrumb-list-child")).toHaveProp(
        "accessibilityRole",
        "list",
      );
    });

    it("allows custom props to be passed to the underlying view", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList testID="breadcrumb-list" aria-label="breadcrumb-list">
            <View testID="breadcrumb-list-child" />
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-list")).toHaveProp(
        "aria-label",
        "breadcrumb-list",
      );
    });

    it("allows custom baseClassName to be passed and merged", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList testID="breadcrumb-list" baseClassName="text-red-500">
            <View testID="breadcrumb-list-child" />
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-list").props.className).toContain(
        "text-red-500",
      );
    });
  });

  describe("BreadcrumbItem", () => {
    it("does not render when not wrapped in a BreadcrumbList", () => {
      expect(() =>
        render(
          <BreadcrumbItem>
            <View />
          </BreadcrumbItem>,
        ),
      ).toThrow("BreadcrumbItem must be used within a BreadcrumbList");
    });

    it("passes context to children", () => {
      function BreadcrumbItemChild() {
        const context = useContext(BreadcrumbItemContext);
        expect(context?.componentProps).toBeTruthy();
        expect(context?.linkProps).toBeTruthy();
        expect(context?.pageProps).toBeTruthy();

        return null;
      }

      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbItemChild />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
    });

    it("handles accessibility props", () => {
      const {getByTestId} = render(<TestBreadcrumb />);

      expect(getByTestId("breadcrumb-item-1")).toHaveProp("accessible", false);
      expect(getByTestId("breadcrumb-item-1")).toHaveProp("role", "listitem");
      expect(getByTestId("breadcrumb-item-1")).toHaveProp(
        "accessibilityRole",
        "listitem",
      );
    });

    it("clones the item props to the first child when asChild is true", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem asChild>
              <View testID="breadcrumb-item-child" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-item-child")).toHaveProp(
        "accessible",
        false,
      );
      expect(getByTestId("breadcrumb-item-child")).toHaveProp(
        "role",
        "listitem",
      );
      expect(getByTestId("breadcrumb-item-child")).toHaveProp(
        "accessibilityRole",
        "listitem",
      );
    });

    it("allows custom props to be passed to the underlying view", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem
              testID="breadcrumb-item"
              aria-label="breadcrumb-item"
            >
              <View testID="breadcrumb-item-child" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-item")).toHaveProp(
        "aria-label",
        "breadcrumb-item",
      );
    });

    it("allows custom baseClassName to be passed and merged", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem
              testID="breadcrumb-item"
              baseClassName="text-red-500"
            >
              <View testID="breadcrumb-item-child" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-item").props.className).toContain(
        "text-red-500",
      );
    });
  });

  describe("BreadcrumbLink", () => {
    it("does not render when not wrapped in a BreadcrumbItem", () => {
      expect(() => render(<BreadcrumbLink>Home</BreadcrumbLink>)).toThrow(
        "BreadcrumbLink must be used within a BreadcrumbItem",
      );
    });

    it("handles accessibility props", () => {
      const {getByTestId} = render(<TestBreadcrumb />);

      expect(getByTestId("breadcrumb-link-1")).toHaveProp("accessible", true);
      expect(getByTestId("breadcrumb-link-1")).toHaveProp(
        "accessibilityRole",
        "link",
      );
    });

    it("disables the link when the item is disabled", () => {
      const {getByTestId} = render(<TestBreadcrumb disabled />);
      expect(getByTestId("breadcrumb-link-1")).toHaveProp(
        "accessibilityState",
        {disabled: true},
      );
    });

    it("renders startContent and endContent", () => {
      const {getByTestId} = render(
        <TestBreadcrumb
          startContent={<View testID="start-content" />}
          endContent={<View testID="end-content" />}
        />,
      );

      expect(getByTestId("start-content")).toBeTruthy();
      expect(getByTestId("end-content")).toBeTruthy();
    });

    it("allows custom props to be passed to the underlying pressable", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                testID="breadcrumb-link-1"
                className="text-red-500"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-link-1").props.className).toContain(
        "text-red-500",
      );
    });

    it("allows custom baseClassName to be passed and merged", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                testID="breadcrumb-link-1"
                baseClassName="text-red-500"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-link-1").props.className).toContain(
        "text-red-500",
      );
    });
  });

  describe("BreadcrumbPage", () => {
    it("does not render when not wrapped in a BreadcrumbItem", () => {
      expect(() => render(<BreadcrumbPage>Page</BreadcrumbPage>)).toThrow(
        "BreadcrumbPage must be used within a BreadcrumbItem",
      );
    });

    it("handles accessibility props", () => {
      const {getByText} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage testID="breadcrumb-page">
                Breadcrumb
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByText("Breadcrumb")).toBeTruthy();
    });

    it("clones the page props to the first child when asChild is true", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage asChild>
                <View testID="breadcrumb-page-child">Page</View>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-page-child")).toBeTruthy();
    });

    it("allows custom props to be passed to the underlying text", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage testID="breadcrumb-page" className="text-red-500">
                Breadcrumb
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-page").props.className).toContain(
        "text-red-500",
      );
    });

    it("allows custom baseClassName to be passed and merged", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage
                testID="breadcrumb-page"
                baseClassName="text-red-500"
              >
                Breadcrumb
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-page").props.className).toContain(
        "text-red-500",
      );
    });

    it("applies correct styling based on size and color variants", () => {
      const {getByTestId} = render(
        <Breadcrumb size="lg" color="warning">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage testID="breadcrumb-page">
                Breadcrumb
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      const className = getByTestId("breadcrumb-page").props.className;
      expect(className).toContain("text-base"); // lg size
      expect(className).toContain("text-warning"); // warning color
    });
  });

  describe("BreadcrumbSeparator", () => {
    it("does not render when not wrapped in a BreadcrumbList", () => {
      expect(() => render(<BreadcrumbSeparator />)).toThrow(
        "BreadcrumbSeparator must be used within a BreadcrumbList",
      );
    });

    it("renders default chevron icon", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbSeparator testID="breadcrumb-separator" />
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-separator")).toBeTruthy();
    });

    it("renders custom children when provided", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbSeparator>
              <View testID="custom-separator">/</View>
            </BreadcrumbSeparator>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("custom-separator")).toBeTruthy();
    });

    it("clones the separator props to the first child when asChild is true", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbSeparator asChild>
              <View testID="breadcrumb-separator-child">/</View>
            </BreadcrumbSeparator>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-separator-child")).toBeTruthy();
    });

    it("allows custom props to be passed to the underlying view", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbSeparator
              testID="breadcrumb-separator"
              className="text-red-500"
            />
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-separator").props.className).toContain(
        "text-red-500",
      );
    });

    it("allows custom baseClassName to be passed and merged", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbSeparator
              testID="breadcrumb-separator"
              baseClassName="text-red-500"
            />
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-separator").props.className).toContain(
        "text-red-500",
      );
    });

    it("applies correct icon size based on breadcrumb size", () => {
      const {getByTestId} = render(
        <Breadcrumb size="lg">
          <BreadcrumbList>
            <BreadcrumbSeparator testID="breadcrumb-separator" />
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-separator")).toBeTruthy();
    });
  });

  describe("BreadcrumbEllipsis", () => {
    it("does not render when not wrapped in a BreadcrumbList", () => {
      expect(() => render(<BreadcrumbEllipsis />)).toThrow(
        "BreadcrumbEllipsis must be used within a BreadcrumbList",
      );
    });

    it("renders default more horizontal icon", () => {
      const {getByText} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbEllipsis testID="breadcrumb-ellipsis" />
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByText("More")).toBeTruthy();
    });

    it("renders custom children when provided", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbEllipsis>
              <View testID="custom-ellipsis">...</View>
            </BreadcrumbEllipsis>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("custom-ellipsis")).toBeTruthy();
    });

    it("clones the ellipsis props to the first child when asChild is true", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbEllipsis asChild>
              <View testID="breadcrumb-ellipsis-child">...</View>
            </BreadcrumbEllipsis>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-ellipsis-child")).toBeTruthy();
    });

    it("allows custom props to be passed to the underlying view", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbEllipsis
              testID="breadcrumb-ellipsis"
              className="text-red-500"
            />
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-ellipsis").props.className).toContain(
        "text-red-500",
      );
    });

    it("allows custom baseClassName to be passed and merged", () => {
      const {getByTestId} = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbEllipsis
              testID="breadcrumb-ellipsis"
              baseClassName="text-red-500"
            />
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-ellipsis").props.className).toContain(
        "text-red-500",
      );
    });

    it("applies correct icon size based on breadcrumb size", () => {
      const {getByTestId} = render(
        <Breadcrumb size="lg">
          <BreadcrumbList>
            <BreadcrumbEllipsis testID="breadcrumb-ellipsis" />
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(getByTestId("breadcrumb-ellipsis")).toBeTruthy();
    });
  });
});
