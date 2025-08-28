import React from "react";
import {View} from "react-native";
import {Meta, StoryObj} from "@storybook/react-native";
import {Button} from "../button";
import {toast} from "../sonner";

function SonnerStory() {
  return (
    <View className="bg-background flex-1 items-center justify-center p-6">
      <Button onPress={() => toast("Event has been created.")}>
        Show toast
      </Button>
    </View>
  );
}

const meta: Meta<typeof SonnerStory> = {
  title: "Components/Sonner",
  component: SonnerStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
