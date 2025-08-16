import React from "react";
import {Text, View} from "react-native";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../tooltip.web";
import {Meta, StoryObj} from "@storybook/react-native";
import {Info, HelpCircle, Settings, AlertCircle} from "lucide-react-native";

const meta: Meta<typeof Tooltip> = {
  title: "Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Whether the tooltip is open by default (uncontrolled).",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    open: {
      control: "boolean",
      description: "Whether the tooltip is open (controlled).",
      table: {
        defaultValue: {
          summary: "undefined",
        },
      },
    },
    onOpenChange: {
      control: false,
      description:
        "Callback function called when the tooltip open state changes.",
    },
    delayDuration: {
      control: "number",
      description:
        "The delay before the tooltip opens on hover (in milliseconds).",
      table: {
        defaultValue: {
          summary: "700",
        },
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <Text className="text-foreground">Hover me</Text>
      </TooltipTrigger>
      <TooltipContent>
        This is a tooltip
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <Info className="text-muted-foreground h-5 w-5" />
      </TooltipTrigger>
      <TooltipContent>
        <Text>Additional information</Text>
      </TooltipContent>
    </Tooltip>
  ),
};

export const MultipleTooltips: Story = {
  render: () => (
    <View style={{gap: 16, flexDirection: "row"}}>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="text-muted-foreground h-5 w-5" />
        </TooltipTrigger>
        <TooltipContent>
          <Text>Help information</Text>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Settings className="text-muted-foreground h-5 w-5" />
        </TooltipTrigger>
        <TooltipContent>
          <Text>Settings</Text>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <AlertCircle className="text-muted-foreground h-5 w-5" />
        </TooltipTrigger>
        <TooltipContent>
          <Text>Warning message</Text>
        </TooltipContent>
      </Tooltip>
    </View>
  ),
};

export const CustomDelay: Story = {
  render: () => (
    <TooltipProvider delayDuration={2000}>
      <Tooltip>
        <TooltipTrigger>
          <Text className="text-foreground">Slow tooltip (2s delay)</Text>
        </TooltipTrigger>
        <TooltipContent>
          <Text>This tooltip has a longer delay</Text>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <View className="bg-secondary rounded-md p-3">
          <Text className="text-secondary-foreground font-medium">
            Custom trigger
          </Text>
        </View>
      </TooltipTrigger>
      <TooltipContent>
        <Text>Custom trigger element</Text>
      </TooltipContent>
    </Tooltip>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <Text className="text-foreground">Long tooltip</Text>
      </TooltipTrigger>
      <TooltipContent>
        <Text>
          This is a tooltip with longer content that demonstrates how the
          component handles multiple lines of text.
        </Text>
      </TooltipContent>
    </Tooltip>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <View style={{gap: 16, alignItems: "center"}}>
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger>
            <Text className="text-foreground">Controlled tooltip</Text>
          </TooltipTrigger>
          <TooltipContent>
            <Text>This tooltip is controlled externally</Text>
          </TooltipContent>
        </Tooltip>

        <View style={{flexDirection: "row", gap: 8}}>
          <Text
            className="text-foreground cursor-pointer underline"
            onPress={() => setOpen(true)}
          >
            Open
          </Text>
          <Text
            className="text-foreground cursor-pointer underline"
            onPress={() => setOpen(false)}
          >
            Close
          </Text>
        </View>
      </View>
    );
  },
};

export const CustomStyling: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger className="bg-primary rounded-lg p-2">
        <Text className="text-primary-foreground">Custom styled trigger</Text>
      </TooltipTrigger>
      <TooltipContent className="bg-destructive border-destructive">
        <Text className="text-destructive-foreground">
          Custom styled content
        </Text>
      </TooltipContent>
    </Tooltip>
  ),
};
