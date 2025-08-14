import React from "react";
import {View} from "react-native";
import {Meta, StoryObj} from "@storybook/react-native";
import {Skeleton, SkeletonProps} from "../skeleton";

function SkeletonStory(props: SkeletonProps) {
  return (
    <View className="flex-row items-center space-x-4">
      <Skeleton borderRadius="full" baseClassName="w-12 h-12" />
      <View className="space-y-2">
        <Skeleton {...props} baseClassName="h-4 w-[250px]" />
        <Skeleton {...props} baseClassName="h-4 w-[200px]" />
      </View>
    </View>
  );
}

const meta: Meta<typeof SkeletonStory> = {
  title: "Skeleton",
  component: SkeletonStory,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    borderRadius: {
      control: "select",
      description:
        "Sets the border radius of the skeleton. Controls the roundness of corners.",
      table: {
        defaultValue: {
          summary: "md",
        },
      },
      options: ["none", "sm", "md", "lg", "xl", "full"],
    },
    className: {
      control: "text",
      description:
        "Additional classes for sizing and layout (e.g. h-4 w-[100px]).",
    },
    baseClassName: {
      control: "text",
      description:
        "Base classes applied to the skeleton. If provided, it takes precedence over className.",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

