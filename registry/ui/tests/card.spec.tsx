import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardActionProps,
  CardContentProps,
  CardFooterProps,
} from "../card.tsx";
import {Text, View} from "react-native";

describe("Card", () => {
  afterEach(cleanup);

  const TestCard = ({
    cardProps,
    headerProps,
    titleProps,
    descriptionProps,
    actionProps,
    contentProps,
    footerProps,
  }: {
    cardProps?: Omit<Partial<CardProps>, "children">;
    headerProps?: Omit<Partial<CardHeaderProps>, "children">;
    titleProps?: Omit<Partial<CardTitleProps>, "children">;
    descriptionProps?: Omit<Partial<CardDescriptionProps>, "children">;
    actionProps?: Omit<Partial<CardActionProps>, "children">;
    contentProps?: Omit<Partial<CardContentProps>, "children">;
    footerProps?: Omit<Partial<CardFooterProps>, "children">;
  }) => {
    return (
      <Card testID="card" {...cardProps}>
        <CardHeader testID="card-header" {...headerProps}>
          <CardTitle testID="card-title" {...titleProps}>
            <Text>Card Title</Text>
          </CardTitle>
          <CardDescription testID="card-description" {...descriptionProps}>
            <Text>Card description text</Text>
          </CardDescription>
        </CardHeader>
        <CardContent testID="card-content" {...contentProps}>
          <Text>Card content goes here</Text>
        </CardContent>
        <CardAction testID="card-action" {...actionProps}>
          <Text>Action buttons</Text>
        </CardAction>
        <CardFooter testID="card-footer" {...footerProps}>
          <Text>Footer content</Text>
        </CardFooter>
      </Card>
    );
  };

  describe("Structure and rendering", () => {
    it("renders the card without errors", () => {
      render(<TestCard />);
    });

    it("renders all card sub-components", () => {
      const {getByTestId} = render(<TestCard />);

      expect(getByTestId("card")).toBeTruthy();
      expect(getByTestId("card-header")).toBeTruthy();
      expect(getByTestId("card-title")).toBeTruthy();
      expect(getByTestId("card-description")).toBeTruthy();
      expect(getByTestId("card-content")).toBeTruthy();
      expect(getByTestId("card-action")).toBeTruthy();
      expect(getByTestId("card-footer")).toBeTruthy();
    });

    it("renders minimal card with just content", () => {
      const {getByTestId} = render(
        <Card testID="minimal-card">
          <CardContent testID="minimal-content">
            <Text>Just content</Text>
          </CardContent>
        </Card>,
      );

      expect(getByTestId("minimal-card")).toBeTruthy();
      expect(getByTestId("minimal-content")).toBeTruthy();
    });
  });

  describe("Variants", () => {
    it("applies default variant correctly", () => {
      const {getByTestId} = render(
        <TestCard cardProps={{variant: "shadcn"}} />,
      );
      const card = getByTestId("card");
      expect(card.props.className).toContain("bg-card");
      expect(card.props.className).toContain("border-border");
    });

    it("applies outline variant correctly", () => {
      const {getByTestId} = render(
        <TestCard cardProps={{variant: "outline"}} />,
      );
      const card = getByTestId("card");
      expect(card.props.className).toContain("bg-transparent");
      expect(card.props.className).toContain("border-border");
    });

    it("applies ghost variant correctly", () => {
      const {getByTestId} = render(<TestCard cardProps={{variant: "ghost"}} />);
      const card = getByTestId("card");
      expect(card.props.className).toContain("bg-transparent");
      expect(card.props.className).toContain("border-transparent");
      expect(card.props.className).toContain("shadow-none");
    });
  });

  describe("Radius prop", () => {
    it("applies default radius (xl) correctly", () => {
      const {getByTestId} = render(<TestCard />);
      const card = getByTestId("card");
      expect(card.props.className).toContain("rounded-xl");
    });

    it("applies none radius correctly", () => {
      const {getByTestId} = render(<TestCard cardProps={{radius: "none"}} />);
      const card = getByTestId("card");
      expect(card.props.className).toContain("rounded-none");
    });

    it("applies sm radius correctly", () => {
      const {getByTestId} = render(<TestCard cardProps={{radius: "sm"}} />);
      const card = getByTestId("card");
      expect(card.props.className).toContain("rounded-sm");
    });

    it("applies md radius correctly", () => {
      const {getByTestId} = render(<TestCard cardProps={{radius: "md"}} />);
      const card = getByTestId("card");
      expect(card.props.className).toContain("rounded-md");
    });

    it("applies lg radius correctly", () => {
      const {getByTestId} = render(<TestCard cardProps={{radius: "lg"}} />);
      const card = getByTestId("card");
      expect(card.props.className).toContain("rounded-lg");
    });

    it("applies xl radius correctly", () => {
      const {getByTestId} = render(<TestCard cardProps={{radius: "xl"}} />);
      const card = getByTestId("card");
      expect(card.props.className).toContain("rounded-xl");
    });
  });

  describe("Blurred prop", () => {
    it("applies blur effect to Card when blurred is true", () => {
      const {getByTestId} = render(<TestCard cardProps={{blurred: true}} />);
      const card = getByTestId("card");
      expect(card.props.className).toContain("blur");
    });

    it("applies blur effect to CardHeader when blurred is true", () => {
      const {getByTestId} = render(<TestCard headerProps={{blurred: true}} />);
      const header = getByTestId("card-header");
      expect(header.props.className).toContain("blur");
    });

    it("applies blur effect to CardTitle when blurred is true", () => {
      const {getByTestId} = render(<TestCard titleProps={{blurred: true}} />);
      const title = getByTestId("card-title");
      expect(title.props.className).toContain("blur");
    });

    it("applies blur effect to CardDescription when blurred is true", () => {
      const {getByTestId} = render(
        <TestCard descriptionProps={{blurred: true}} />,
      );
      const description = getByTestId("card-description");
      expect(description.props.className).toContain("blur");
    });

    it("applies blur effect to CardContent when blurred is true", () => {
      const {getByTestId} = render(<TestCard contentProps={{blurred: true}} />);
      const content = getByTestId("card-content");
      expect(content.props.className).toContain("blur");
    });

    it("applies blur effect to CardAction when blurred is true", () => {
      const {getByTestId} = render(<TestCard actionProps={{blurred: true}} />);
      const action = getByTestId("card-action");
      expect(action.props.className).toContain("blur");
    });

    it("applies blur effect to CardFooter when blurred is true", () => {
      const {getByTestId} = render(<TestCard footerProps={{blurred: true}} />);
      const footer = getByTestId("card-footer");
      expect(footer.props.className).toContain("blur");
    });

    it("does not apply blur effect when blurred is false", () => {
      const {getByTestId} = render(<TestCard cardProps={{blurred: false}} />);
      const card = getByTestId("card");
      expect(card.props.className).not.toContain("blur");
    });
  });

  describe("Pressable behavior", () => {
    it("makes card pressable when pressable is true", () => {
      const onPress = jest.fn();
      const {getByTestId} = render(
        <TestCard cardProps={{pressable: true, onPress}} />,
      );
      const card = getByTestId("card");

      expect(card.props.accessibilityRole).toBe("button");
      expect(card.props.accessible).toBe(true);

      fireEvent.press(card);
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("calls onPressStart when press interaction starts", () => {
      const onPressStart = jest.fn();
      const {getByTestId} = render(
        <TestCard cardProps={{pressable: true, onPressStart}} />,
      );
      const card = getByTestId("card");

      fireEvent(card, "pressIn");
      expect(onPressStart).toHaveBeenCalledTimes(1);
    });

    it("calls onPressEnd when press interaction ends", () => {
      const onPressEnd = jest.fn();
      const {getByTestId} = render(
        <TestCard cardProps={{pressable: true, onPressEnd}} />,
      );
      const card = getByTestId("card");

      fireEvent(card, "pressOut");
      expect(onPressEnd).toHaveBeenCalledTimes(1);
    });

    it("applies pressed state styling when card is pressed", () => {
      const {getByTestId} = render(<TestCard cardProps={{pressable: true}} />);
      const card = getByTestId("card");

      fireEvent(card, "pressIn");
      expect(card.props.className).toContain("opacity-90");

      fireEvent(card, "pressOut");
      expect(card.props.className).not.toContain("opacity-90");
    });

    it("applies disabled styling when disabled", () => {
      const {getByTestId} = render(
        <TestCard cardProps={{pressable: true, disabled: true}} />,
      );
      const card = getByTestId("card");
      expect(card.props.className).toContain("opacity-50");
    });
  });

  describe("AsChild behavior", () => {
    it("clones props to child when Card asChild is true", () => {
      const {getByTestId} = render(
        <Card asChild variant="outline" className="custom-class">
          <View testID="child">
            <Text>Custom Card</Text>
          </View>
        </Card>,
      );

      const child = getByTestId("child");
      expect(child.props.className).toContain("bg-transparent");
      expect(child.props.className).toContain("custom-class");
      expect(child.props.accessibilityRole).toBe("group");
    });

    it("clones props to child when CardHeader asChild is true", () => {
      const {getByTestId} = render(
        <Card>
          <CardHeader asChild className="custom-header">
            <View testID="header-child">
              <Text>Custom Header</Text>
            </View>
          </CardHeader>
        </Card>,
      );

      const child = getByTestId("header-child");
      expect(child.props.className).toContain("custom-header");
      expect(child.props.className).toContain("p-6");
    });

    it("clones props to child when CardTitle asChild is true", () => {
      const {getByTestId} = render(
        <Card>
          <CardHeader>
            <CardTitle asChild className="custom-title">
              <Text testID="title-child">Custom Title</Text>
            </CardTitle>
          </CardHeader>
        </Card>,
      );

      const child = getByTestId("title-child");
      expect(child.props.className).toContain("custom-title");
      expect(child.props.className).toContain("font-semibold");
      expect(child.props.accessibilityRole).toBe("header");
    });

    it("clones props to child when CardContent asChild is true", () => {
      const {getByTestId} = render(
        <Card>
          <CardContent asChild className="custom-content">
            <View testID="content-child">
              <Text>Custom Content</Text>
            </View>
          </CardContent>
        </Card>,
      );

      const child = getByTestId("content-child");
      expect(child.props.className).toContain("custom-content");
      expect(child.props.className).toContain("p-6");
    });
  });

  describe("Custom className", () => {
    it("applies custom className to Card", () => {
      const {getByTestId} = render(
        <TestCard cardProps={{className: "custom-card-class"}} />,
      );
      const card = getByTestId("card");
      expect(card.props.className).toContain("custom-card-class");
    });

    it("merges custom className with default styles", () => {
      const {getByTestId} = render(
        <TestCard cardProps={{className: "bg-red-500"}} />,
      );
      const card = getByTestId("card");
      expect(card.props.className).toContain("bg-red-500");
      expect(card.props.className).toContain("rounded-xl");
      expect(card.props.className).toContain("shadow");
    });
  });

  describe("Accessibility", () => {
    it("has proper accessibility role for non-pressable card", () => {
      const {getByTestId} = render(<TestCard />);
      const card = getByTestId("card");
      expect(card.props.accessibilityRole).toBe("group");
      expect(card.props.accessible).toBe(true);
    });

    it("has proper accessibility role for pressable card", () => {
      const {getByTestId} = render(<TestCard cardProps={{pressable: true}} />);
      const card = getByTestId("card");
      expect(card.props.accessibilityRole).toBe("button");
      expect(card.props.accessible).toBe(true);
    });

    it("sets accessibility state for disabled pressable card", () => {
      const {getByTestId} = render(
        <TestCard cardProps={{pressable: true, disabled: true}} />,
      );
      const card = getByTestId("card");
      expect(card.props.accessibilityState).toEqual({disabled: true});
    });

    it("has header accessibility role for CardTitle", () => {
      const {getByTestId} = render(<TestCard />);
      const title = getByTestId("card-title");
      expect(title.props.accessibilityRole).toBe("header");
    });
  });

  describe("Edge cases", () => {
    it("handles empty card gracefully", () => {
      const {getByTestId} = render(<Card testID="empty-card">{null}</Card>);
      expect(getByTestId("empty-card")).toBeTruthy();
    });

    it("handles card with only one sub-component", () => {
      const {getByTestId} = render(
        <Card testID="single-content-card">
          <CardContent testID="only-content">
            <Text>Only content</Text>
          </CardContent>
        </Card>,
      );
      expect(getByTestId("single-content-card")).toBeTruthy();
      expect(getByTestId("only-content")).toBeTruthy();
    });

    it("handles nested cards", () => {
      const {getByTestId} = render(
        <Card testID="outer-card">
          <CardContent>
            <Card testID="inner-card">
              <CardContent testID="inner-content">
                <Text>Nested card</Text>
              </CardContent>
            </Card>
          </CardContent>
        </Card>,
      );
      expect(getByTestId("outer-card")).toBeTruthy();
      expect(getByTestId("inner-card")).toBeTruthy();
      expect(getByTestId("inner-content")).toBeTruthy();
    });

    it("handles both blurred and pressable props together", () => {
      const onPress = jest.fn();
      const {getByTestId} = render(
        <TestCard cardProps={{blurred: true, pressable: true, onPress}} />,
      );
      const card = getByTestId("card");

      expect(card.props.className).toContain("blur");
      expect(card.props.accessibilityRole).toBe("button");

      fireEvent.press(card);
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("handles complex combinations of props", () => {
      const {getByTestId} = render(
        <TestCard
          cardProps={{
            variant: "outline",
            radius: "lg",
            blurred: true,
            pressable: true,
            disabled: true,
            className: "custom-class",
          }}
        />,
      );
      const card = getByTestId("card");

      expect(card.props.className).toContain("bg-transparent");
      expect(card.props.className).toContain("rounded-lg");
      expect(card.props.className).toContain("blur");
      expect(card.props.className).toContain("opacity-50");
      expect(card.props.className).toContain("custom-class");
      expect(card.props.accessibilityRole).toBe("button");
      expect(card.props.accessibilityState).toEqual({disabled: true});
    });
  });
});
