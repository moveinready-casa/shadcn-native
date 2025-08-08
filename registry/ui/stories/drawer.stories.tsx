import React from "react";
import {Text, View} from "react-native";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "../drawer";
import {Meta, StoryObj} from "@storybook/react-native";
import {Button} from "../button";

function DrawerStory({
  disabled,
  onClose,
  snapPoints,
  initialSnapIndex,
}: {
  disabled: boolean;
  onClose?: () => void;
  snapPoints?: number[];
  initialSnapIndex?: number;
}) {
  return (
    <View className="bg-background flex-1 items-center justify-center p-6">
      <Drawer>
        <DrawerTrigger disabled={disabled} asChild>
          <Button>Open drawer</Button>
        </DrawerTrigger>
        <DrawerContent
          onClose={onClose}
          snapPoints={snapPoints}
          initialSnapIndex={initialSnapIndex}
        >
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>
              This is a description of the drawer content. You can add any
              content here.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <View className="ml-auto flex flex-row gap-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button>Save</Button>
              </DrawerClose>
            </View>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </View>
  );
}

const meta: Meta<typeof DrawerStory> = {
  title: "Drawer",
  component: DrawerStory,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A drawer component that provides a bottom sheet overlay with content. It includes accessibility features and can be controlled or uncontrolled.",
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables trigger interactions",
      table: {defaultValue: {summary: "false"}},
    },
    onClose: {
      control: false,
      description: "Callback when the drawer closes",
      table: {defaultValue: {summary: "undefined"}},
    },
    snapPoints: {
      control: "object",
      description: "Snap points to configure the sheet's height",
      table: {defaultValue: {summary: "undefined"}},
    },
    initialSnapIndex: {
      control: "number",
      description: "Initial snap index for the sheet",
      table: {defaultValue: {summary: "0"}},
    },
  },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
    initialSnapIndex: 0,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const WithCallbacks: Story = {
  args: {
    ...Default.args,
    onClose: () => console.log("Drawer closed"),
  },
};
