import React from "react";
import {Text, View} from "react-native";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../alert-dialog";
import {Meta, StoryObj} from "@storybook/react-native";
import {Button} from "../button";

function AlertDialogStory({
  modal,
  borderRadius,
  disabled,
  forceMount,
  defaultOpen,
  open,
  onOpenChange,
}: {
  modal?: boolean;
  borderRadius: "none" | "sm" | "md" | "lg" | "xl";
  disabled: boolean;
  forceMount: boolean;
  defaultOpen: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  return (
    <View className="bg-background flex-1 items-center justify-center p-6">
      <AlertDialog
        modal={modal}
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        forceMount={forceMount}
      >
        <AlertDialogTrigger disabled={disabled} asChild>
          <Button variant="destructive">Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogPortal>
          <AlertDialogOverlay />
          <AlertDialogContent
            forceMount={forceMount}
            borderRadius={borderRadius}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete Account</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </View>
  );
}

const meta: Meta<typeof AlertDialogStory> = {
  title: "AlertDialog",
  component: AlertDialogStory,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An alert dialog component that provides a modal overlay with critical actions. It includes accessibility features and can be controlled or uncontrolled.",
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
    forceMount: {
      control: "boolean",
      description: "Forces the dialog to mount even when closed",
      table: {defaultValue: {summary: "false"}},
    },
    defaultOpen: {
      control: "boolean",
      description: "Whether the dialog is open by default",
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
    forceMount: false,
    defaultOpen: false,
  },
};

export const BorderRadius: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Rounded None</Button>
        </AlertDialogTrigger>
        <AlertDialogPortal>
          <AlertDialogOverlay />
          <AlertDialogContent borderRadius="none">
            <AlertDialogHeader>
              <AlertDialogTitle>No Border Radius</AlertDialogTitle>
              <AlertDialogDescription>
                This dialog has no border radius.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Rounded Sm</Button>
        </AlertDialogTrigger>
        <AlertDialogPortal>
          <AlertDialogOverlay />
          <AlertDialogContent borderRadius="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Small Border Radius</AlertDialogTitle>
              <AlertDialogDescription>
                This dialog has a small border radius.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Rounded Md</Button>
        </AlertDialogTrigger>
        <AlertDialogPortal>
          <AlertDialogOverlay />
          <AlertDialogContent borderRadius="md">
            <AlertDialogHeader>
              <AlertDialogTitle>Medium Border Radius</AlertDialogTitle>
              <AlertDialogDescription>
                This dialog has a medium border radius.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Rounded Lg</Button>
        </AlertDialogTrigger>
        <AlertDialogPortal>
          <AlertDialogOverlay />
          <AlertDialogContent borderRadius="lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Large Border Radius</AlertDialogTitle>
              <AlertDialogDescription>
                This dialog has a large border radius.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Rounded XL</Button>
        </AlertDialogTrigger>
        <AlertDialogPortal>
          <AlertDialogOverlay />
          <AlertDialogContent borderRadius="xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Extra Large Border Radius</AlertDialogTitle>
              <AlertDialogDescription>
                This dialog has extra large border radius.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </View>
  ),
};

export const NonModal: Story = {
  args: {
    modal: false,
    borderRadius: "lg",
    disabled: false,
    forceMount: false,
    defaultOpen: false,
  },
};

export const Disabled: Story = {
  args: {
    modal: true,
    borderRadius: "lg",
    disabled: true,
    forceMount: false,
    defaultOpen: false,
  },
};

export const ForceMount: Story = {
  args: {
    modal: true,
    borderRadius: "lg",
    disabled: false,
    forceMount: true,
    defaultOpen: false,
  },
};

export const DefaultOpen: Story = {
  args: {
    modal: true,
    borderRadius: "lg",
    disabled: false,
    forceMount: false,
    defaultOpen: true,
  },
};

export const CustomActionVariants: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Custom Actions</Button>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Custom Action Variants</AlertDialogTitle>
            <AlertDialogDescription>
              This dialog shows different button variants for actions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="ghost">Skip</AlertDialogCancel>
            <AlertDialogAction variant="default">Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  ),
};

export const CustomActionSizes: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Custom Sizes</Button>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Custom Action Sizes</AlertDialogTitle>
            <AlertDialogDescription>
              This dialog shows different button sizes for actions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
            <AlertDialogAction size="lg">Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  ),
};

export const AsChild: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <View className="bg-destructive rounded-md px-4 py-2">
          <Text className="text-destructive-foreground font-medium">
            Custom Trigger
          </Text>
        </View>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Custom Trigger Element</AlertDialogTitle>
            <AlertDialogDescription>
              This dialog uses a custom trigger element with asChild.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  ),
};
