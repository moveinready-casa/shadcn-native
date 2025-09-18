import React from "react";
import {View} from "react-native";
import {Meta, StoryObj} from "@storybook/react-native";
import {Button} from "../button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuContent,
} from "../dropdown-menu";

function DropdownMenuStory() {
  return (
    <View className="w-full flex-1 items-center justify-center p-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open menu</Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem key="profile">Profile</DropdownMenuItem>
            <DropdownMenuItem key="settings">
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuCheckboxItem key="email-notifications" value="on">
            Email Notifications
          </DropdownMenuCheckboxItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger key="more">More</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem key="about">About</DropdownMenuItem>
              <DropdownMenuItem key="help">Help</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem key="logout" variant="destructive">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  );
}

const meta: Meta<typeof DropdownMenuStory> = {
  title: "Components/DropdownMenu",
  component: DropdownMenuStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
