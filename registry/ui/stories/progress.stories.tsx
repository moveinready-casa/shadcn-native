import React from "react";
import {View, Text} from "react-native";
import {Meta, StoryObj} from "@storybook/react-native";
import {Progress, ProgressComponentProps} from "../progress";

function ProgressStory({...props}: ProgressComponentProps) {
  return (
    <View className="w-[300px]">
      <Progress {...props} />
    </View>
  );
}

const meta: Meta<typeof Progress> = {
  title: "Progress",
  component: ProgressStory,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    value: {
      control: {type: "number"},
      description:
        "Current value. If null, the progress is indeterminate and announced as busy.",
    },
    max: {
      control: {type: "number"},
      description:
        "Maximum value used to compute percentage (defaults to 100).",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Height preset for the track.",
      table: {
        defaultValue: {summary: "md"},
      },
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "destructive"],
      description: "Fill color.",
      table: {
        defaultValue: {summary: "primary"},
      },
    },
    baseClassName: {
      control: "text",
      description: "Custom classes for the track container.",
    },
    getValueLabel: {
      control: false,
      description:
        "Function to format the accessible text label: (value, max) => string.",
    },
    className: {
      control: "text",
      description: "Additional classes for the track container.",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

export const Size: Story = {
  render: () => (
    <View style={{gap: 12, width: 240}}>
      <Progress size="sm" value={50} />
      <Progress size="md" value={50} />
      <Progress size="lg" value={50} />
      <Progress size="xl" value={50} />
    </View>
  ),
};

export const Color: Story = {
  render: () => (
    <View style={{gap: 12, width: 240}}>
      <Progress color="primary" value={50} />
      <Progress color="warning" value={50} />
      <Progress color="destructive" value={50} />
      <Progress color="success" value={60} />
    </View>
  ),
};

export const Indeterminate: Story = {
  args: {
    value: null,
  },
};

export const WithMax: Story = {
  render: () => (
    <View style={{gap: 12, width: 240}}>
      <Text>value=50, max=200 (25%)</Text>
      <Progress value={50} max={200} />
    </View>
  ),
};

export const WithCustomLabel: Story = {
  args: {
    value: 33,
    max: 99,
    getValueLabel: (v, m) =>
      v == null || m == null ? "Loading" : `${v} of ${m}`,
  },
};

export const CustomClasses: Story = {
  args: {
    value: 70,
    baseClassName: "h-4",
  },
};
