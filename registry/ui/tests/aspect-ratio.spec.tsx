import {afterEach, describe, expect, it} from "@jest/globals";
import {cleanup, render} from "@testing-library/react-native";
import {AspectRatio} from "../aspect-ratio";
import {View, Text} from "react-native";

describe("AspectRatio", () => {
  afterEach(cleanup);

  const TestAspectRatio = ({ratio}: {ratio?: number}) => (
    <AspectRatio ratio={ratio} testID="ar">
      <View testID="inner">
        <Text>Content</Text>
      </View>
    </AspectRatio>
  );

  it("renders without crashing", () => {
    render(<TestAspectRatio />);
  });

  it("applies the correct aspect ratio style", () => {
    const ratio = 16 / 9;
    const {getByTestId} = render(<TestAspectRatio ratio={ratio} />);
    const wrapper = getByTestId("ar");

    const styles = Array.isArray(wrapper.props.style)
      ? wrapper.props.style
      : [wrapper.props.style];

    const hasAspectRatio = styles.some(
      (s: {aspectRatio: number}) => s && s.aspectRatio === ratio,
    );
    expect(hasAspectRatio).toBe(true);
  });
});
