import React from "react";
import {Text, View} from "react-native";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogComponentProps,
} from "../dialog";
import {Meta, StoryObj} from "@storybook/react-native";
import {Button} from "../button";

function DialogStory({
  modal,
  borderRadius,
  disabled,
  forceMount,
  defaultOpen,
  open,
  onOpenChange,
}: DialogComponentProps & {
  disabled: boolean;
  forceMount: boolean;
  defaultOpen: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  borderRadius: "none" | "sm" | "md" | "lg" | "xl";
}) {
  return (
    <View className="w-full flex-1 items-center justify-center p-6">
      <Dialog
        modal={modal}
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        forceMount={forceMount}
      >
        <DialogTrigger disabled={disabled} asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogPortal name="dialog">
          <DialogOverlay />
          <DialogContent forceMount={forceMount} borderRadius={borderRadius}>
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>
                Copy the link below to share this document.
              </DialogDescription>
            </DialogHeader>
            <View className="bg-muted my-4 rounded p-3">
              <Text selectable>https://example.com/very/long/link</Text>
            </View>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Copy</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </View>
  );
}

const meta: Meta<typeof DialogStory> = {
  title: "Components/Dialog",
  component: DialogStory,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A dialog component that provides a modal overlay with content. It includes accessibility features and can be controlled or uncontrolled.",
      },
    },
  },
  argTypes: {
    modal: {
      control: "boolean",
      description:
        "When false, dialog is non-modal (interaction outside allowed)",
      table: {defaultValue: {summary: "true"}},
    },
    borderRadius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
      description: "Border radius for dialog content",
      table: {defaultValue: {summary: "lg"}},
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
      description: "Force mount dialog content even when closed",
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
    borderRadius: "lg",
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
