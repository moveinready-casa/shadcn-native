import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, render, fireEvent} from "@testing-library/react-native";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarComponentProps,
} from "../avatar";
import {Text} from "react-native";

describe("Avatar", () => {
  afterEach(cleanup);

  const TestAvatar = ({
    size,
    borderRadius,
    isBordered,
    isDisabled,
    variant = "shadcn",
    baseClassName,
    includeImage = true,
    includeFallback = true,
  }: Partial<AvatarComponentProps> & {
    includeImage?: boolean;
    includeFallback?: boolean;
  }) => (
    <Avatar
      size={size}
      borderRadius={borderRadius}
      isBordered={isBordered}
      isDisabled={isDisabled}
      variant={variant}
      baseClassName={baseClassName}
      testID="avatar"
    >
      {includeImage && (
        <AvatarImage
          testID="avatar-image"
          source={{uri: "https://example.com/avatar.png"}}
        />
      )}
      {includeFallback && (
        <AvatarFallback testID="avatar-fallback">
          <Text>AB</Text>
        </AvatarFallback>
      )}
    </Avatar>
  );

  describe("Structure and rendering", () => {
    it("renders without crashing", () => {
      render(<TestAvatar />);
    });

    it("renders with image and fallback", () => {
      const {getByTestId, queryByTestId} = render(<TestAvatar />);
      expect(getByTestId("avatar")).toBeTruthy();
      expect(getByTestId("avatar-image")).toBeTruthy();
      expect(queryByTestId("avatar-fallback")).toBeFalsy();
    });

    it("renders with fallback only when no image", () => {
      const {getByTestId, queryByTestId} = render(
        <TestAvatar includeImage={false} />,
      );
      expect(getByTestId("avatar")).toBeTruthy();
      expect(queryByTestId("avatar-image")).toBeFalsy();
      expect(queryByTestId("avatar-fallback")).toBeFalsy();
    });

    it("renders with image only when no fallback", () => {
      const {getByTestId, queryByTestId} = render(
        <TestAvatar includeFallback={false} />,
      );
      expect(getByTestId("avatar")).toBeTruthy();
      expect(getByTestId("avatar-image")).toBeTruthy();
      expect(queryByTestId("avatar-fallback")).toBeFalsy();
    });
  });

  describe("Size variants", () => {
    it.each([
      ["sm", "w-8", "h-8"],
      ["md", "w-10", "h-10"],
      ["lg", "w-12", "h-12"],
      ["xl", "w-16", "h-16"],
    ] as const)(
      "applies %s size correctly",
      (size, widthClass, heightClass) => {
        const {getByTestId} = render(<TestAvatar size={size} />);
        const avatar = getByTestId("avatar");
        expect(avatar.props.className).toContain(widthClass);
        expect(avatar.props.className).toContain(heightClass);
      },
    );
  });

  describe("BorderRadius variants", () => {
    it.each([
      ["none", "rounded-none"],
      ["sm", "rounded-sm"],
      ["md", "rounded-md"],
      ["lg", "rounded-lg"],
      ["xl", "rounded-xl"],
      ["full", "rounded-full"],
    ] as const)(
      "applies %s borderRadius correctly",
      (borderRadius, expectedClass) => {
        const {getByTestId} = render(
          <TestAvatar borderRadius={borderRadius} />,
        );
        const avatar = getByTestId("avatar");
        expect(avatar.props.className).toContain(expectedClass);
      },
    );
  });

  describe("Border and disabled states", () => {
    it("applies bordered style correctly", () => {
      const {getByTestId} = render(<TestAvatar isBordered={true} />);
      const avatar = getByTestId("avatar");
      expect(avatar.props.className).toContain("border-2");
      expect(avatar.props.className).toContain("border-border");
    });

    it("applies disabled state correctly", () => {
      const {getByTestId} = render(<TestAvatar isDisabled={true} />);
      const avatar = getByTestId("avatar");
      expect(avatar.props.className).toContain("opacity-50");
      expect(avatar.props.accessibilityState).toEqual({disabled: true});
    });
  });

  describe("Variant styling", () => {
    it.each([
      ["shadcn", "bg-muted"],
      ["warning", "bg-warning"],
      ["error", "bg-destructive"],
      ["success", "bg-success"],
    ] as const)("applies %s variant correctly", (variant, expectedClass) => {
      const {getByTestId} = render(<TestAvatar variant={variant} />);
      const avatar = getByTestId("avatar");
      expect(avatar.props.className).toContain(expectedClass);
    });
  });

  describe("Custom styling", () => {
    it("applies custom baseClassName", () => {
      const {getByTestId} = render(
        <TestAvatar baseClassName="custom-avatar-class" />,
      );
      const avatar = getByTestId("avatar");
      expect(avatar.props.className).toContain("custom-avatar-class");
    });
  });

  describe("Image loading behavior", () => {
    it("handles image load events", () => {
      const onLoad = jest.fn();
      const {getByTestId} = render(
        <Avatar testID="avatar" variant="shadcn">
          <AvatarImage
            testID="avatar-image"
            source={{uri: "https://example.com/avatar.png"}}
            onLoad={onLoad}
          />
          <AvatarFallback testID="avatar-fallback">
            <Text>AB</Text>
          </AvatarFallback>
        </Avatar>,
      );

      const image = getByTestId("avatar-image");
      fireEvent(image, "onLoad");

      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    it("handles image error events", () => {
      const onError = jest.fn();
      const {getByTestId} = render(
        <Avatar testID="avatar" variant="shadcn">
          <AvatarImage
            testID="avatar-image"
            source={{uri: "https://example.com/avatar.png"}}
            onError={onError}
          />
          <AvatarFallback testID="avatar-fallback">
            <Text>AB</Text>
          </AvatarFallback>
        </Avatar>,
      );

      const image = getByTestId("avatar-image");
      fireEvent(image, "onError");

      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  describe("Fallback behavior", () => {
    it("shows fallback when image fails to load", () => {
      const {getByTestId} = render(
        <Avatar testID="avatar" variant="shadcn">
          <AvatarImage
            testID="avatar-image"
            source={{uri: "https://example.com/avatar.png"}}
          />
          <AvatarFallback testID="avatar-fallback">
            <Text>AB</Text>
          </AvatarFallback>
        </Avatar>,
      );

      const image = getByTestId("avatar-image");
      fireEvent(image, "onError");

      const fallback = getByTestId("avatar-fallback");
      expect(fallback).toBeTruthy();
    });

    it("hides fallback when image loads successfully", () => {
      const {getByTestId, queryByTestId} = render(
        <Avatar testID="avatar" variant="shadcn">
          <AvatarImage
            testID="avatar-image"
            source={{uri: "https://example.com/avatar.png"}}
          />
          <AvatarFallback testID="avatar-fallback">
            <Text>AB</Text>
          </AvatarFallback>
        </Avatar>,
      );

      const image = getByTestId("avatar-image");
      fireEvent(image, "onLoad");

      expect(queryByTestId("avatar-fallback")).toBeFalsy();
    });
  });

  describe("Error handling", () => {
    it("throws error when AvatarImage is used outside of Avatar", () => {
      expect(() => {
        render(<AvatarImage source={{uri: "test"}} />);
      }).toThrow("AvatarImage must be used within an Avatar");
    });

    it("throws error when AvatarFallback is used outside of Avatar", () => {
      expect(() => {
        render(<AvatarFallback>AB</AvatarFallback>);
      }).toThrow("AvatarFallback must be used within an Avatar");
    });
  });
});
