import React from "react";
import {Text, View} from "react-native";
import {Meta, StoryObj} from "@storybook/react-native";

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardComponentProps,
} from "../hover-card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from "../card";

type StoryProps = HoverCardComponentProps & {
  triggerAsChild?: boolean;
  triggerBaseClassName?: string;
  triggerDisabled?: boolean;
  triggerLoading?: boolean;
  contentAsChild?: boolean;
  contentBaseClassName?: string;
};

function HoverCardStory({
  open,
  defaultOpen,
  onOpenChange,
  baseClassName,
  triggerAsChild,
  triggerBaseClassName,
  triggerDisabled,
  triggerLoading,
  contentAsChild,
  contentBaseClassName,
}: StoryProps) {
  return (
    <View className="w-full items-start gap-4 p-4">
      <HoverCard
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        baseClassName={baseClassName}
      >
        <HoverCardTrigger
          asChild={triggerAsChild}
          baseClassName={triggerBaseClassName || "underline underline-offset-4"}
          disabled={triggerDisabled}
          loading={triggerLoading}
        >
          <Text>@moveinready</Text>
        </HoverCardTrigger>
        <HoverCardContent
          asChild={contentAsChild}
          baseClassName={contentBaseClassName}
        >
          <View className="flex gap-2">
            <Text className="text-sm font-semibold">@moveinready</Text>
            <Text className="text-sm">
              We are Move In Ready we are building the next generation mid term
              rental platform. We also building the best React Native UI library
              while we are at it!
            </Text>
            <Text className="text-muted-foreground text-xs">
              Built with React Native.
            </Text>
          </View>
        </HoverCardContent>
      </HoverCard>
    </View>
  );
}

const meta: Meta<typeof HoverCardStory> = {
  title: "HoverCard",
  component: HoverCardStory,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    open: {
      control: "boolean",
      description: "Controlled open state of the hover card.",
    },
    defaultOpen: {
      control: "boolean",
      description: "Uncontrolled default open state of the hover card.",
    },
    onOpenChange: {
      control: false,
      description: "Callback when open state changes.",
    },
    baseClassName: {
      control: "text",
      description: "Custom classes for the root hover card hit box.",
    },
    triggerAsChild: {
      control: "boolean",
      description:
        "Clone props to the child element instead of rendering a Pressable.",
      table: {defaultValue: {summary: "false"}},
    },
    triggerBaseClassName: {
      control: "text",
      description: "Custom classes for the trigger element.",
    },
    triggerDisabled: {
      control: "boolean",
      description: "Disable the trigger (prevents opening).",
      table: {defaultValue: {summary: "false"}},
    },
    triggerLoading: {
      control: "boolean",
      description:
        "Loading state on the trigger (prevents opening, adds pulse/opacity).",
      table: {defaultValue: {summary: "false"}},
    },
    contentAsChild: {
      control: "boolean",
      description: "Clone props to the child element for content.",
      table: {defaultValue: {summary: "false"}},
    },
    contentBaseClassName: {
      control: "text",
      description: "Custom classes for the content container.",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: {open: true},
};

export const DisabledTrigger: Story = {
  args: {triggerDisabled: true},
};

export const LoadingTrigger: Story = {
  args: {triggerLoading: true},
};

export const WithCustomStyling: Story = {
  args: {
    baseClassName: "bg-background/50",
    triggerBaseClassName: "text-primary underline underline-offset-4",
    contentBaseClassName: "bg-popover",
  },
};

export const Composite: Story = {
  args: {
    contentAsChild: true,
  },
  render: (args) => (
    <View className="w-full items-start gap-4 p-4">
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent asChild {...args}>
          <Card className="bg-popover-foreground">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>
                A brief description of the card content goes here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              This is the main content area of the card. You can place any
              content here such as text, images, or other components.
            </CardContent>
          </Card>
        </HoverCardContent>
      </HoverCard>
    </View>
  ),
};
