import React from "react";
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
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

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
        <Button size="sm" className="ml-auto w-[50%]">
          Action
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ShadcnVariant: Story = {
  render: (args) => (
    <Card {...args} variant="shadcn" className="max-w-sm">
      <CardHeader>
        <CardTitle>Shadcn Card</CardTitle>
      </CardHeader>
      <CardContent>
        Default card with background and border styling.
      </CardContent>
    </Card>
  ),
};

export const OutlineVariant: Story = {
  render: (args) => (
    <Card {...args} variant="outline" style={{maxWidth: 300}}>
      <CardHeader>
        <CardTitle>Outline Card</CardTitle>
      </CardHeader>
      <CardContent>Transparent background with border outline.</CardContent>
    </Card>
  ),
};

export const GhostVariant: Story = {
  render: (args) => (
    <Card {...args} variant="ghost" style={{maxWidth: 300}}>
      <CardHeader>
        <CardTitle>Ghost Card</CardTitle>
      </CardHeader>
      <CardContent>Minimal card with no background or border.</CardContent>
    </Card>
  ),
};

export const MinimalCard: Story = {
  render: (args) => (
    <Card {...args} style={{maxWidth: 250}}>
      <CardContent>
        A simple card with just content. Perfect for displaying standalone
        information without additional structure.
      </CardContent>
    </Card>
  ),
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
