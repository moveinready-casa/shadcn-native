import {afterEach, describe, expect, it} from "@jest/globals";
import {cleanup, render, fireEvent} from "@testing-library/react-native";
import {Avatar, AvatarImage, AvatarFallback} from "../avatar";

describe("Avatar", () => {
  afterEach(cleanup);
  const src = "https://picsum.photos/100";

  const TestAvatar = ({source = src}: {source?: string | null}) => (
    <Avatar testID="avatar">
      {source ? (
        <AvatarImage testID="avatar-image" source={{uri: source}} />
      ) : null}
      <AvatarFallback testID="avatar-fallback">AB</AvatarFallback>
    </Avatar>
  );

  it("renders without crashing", () => {
    render(<TestAvatar />);
  });

  it("shows the image when provided and displays fallback on error", () => {
    const {getByTestId} = render(<TestAvatar />);
    const image = getByTestId("avatar-image");
    expect(image).toBeTruthy();

    fireEvent(image, "onError");

    const fallback = getByTestId("avatar-fallback");
    expect(fallback).toBeTruthy();
  });

  it("shows the fallback when no image source is provided", () => {
    const {getByTestId} = render(<TestAvatar source={null} />);
    expect(getByTestId("avatar-fallback")).toBeTruthy();
  });

  it("applies custom base class names to the root component", () => {
    const {getByTestId} = render(
      <Avatar baseClassName="rounded-lg" testID="avatar">
        <AvatarImage testID="avatar-image" source={{uri: src}} />
        <AvatarFallback testID="avatar-fallback">AB</AvatarFallback>
      </Avatar>,
    );

    expect(getByTestId("avatar").props.className).toContain("rounded-lg");
  });

  it("applies custom base class names to the image component", () => {
    const {getByTestId} = render(
      <AvatarImage
        baseClassName="bg-red-500"
        testID="avatar-image"
        source={{uri: src}}
      />,
    );

    expect(getByTestId("avatar-image").props.className).toContain("bg-red-500");
  });

  it("applies custom base class names to the fallback component", () => {
    const {getByTestId} = render(
      <AvatarFallback baseClassName="bg-blue-500" testID="avatar-fallback">
        Testing
      </AvatarFallback>,
    );

    expect(getByTestId("avatar-fallback").props.className).toContain(
      "bg-blue-500",
    );
  });
});
