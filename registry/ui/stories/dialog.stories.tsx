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
}: DialogComponentProps & {
  disabled: boolean;
  forceMount: boolean;
  defaultOpen: boolean;
  borderRadius: "none" | "sm" | "md" | "lg" | "xl";
}) {
  return (
    <View className="bg-background flex-1 items-center justify-center p-6">
      <Dialog modal={modal} defaultOpen={defaultOpen} forceMount={forceMount}>
        <DialogTrigger
          className="bg-primary rounded-md px-4 py-2"
          disabled={disabled}
        >
          <Text className="text-white">Open dialog</Text>
        </DialogTrigger>
        <DialogPortal>
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
              <Button variant="outline">Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </View>
  );
}

const meta: Meta<typeof DialogStory> = {
  title: "Dialog",
  component: DialogStory,
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
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    modal: true,
    borderRadius: "lg",
    disabled: false,
    defaultOpen: false,
  },
};
