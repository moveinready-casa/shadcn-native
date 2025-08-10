import React from "react";
import {Text} from "react-native";
import {Meta, StoryObj} from "@storybook/react-native";
import {Label} from "../label";

const meta: Meta<typeof Label> = {
  title: "Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    asChild: {
      control: "boolean",
      description:
        "If true clones the child and passes all accessibility and functionality props to it.",
      table: {defaultValue: {summary: "false"}},
    },
    className: {
      control: "text",
      description: "Additional Tailwind classes to merge into the label.",
    },
    children: {
      control: "text",
      description: "Text content of the label.",
      table: {defaultValue: {summary: "Label"}},
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Username",
  },
};

export const WithCustomClass: Story = {
  args: {
    children: "Muted label",
    className: "text-muted-foreground",
  },
};

export const AsChild: Story = {
  render: () => (
    <Label asChild>
      <Text>Username</Text>
    </Label>
  ),
};
