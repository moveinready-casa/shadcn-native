import React from "react";
import {View} from "react-native";
import {Meta, StoryObj} from "@storybook/react-native";
import {Spinner} from "../spinner";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    color: {
      control: "select",
      description:
        "The visual color of the spinner. Controls the color scheme.",
      table: {
        defaultValue: {
          summary: "default",
        },
      },
      options: ["default", "secondary", "destructive", "warning"],
    },
    size: {
      control: "select",
      description:
        "Sets the size of the spinner. Controls the icon dimensions.",
      table: {
        defaultValue: {
          summary: "md",
        },
      },
      options: ["sm", "md", "lg", "xl"],
    },
    baseClassName: {
      control: "text",
      description:
        "Base classes applied to the spinner. If provided, it takes precedence over className.",
    },
    className: {
      control: "text",
      description: "Additional Tailwind classes for further customization.",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Sizes: Story = {
  render: () => (
    <View style={{gap: 16, flexDirection: "row", alignItems: "center"}}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </View>
  ),
};

export const Colors: Story = {
  render: () => (
    <View style={{gap: 16, flexDirection: "row", alignItems: "center"}}>
      <Spinner color="default" />
      <Spinner color="secondary" />
      <Spinner color="destructive" />
      <Spinner color="warning" />
    </View>
  ),
};

export const SizesAndColors: Story = {
  render: () => (
    <View style={{gap: 16}}>
      <View style={{gap: 12, flexDirection: "row", alignItems: "center"}}>
        <Spinner size="sm" color="secondary" />
        <Spinner size="md" color="secondary" />
        <Spinner size="lg" color="secondary" />
        <Spinner size="xl" color="secondary" />
      </View>
      <View style={{gap: 12, flexDirection: "row", alignItems: "center"}}>
        <Spinner size="sm" color="destructive" />
        <Spinner size="md" color="destructive" />
        <Spinner size="lg" color="destructive" />
        <Spinner size="xl" color="destructive" />
      </View>
    </View>
  ),
};

export const WithBaseClassName: Story = {
  args: {
    baseClassName: "size-10",
    color: "destructive",
  },
};
