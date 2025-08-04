import React from "react";
import {Text, View} from "react-native";
import {Meta, StoryObj} from "@storybook/react-native";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleComponentProps,
} from "../collapsible";
import {Button} from "../button";
import {ChevronsUpDown} from "lucide-react-native";

function CollapsibleStory({
  open,
  defaultOpen,
  disabled,
  onOpenChange,
  asChild,
  baseClassName,
}: CollapsibleComponentProps) {
  const [, setIsOpen] = React.useState(open ?? defaultOpen ?? false);
  return (
    <Collapsible
      open={open}
      defaultOpen={defaultOpen}
      disabled={disabled}
      onOpenChange={(v) => {
        setIsOpen(v);
        onOpenChange?.(v);
      }}
      asChild={asChild}
      baseClassName={baseClassName}
      className="flex flex-col gap-2"
    >
      <View className="flex items-center justify-between gap-4 px-4">
        <Text className="text-sm font-semibold text-foreground">
          @peduarte starred 3 repositories
        </Text>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronsUpDown />
            <Text className="sr-only">Toggle</Text>
          </Button>
        </CollapsibleTrigger>
      </View>
      <View className="text-foreground rounded-md border px-4 py-2 font-mono text-sm">
        @radix-ui/primitives
      </View>
      <CollapsibleContent className="flex flex-col gap-2">
        <View className="text-foreground rounded-md border px-4 py-2 font-mono text-sm">
          @radix-ui/colors
        </View>
        <View className="text-foreground rounded-md border px-4 py-2 font-mono text-sm">
          @stitches/react
        </View>
      </CollapsibleContent>
    </Collapsible>
  );
}

const meta: Meta<typeof CollapsibleStory> = {
  title: "Collapsible",
  component: CollapsibleStory,
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controlled open state.",
    },
    defaultOpen: {
      control: "boolean",
      description: "Uncontrolled default open state.",
    },
    disabled: {
      control: "boolean",
      description: "Disables user interaction.",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Default",
  args: {},
};
