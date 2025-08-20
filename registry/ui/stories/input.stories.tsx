import React from "react";
import {Text, View} from "react-native";
import {Meta, StoryObj} from "@storybook/react-native";
import {Input} from "../input";
import {Search, X, Mail} from "lucide-react-native";

const meta: Meta<typeof Input> = {
  title: "Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      description: "Visual variant of the input.",
      options: ["shadcn", "outlined", "ghost"],
      table: {defaultValue: {summary: "shadcn"}},
    },
    size: {
      control: "select",
      description: "Size of the input.",
      options: ["sm", "md", "lg", "xl"],
      table: {defaultValue: {summary: "md"}},
    },
    borderRadius: {
      control: "select",
      description: "Corner borderRadius.",
      options: ["none", "sm", "md", "lg", "xl"],
      table: {defaultValue: {summary: "md"}},
    },
    color: {
      control: "select",
      description: "Focus ring color.",
      options: ["primary", "secondary", "success", "warning", "destructive"],
      table: {defaultValue: {summary: "primary"}},
    },
    disabled: {
      control: "boolean",
      description: "Disables the input field.",
      table: {defaultValue: {summary: "false"}},
    },
    readOnly: {
      control: "boolean",
      description: "Makes the input read-only.",
      table: {defaultValue: {summary: "false"}},
    },
    required: {
      control: "boolean",
      description: "Marks the input as required (accessibility hint).",
      table: {defaultValue: {summary: "false"}},
    },
    clearable: {
      control: "boolean",
      description:
        "Shows a clear button when there is a value and clearable is true.",
      table: {defaultValue: {summary: "false"}},
    },
    startContent: {
      control: false,
      description: "Content to render at the start of the input.",
    },
    endContent: {
      control: false,
      description: "Content to render at the end of the input.",
    },
    className: {
      control: "text",
      description: "Additional classes to merge into the input wrapper.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text.",
    },
    value: {
      control: "text",
      description: "Controlled value.",
    },
    onChangeText: {control: false},
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Email",
    startContent: <Mail className="text-muted-foreground mr-2 size-4" />,
  },
};

export const Variants: Story = {
  render: () => (
    <View style={{gap: 12, width: 300}}>
      <Input placeholder="Shadcn" variant="shadcn" />
      <Input placeholder="Outlined" variant="outlined" />
      <Input placeholder="Ghost" variant="ghost" />
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{gap: 12, width: 300}}>
      <Input placeholder="Small" size="sm" />
      <Input placeholder="Medium" size="md" />
      <Input placeholder="Large" size="lg" />
      <Input placeholder="XL" size="xl" />
    </View>
  ),
};

export const borderRadius: Story = {
  render: () => (
    <View style={{gap: 12, width: 300}}>
      <Input placeholder="None" borderRadius="none" />
      <Input placeholder="SM" borderRadius="sm" />
      <Input placeholder="MD" borderRadius="md" />
      <Input placeholder="LG" borderRadius="lg" />
      <Input placeholder="XL" borderRadius="xl" />
    </View>
  ),
};

export const Colors: Story = {
  render: () => (
    <View style={{gap: 12, width: 300}}>
      <Input placeholder="Primary" color="primary" />
      <Input placeholder="Secondary" color="secondary" />
      <Input placeholder="Success" color="success" />
      <Input placeholder="Warning" color="warning" />
      <Input placeholder="Destructive" color="destructive" />
    </View>
  ),
};

export const WithAccessories: Story = {
  render: () => (
    <View style={{gap: 12, width: 300}}>
      <Input
        placeholder="Search"
        startContent={<Search className="text-muted-foreground mr-2 size-4" />}
      />
      <Input
        placeholder="With end content"
        endContent={<Text className="text-muted-foreground">.com</Text>}
      />
    </View>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled",
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    placeholder: "Read only",
    readOnly: true,
    value: "you@domain.com",
  },
};

export const Required: Story = {
  args: {
    placeholder: "Required",
    required: true,
  },
};

export const ClearableControlled: Story = {
  render: () => {
    const [text, setText] = React.useState("Hello");
    return (
      <View style={{gap: 12, width: 300}}>
        <Input
          placeholder="Type something"
          clearable
          value={text}
          onChangeText={setText}
          endContent={<X className="text-muted-foreground ml-2 size-4" />}
        />
        <Text className="text-muted-foreground">Value: {text}</Text>
      </View>
    );
  },
};
