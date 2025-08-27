import React from "react";
import {Text, View} from "react-native";
import {Toggle} from "../toggle";
import {Meta, StoryObj} from "@storybook/react-native";
import {ItalicIcon} from "lucide-react-native";

const meta: Meta<typeof Toggle> = {
  title: "Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      description:
        "The visual variant of the toggle. Controls the styling approach.",
      table: {
        defaultValue: {
          summary: "default",
        },
      },
      options: ["default", "outline"],
    },
    size: {
      control: "select",
      description:
        "Sets the size of the toggle. Controls height, padding, and text size.",
      table: {
        defaultValue: {
          summary: "md",
        },
      },
      options: ["sm", "md", "lg", "xl"],
    },
    pressed: {
      control: "boolean",
      description:
        "Controlled pressed state. When provided, the toggle becomes controlled.",
      table: {
        defaultValue: {
          summary: "undefined",
        },
      },
    },
    defaultPressed: {
      control: "boolean",
      description:
        "Uncontrolled initial pressed state. Used when pressed is not provided.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    disabled: {
      control: "boolean",
      description:
        "Whether the toggle is disabled. Reduces opacity and prevents interaction.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    asChild: {
      description:
        "If true, clones props to the nearest child instead of rendering a Pressable. Useful for custom toggle elements.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the toggle.",
    },
    onPressedChange: {
      control: false,
      description: "Callback function called when the pressed state changes.",
    },
    onPress: {
      control: false,
      description: "Callback function called when the toggle is pressed.",
    },
    "aria-label": {
      control: "text",
      description: "Accessibility label for screen readers.",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <ItalicIcon />,
  },
};

export const Variant: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <Toggle variant="outline">Outline</Toggle>
    </View>
  ),
};

export const Size: Story = {
  render: () => (
    <View style={{gap: 12, alignItems: "flex-start"}}>
      <Toggle size="sm">Small</Toggle>
      <Toggle size="md">Medium</Toggle>
      <Toggle size="lg">Large</Toggle>
      <Toggle size="xl">Extra Large</Toggle>
    </View>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [pressed, setPressed] = React.useState(false);
    return (
      <View style={{gap: 12}}>
        <Toggle pressed={pressed} onPressedChange={setPressed}>
          Controlled Toggle
        </Toggle>
        <Text>Pressed: {pressed ? "Yes" : "No"}</Text>
      </View>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <Toggle disabled>Disabled</Toggle>
      <Toggle disabled defaultPressed={true}>
        Disabled (Pressed)
      </Toggle>
    </View>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Toggle asChild variant="outline">
      <View className="p-4">
        <Text className="text-lg font-bold">Custom Toggle</Text>
      </View>
    </Toggle>
  ),
};

export const WithAriaLabel: Story = {
  args: {
    children: "Toggle",
    "aria-label": "Toggle bold formatting",
  },
};
