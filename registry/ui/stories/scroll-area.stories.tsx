import React from "react";
import {Meta, StoryObj} from "@storybook/react-native";
import {ScrollView, Text, View} from "react-native";
import {ScrollArea, ScrollAreaComponentProps} from "../scroll-area";

function ContentList() {
  return (
    <View style={{gap: 8, padding: 8}}>
      {Array.from({length: 30}).map((_, index) => (
        <View key={index} className="bg-secondary/40 rounded-md p-2">
          <Text className="text-card-foreground">Item {index + 1}</Text>
        </View>
      ))}
    </View>
  );
}

function ScrollAreaStory({
  asChild,
  borderRadius,
  baseClassName,
  disabled,
  loading,
  ...props
}: ScrollAreaComponentProps) {
  return (
    <ScrollArea
      asChild={asChild}
      borderRadius={borderRadius}
      baseClassName={baseClassName}
      disabled={disabled}
      loading={loading}
      {...props}
    >
      <ContentList />
    </ScrollArea>
  );
}

const meta: Meta<typeof ScrollAreaStory> = {
  title: "Components/ScrollArea",
  component: ScrollAreaStory,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    borderRadius: {
      control: "select",
      description:
        "Sets the border radius of the scroll area. Controls the roundness of corners.",
      table: {
        defaultValue: {
          summary: "md",
        },
      },
      options: ["none", "sm", "md", "lg", "xl"],
    },
    asChild: {
      control: "boolean",
      description:
        "If true, clones props to the nearest child instead of rendering an internal ScrollView.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the scroll area is disabled.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    loading: {
      control: "boolean",
      description: "Whether the scroll area is in a loading state.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    baseClassName: {
      control: "text",
      description: "Tailwind classes applied to the base ScrollView.",
    },
    className: {
      control: "text",
      description: "Additional Tailwind classes merged into the component.",
    },
  },
  args: {
    borderRadius: "md",
    disabled: false,
    loading: false,
    baseClassName: "h-48 w-72",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BorderRadius: Story = {
  render: (args) => (
    <View style={{gap: 12}}>
      <ScrollAreaStory {...args} borderRadius="none" />
      <ScrollAreaStory {...args} borderRadius="sm" />
      <ScrollAreaStory {...args} borderRadius="md" />
      <ScrollAreaStory {...args} borderRadius="lg" />
      <ScrollAreaStory {...args} borderRadius="xl" />
    </View>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const AsChild: Story = {
  render: () => (
    <ScrollArea asChild baseClassName="h-48 w-72">
      <ScrollView>
        <ContentList />
      </ScrollView>
    </ScrollArea>
  ),
};
