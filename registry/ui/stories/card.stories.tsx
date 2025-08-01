import React from "react";
import {Text} from "react-native";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "../card";
import {Meta, StoryObj} from "@storybook/react-native";
import {Button} from "../button";

const meta: Meta<typeof Card> = {
  title: "Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible card component that displays content in a visually appealing container. Supports multiple variants, customizable border radius, blur effects, and optional press interactions. Built with accessibility in mind and fully compatible with both React Native and web platforms.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      description:
        "The visual style variant of the card. Controls background, border, and shadow styling.",
      table: {
        defaultValue: {
          summary: "shadcn",
        },
      },
      options: ["shadcn", "outline", "ghost"],
    },
    radius: {
      control: "select",
      description:
        "Sets the border radius of the card. Controls the roundness of the card corners.",
      table: {
        defaultValue: {
          summary: "xl",
        },
      },
      options: ["none", "sm", "md", "lg", "xl"],
    },
    blurred: {
      control: "boolean",
      description:
        "When true, applies a blur effect to the card content. Useful for creating overlay or disabled states.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    pressable: {
      control: "boolean",
      description:
        "When true, makes the card interactive with press states and accessibility support. Converts the card into a pressable button-like component.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    disabled: {
      control: "boolean",
      description:
        "When true and pressable is enabled, disables the card interaction and applies disabled styling.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    asChild: {
      description:
        "When true, the card merges its props with the first child element instead of rendering a wrapper. Useful for custom implementations.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
  },
  args: {
    variant: "shadcn",
    radius: "xl",
    blurred: false,
    pressable: false,
    disabled: false,
    asChild: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default card with standard content structure including header, title, description, content, and footer.
 */
export const Default: Story = {
  render: (args) => (
    <Card {...args} style={{maxWidth: 350}}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          A brief description of the card content goes here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        This is the main content area of the card. You can place any content
        here such as text, images, or other components.
      </CardContent>
      <CardFooter>
        <Button size="sm">
          <Text>Action</Text>
        </Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card with shadcn variant - the default styling with background and border.
 */
export const ShadcnVariant: Story = {
  args: {
    variant: "shadcn",
  },
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader>
        <CardTitle>Shadcn Card</CardTitle>
      </CardHeader>
      <CardContent>
        Default card with background and border styling.
      </CardContent>
    </Card>
  ),
};

/**
 * Card with outline variant - transparent background with visible border.
 */
export const OutlineVariant: Story = {
  args: {
    variant: "outline",
  },
  render: (args) => (
    <Card {...args} style={{maxWidth: 300}}>
      <CardHeader>
        <CardTitle>Outline Card</CardTitle>
      </CardHeader>
      <CardContent>Transparent background with border outline.</CardContent>
    </Card>
  ),
};

/**
 * Card with ghost variant - minimal styling with no background or border.
 */
export const GhostVariant: Story = {
  args: {
    variant: "ghost",
  },
  render: (args) => (
    <Card {...args} style={{maxWidth: 300}}>
      <CardHeader>
        <CardTitle>Ghost Card</CardTitle>
      </CardHeader>
      <CardContent>Minimal card with no background or border.</CardContent>
    </Card>
  ),
};

/**
 * Minimal card with just content, no header or footer.
 */
export const MinimalCard: Story = {
  render: (args) => (
    <Card {...args} style={{maxWidth: 250}}>
      <CardContent>
        A simple card with just content. Perfect for displaying standalone
        information without additional structure.
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A minimal card implementation with only content. Demonstrates the flexibility of the card component for simple use cases.",
      },
    },
  },
};

export const withAction: Story = {
  render: (args) => (
    <Card {...args} style={{maxWidth: 300}}>
      <CardContent>
        This is the main content area of the card. You can place any content
        here such as text, images, or other components.
      </CardContent>
      <CardAction>
        <Button>Action</Button>
      </CardAction>
    </Card>
  ),
};
