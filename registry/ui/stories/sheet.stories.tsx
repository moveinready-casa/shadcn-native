import React from "react";
import {Text, View} from "react-native";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetOverlay,
  SheetPortal,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetComponentProps,
} from "../sheet";
import {Meta, StoryObj} from "@storybook/react-native";
import {Button} from "../button";

function SheetStory({
  modal,
  side,
  disabled,
  forceMount,
  defaultOpen,
  open,
  onOpenChange,
}: SheetComponentProps & {
  disabled: boolean;
  forceMount: boolean;
  defaultOpen: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  side: "top" | "bottom" | "left" | "right";
}) {
  return (
    <View className="bg-background flex-1 items-center justify-center p-6">
      <Sheet
        modal={modal}
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        forceMount={forceMount}
      >
        <SheetTrigger disabled={disabled} asChild>
          <Button>Open sheet</Button>
        </SheetTrigger>
        <SheetPortal>
          <SheetOverlay />
          <SheetContent forceMount={forceMount} side={side}>
            <SheetHeader>
              <SheetTitle>Share link</SheetTitle>
              <SheetDescription>
                Copy the link below to share this document.
              </SheetDescription>
            </SheetHeader>
            <View className="bg-muted my-4 rounded p-3">
              <Text selectable className="text-sm text-muted-foreground">
                https://example.com/very/long/link
              </Text>
            </View>
            <SheetFooter>
              <SheetClose asChild>
                <Button>Copy</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </SheetPortal>
      </Sheet>
    </View>
  );
}

const meta: Meta<typeof SheetStory> = {
  title: "Sheet",
  component: SheetStory,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A sheet component that provides a side panel overlay with content. It includes accessibility features and can be controlled or uncontrolled.",
      },
    },
  },
  argTypes: {
    modal: {
      control: "boolean",
      description:
        "When false, sheet is non-modal (interaction outside allowed)",
      table: {defaultValue: {summary: "true"}},
    },
    side: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Side of the sheet",
      table: {defaultValue: {summary: "top"}},
    },
    disabled: {
      control: "boolean",
      description: "Disables trigger interactions",
      table: {defaultValue: {summary: "false"}},
    },
    defaultOpen: {
      control: "boolean",
      description: "Initial open state (uncontrolled)",
      table: {defaultValue: {summary: "false"}},
    },
    open: {
      control: "boolean",
      description: "Controlled open state",
      table: {defaultValue: {summary: "undefined"}},
    },
    onOpenChange: {
      control: false,
      description: "Callback when open state changes",
      table: {defaultValue: {summary: "undefined"}},
    },
    forceMount: {
      control: "boolean",
      description: "Force mount sheet content even when closed",
      table: {defaultValue: {summary: "false"}},
    },
  },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    modal: true,
    side: "right",
    disabled: false,
    defaultOpen: false,
    forceMount: false,
  },
};

export const NonModal: Story = {
  args: {
    ...Default.args,
    modal: false,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const ForceMount: Story = {
  args: {
    ...Default.args,
    forceMount: true,
  },
};
