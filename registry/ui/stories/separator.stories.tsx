import React from "react";
import {View, Text} from "react-native";
import {Meta, StoryObj} from "@storybook/react-native";
import {Separator, SeparatorComponentProps} from "../separator";

function SeparatorStory({...props}: SeparatorComponentProps) {
  return (
    <View className="gap-4">
      <View>
        <Text className="text-sm leading-none font-medium">Shadcn Native</Text>
        <Text className="text-muted-foreground text-sm">
          An open-source UI component library for React Native.
        </Text>
      </View>
      <Separator {...props} className={props.className} />
      <View className="flex-row items-center gap-4">
        <Text>Blog</Text>
        <Separator orientation="vertical" />
        <Text>Docs</Text>
        <Separator orientation="vertical" />
        <Text>Source</Text>
      </View>
    </View>
  );
}

const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: SeparatorStory,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Separator orientation.",
      table: {defaultValue: {summary: "horizontal"}},
    },
    decorative: {
      control: "boolean",
      description:
        "If true, hides the separator from assistive technologies (default).",
      table: {defaultValue: {summary: "true"}},
    },
    asChild: {
      control: "boolean",
      description: "Clone the first child and apply props to it.",
    },
    baseClassName: {
      control: "text",
      description: "Custom classes applied to the base separator.",
    },
    className: {
      control: "text",
      description: "Additional classes to merge with defaults.",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    orientation: "horizontal",
    decorative: true,
  },
};

export const Vertical: Story = {
  render: () => (
    <View className="h-[300px] flex-row items-center gap-4">
      <Text>One</Text>
      <Separator orientation="vertical" />
      <Text>Two</Text>
      <Separator orientation="vertical" />
      <Text>Three</Text>
    </View>
  ),
};

export const DecorativeFalse: Story = {
  args: {
    decorative: false,
  },
};

export const CustomClasses: Story = {
  args: {
    baseClassName: "bg-primary opacity-50",
  },
};
