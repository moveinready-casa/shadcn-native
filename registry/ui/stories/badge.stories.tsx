import React from "react";
import {Text, View} from "react-native";
import {Badge} from "../badge";
import {Meta, StoryObj} from "@storybook/react-native";
import {Loader2} from "lucide-react-native";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      description:
        "The visual variant of the badge. Controls the color scheme and styling.",
      table: {
        defaultValue: {
          summary: "default",
        },
      },
      options: ["default", "secondary", "destructive", "outline"],
    },
    size: {
      control: "select",
      description:
        "Sets the size of the badge. Controls padding, text size, and icon size.",
      table: {
        defaultValue: {
          summary: "md",
        },
      },
      options: ["sm", "md", "lg", "xl"],
    },
    borderRadius: {
      control: "select",
      description:
        "Sets the border radius of the badge. Mirrors the Avatar component radius options.",
      table: {
        defaultValue: {
          summary: "lg",
        },
      },
      options: ["none", "sm", "md", "lg", "xl"],
    },
    disabled: {
      control: "boolean",
      description:
        "Whether the badge is disabled. Applies reduced opacity and sets accessibility state.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    status: {
      control: "select",
      description:
        "Sets the status of the badge which controls the default indicator. Used for loading, error, or idle states.",
      table: {
        defaultValue: {
          summary: "idle",
        },
      },
      options: ["idle", "loading", "error"],
    },
    indicator: {
      control: false,
      description:
        "Custom indicator renderer function: (state: BadgeStatus) => React.ReactNode. Overrides default indicators.",
    },
    baseClassName: {
      control: "text",
      description:
        "Custom tailwind classes to apply to the badge. Takes precedence over the className prop.",
    },
    asChild: {
      control: "boolean",
      description:
        "If true, clones props to the nearest child instead of rendering a View. Useful for custom badge elements.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    children: {
      control: "text",
      description: "The content to display inside the badge.",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Sizes: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
      <Badge size="xl">Extra Large</Badge>
    </View>
  ),
};

export const BorderRadius: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <Badge borderRadius="none">None</Badge>
      <Badge borderRadius="sm">Small</Badge>
      <Badge borderRadius="md">Medium</Badge>
      <Badge borderRadius="lg">Large</Badge>
      <Badge borderRadius="xl">Extra Large</Badge>
    </View>
  ),
};

export const StatusIndicators: Story = {
  args: {
    status: "loading",
  },
};

export const CustomIndicator: Story = {
  args: {
    status: "loading",
    indicator: () => <Loader2 className="mr-1 h-3 w-3 animate-spin" />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled Badge",
  },
};

export const AsChild: Story = {
  render: () => (
    <Badge asChild variant="destructive">
      <Text className="text-lg font-bold">Custom Badge</Text>
    </Badge>
  ),
};
