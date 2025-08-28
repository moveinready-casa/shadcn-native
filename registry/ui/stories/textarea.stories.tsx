import React from "react";
import {Text, View} from "react-native";
import {Meta, StoryObj} from "@storybook/react-native";
import {Textarea} from "../textarea";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      description: "Visual variant of the textarea.",
      options: ["shadcn", "ghost"],
      table: {defaultValue: {summary: "shadcn"}},
    },
    color: {
      control: "select",
      description: "Focus ring color.",
      options: ["default", "secondary", "destructive", "warning", "success"],
      table: {defaultValue: {summary: "default"}},
    },
    disabled: {
      control: "boolean",
      description: "Disables the textarea field.",
      table: {defaultValue: {summary: "false"}},
    },
    loading: {
      control: "boolean",
      description: "Disables the textarea field.",
      table: {defaultValue: {summary: "false"}},
    },
    borderRadius: {
      control: "select",
      description: "Border radius of the textarea.",
      options: ["none", "sm", "md", "lg", "xl"],
      table: {defaultValue: {summary: "md"}},
    },
    value: {
      control: "text",
      description: "Controlled value.",
    },
    baseClassName: {
      control: "text",
      description: "Additional class name to be applied to the textarea.",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter your message here...",
  },
};

export const Variant: Story = {
  render: () => (
    <View style={{gap: 12, width: 300}}>
      <Textarea placeholder="Ghost variant" variant="ghost" />
    </View>
  ),
};

export const Color: Story = {
  render: () => (
    <View style={{gap: 12, width: 300}}>
      <Textarea placeholder="Success color" color="success" />
    </View>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: "This textarea is disabled",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const WithValue: Story = {
  args: {
    value:
      "This is a pre-filled textarea with some content. It demonstrates how the component looks when it has existing text.",
  },
};

export const Controlled: Story = {
  render: () => {
    const [text, setText] = React.useState("Initial value");
    return (
      <View style={{gap: 12, width: 300}}>
        <Textarea
          placeholder="Type something..."
          value={text}
          onChangeText={setText}
        />
        <Text className="text-muted-foreground">
          Character count: {text.length}
        </Text>
      </View>
    );
  },
};
