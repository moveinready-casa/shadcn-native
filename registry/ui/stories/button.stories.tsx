import React from "react";
import {Text, View} from "react-native";
import {Button} from "../button";
import {Meta, StoryObj} from "@storybook/react-native";
import {Loader2, Download, ArrowRight} from "lucide-react-native";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      description:
        "The visual variant of the button. Controls the color scheme and styling approach.",
      table: {
        defaultValue: {
          summary: "default",
        },
      },
      options: [
        "default",
        "destructive",
        "warning",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      description:
        "Sets the size of the button. Controls height, padding, and text size.",
      table: {
        defaultValue: {
          summary: "md",
        },
      },
      options: ["sm", "md", "lg", "xl", "icon"],
    },
    borderRadius: {
      control: "select",
      description:
        "Sets the border radius of the button. Controls the roundness of corners.",
      table: {
        defaultValue: {
          summary: "md",
        },
      },
      options: ["none", "sm", "md", "lg", "xl"],
    },
    fullWidth: {
      control: "boolean",
      description:
        "Whether the button should take the full width of its container.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    asChild: {
      description:
        "If true, clones props to the nearest child instead of rendering a Pressable. Useful for custom button elements.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    loading: {
      control: "boolean",
      description:
        "Whether the button is in a loading state. Shows spinner and disables interaction.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    disabled: {
      control: "boolean",
      description:
        "Whether the button is disabled. Reduces opacity and prevents interaction.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    spinner: {
      control: false,
      description:
        "Custom spinner element to display when loading. Overrides the default ActivityIndicator.",
    },
    startContent: {
      control: false,
      description:
        "Content to display at the start of the button (before children).",
    },
    endContent: {
      control: false,
      description:
        "Content to display at the end of the button (after children).",
    },
    baseClassName: {
      control: "text",
      description:
        "Base CSS classes to apply to the button (overrides variant styles).",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the button.",
    },
    onPress: {
      control: false,
      description: "Callback function called when the button is pressed.",
    },
    onPressStart: {
      control: false,
      description: "Callback function called when the button press starts.",
    },
    onPressEnd: {
      control: false,
      description: "Callback function called when the button press ends.",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Variants: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{gap: 12, alignItems: "flex-start"}}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
      <Button size="icon">📄</Button>
    </View>
  ),
};

export const BorderRadius: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <Button borderRadius="none">None</Button>
      <Button borderRadius="sm">Small</Button>
      <Button borderRadius="md">Medium</Button>
      <Button borderRadius="lg">Large</Button>
      <Button borderRadius="xl">Extra Large</Button>
    </View>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <View style={{gap: 12, width: "100%"}}>
      <Button fullWidth>Full Width Button</Button>
      <Button fullWidth variant="outline">
        Full Width Outline
      </Button>
    </View>
  ),
};

export const WithStartContent: Story = {
  args: {
    children: "Download",
    startContent: <Download className="mr-2 h-4 w-4" />,
  },
};

export const WithEndContent: Story = {
  args: {
    children: "Continue",
    endContent: <ArrowRight className="ml-2 h-4 w-4" />,
  },
};

export const Loading: Story = {
  args: {
    children: "Please wait",
    loading: true,
  },
};

export const LoadingWithCustomSpinner: Story = {
  args: {
    children: "Loading",
    loading: true,
    spinner: <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};

export const LoadingAndDisabled: Story = {
  args: {
    children: "Loading & Disabled",
    loading: true,
    disabled: true,
  },
};

export const AsChild: Story = {
  render: () => (
    <Button asChild variant="outline">
      <View className="p-4">
        <Text className="text-lg font-bold">Custom Button</Text>
      </View>
    </Button>
  ),
};

export const WithBaseClassName: Story = {
  args: {
    children: "Custom Styled",
    baseClassName: "bg-blue-500 text-white",
    variant: "outline",
  },
};

export const Interactive: Story = {
  args: {
    children: "Click me!",
    onPress: () => console.log("Button pressed!"),
    onPressStart: () => console.log("Press started!"),
    onPressEnd: () => console.log("Press ended!"),
  },
};
