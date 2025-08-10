import React from "react";
import {afterEach, describe, expect, it} from "@jest/globals";
import {cleanup, render} from "@testing-library/react-native";
import {Text, View} from "react-native";
import {Label} from "../label";

describe("Label - asChild", () => {
  afterEach(cleanup);

  it("clones props to child when asChild is true", () => {
    const {getByTestId} = render(
      <Label asChild>
        <View testID="label-child">
          <Text>Username</Text>
        </View>
      </Label>,
    );

    const child = getByTestId("label-child");
    expect(child).toBeTruthy();
    expect(child.props.className).toContain("text-sm");
  });
});
