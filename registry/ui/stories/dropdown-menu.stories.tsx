import React, {useState} from "react";
import {Text, View} from "react-native";
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuItemIcon,
  DropdownMenuItemImage,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSub,
  DropdownMenuItemIndicator,
  DropdownMenuArrow,
} from "../dropdown-menu";
import {Meta, StoryObj} from "@storybook/react-native";
import {Button} from "../button";
import {
  ChevronDown,
  User,
  Settings,
  LogOut,
  Download,
  Edit,
  Trash2,
  MoreHorizontal,
  Plus,
  Copy,
  Share,
  Archive,
  Star,
  Heart,
  Bookmark,
} from "lucide-react-native";

function DropdownMenuStory() {
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState("pedro");

  return (
    <View className="w-full flex-1 items-center justify-center gap-8 p-6">
      {/* Basic Dropdown */}
      <View className="items-center gap-4">
        <Text className="text-lg font-semibold">Basic Dropdown</Text>
        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Text>Open Menu</Text>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem key="profile">
              <DropdownMenuItemTitle>Profile</DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuItem key="settings">
              <DropdownMenuItemTitle>Settings</DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem key="logout">
              <DropdownMenuItemTitle>Log out</DropdownMenuItemTitle>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </View>

      {/* Dropdown with Icons */}
      <View className="items-center gap-4">
        <Text className="text-lg font-semibold">With Icons</Text>
        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Text>Account</Text>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <DropdownMenuItemIcon>
                <User className="h-4 w-4" />
              </DropdownMenuItemIcon>
              <DropdownMenuItemTitle>Profile</DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DropdownMenuItemIcon>
                <Settings className="h-4 w-4" />
              </DropdownMenuItemIcon>
              <DropdownMenuItemTitle>Settings</DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <DropdownMenuItemIcon>
                <LogOut className="h-4 w-4" />
              </DropdownMenuItemIcon>
              <DropdownMenuItemTitle>Log out</DropdownMenuItemTitle>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </View>

      {/* Dropdown with Groups */}
      <View className="items-center gap-4">
        <Text className="text-lg font-semibold">With Groups</Text>
        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Text>Actions</Text>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>File</DropdownMenuLabel>
              <DropdownMenuItem>
                <DropdownMenuItemIcon>
                  <Plus className="h-4 w-4" />
                </DropdownMenuItemIcon>
                <DropdownMenuItemTitle>New File</DropdownMenuItemTitle>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DropdownMenuItemIcon>
                  <Download className="h-4 w-4" />
                </DropdownMenuItemIcon>
                <DropdownMenuItemTitle>Download</DropdownMenuItemTitle>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Edit</DropdownMenuLabel>
              <DropdownMenuItem>
                <DropdownMenuItemIcon>
                  <Edit className="h-4 w-4" />
                </DropdownMenuItemIcon>
                <DropdownMenuItemTitle>Edit</DropdownMenuItemTitle>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DropdownMenuItemIcon>
                  <Trash2 className="h-4 w-4" />
                </DropdownMenuItemIcon>
                <DropdownMenuItemTitle>Delete</DropdownMenuItemTitle>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </View>

      {/* Dropdown with Checkboxes */}
      <View className="items-center gap-4">
        <Text className="text-lg font-semibold">With Checkboxes</Text>
        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Text>View Options</Text>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={bookmarksChecked}
              onCheckedChange={setBookmarksChecked}
            >
              <DropdownMenuItemTitle>Show Bookmarks</DropdownMenuItemTitle>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={urlsChecked}
              onCheckedChange={setUrlsChecked}
            >
              <DropdownMenuItemTitle>Show Full URLs</DropdownMenuItemTitle>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </View>

      {/* Dropdown with Submenu */}
      <View className="items-center gap-4">
        <Text className="text-lg font-semibold">With Submenu</Text>
        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Text>More Actions</Text>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <DropdownMenuItemIcon>
                <Copy className="h-4 w-4" />
              </DropdownMenuItemIcon>
              <DropdownMenuItemTitle>Copy</DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DropdownMenuItemIcon>
                <Share className="h-4 w-4" />
              </DropdownMenuItemIcon>
              <DropdownMenuItemTitle>Share</DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <DropdownMenuItemIcon>
                  <Archive className="h-4 w-4" />
                </DropdownMenuItemIcon>
                <DropdownMenuItemTitle>Archive</DropdownMenuItemTitle>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <DropdownMenuItemTitle>Move to Archive</DropdownMenuItemTitle>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DropdownMenuItemTitle>Archive All</DropdownMenuItemTitle>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <DropdownMenuItemIcon>
                <Trash2 className="h-4 w-4" />
              </DropdownMenuItemIcon>
              <DropdownMenuItemTitle>Delete</DropdownMenuItemTitle>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </View>

      {/* More Horizontal Menu */}
      <View className="items-center gap-4">
        <Text className="text-lg font-semibold">More Horizontal Menu</Text>
        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <DropdownMenuItemIcon>
                <Star className="h-4 w-4" />
              </DropdownMenuItemIcon>
              <DropdownMenuItemTitle>Add to Favorites</DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DropdownMenuItemIcon>
                <Heart className="h-4 w-4" />
              </DropdownMenuItemIcon>
              <DropdownMenuItemTitle>Like</DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DropdownMenuItemIcon>
                <Bookmark className="h-4 w-4" />
              </DropdownMenuItemIcon>
              <DropdownMenuItemTitle>Bookmark</DropdownMenuItemTitle>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </View>
    </View>
  );
}

const meta: Meta<typeof DropdownMenuStory> = {
  title: "Components/DropdownMenu",
  component: DropdownMenuStory,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A dropdown menu component that displays a list of actions or options. It supports icons, groups, checkboxes, submenus, and various interactive states.",
      },
    },
  },
  argTypes: {},
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DropdownMenuStory />,
};

export const Basic: Story = {
  render: () => (
    <View className="w-full flex-1 items-center justify-center p-6">
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Text>Open Menu</Text>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <DropdownMenuItemTitle>Profile</DropdownMenuItemTitle>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DropdownMenuItemTitle>Settings</DropdownMenuItemTitle>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <DropdownMenuItemTitle>Log out</DropdownMenuItemTitle>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </View>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <View className="w-full flex-1 items-center justify-center p-6">
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Text>Account</Text>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <DropdownMenuItemIcon>
              <User className="h-4 w-4" />
            </DropdownMenuItemIcon>
            <DropdownMenuItemTitle>Profile</DropdownMenuItemTitle>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DropdownMenuItemIcon>
              <Settings className="h-4 w-4" />
            </DropdownMenuItemIcon>
            <DropdownMenuItemTitle>Settings</DropdownMenuItemTitle>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <DropdownMenuItemIcon>
              <LogOut className="h-4 w-4" />
            </DropdownMenuItemIcon>
            <DropdownMenuItemTitle>Log out</DropdownMenuItemTitle>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </View>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <View className="w-full flex-1 items-center justify-center p-6">
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Text>Actions</Text>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>File</DropdownMenuLabel>
            <DropdownMenuItem>
              <DropdownMenuItemIcon>
                <Plus className="h-4 w-4" />
              </DropdownMenuItemIcon>
              <DropdownMenuItemTitle>New File</DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DropdownMenuItemIcon>
                <Download className="h-4 w-4" />
              </DropdownMenuItemIcon>
              <DropdownMenuItemTitle>Download</DropdownMenuItemTitle>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Edit</DropdownMenuLabel>
            <DropdownMenuItem>
              <DropdownMenuItemIcon>
                <Edit className="h-4 w-4" />
              </DropdownMenuItemIcon>
              <DropdownMenuItemTitle>Edit</DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DropdownMenuItemIcon>
                <Trash2 className="h-4 w-4" />
              </DropdownMenuItemIcon>
              <DropdownMenuItemTitle>Delete</DropdownMenuItemTitle>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </View>
  ),
};

export const WithCheckboxes: Story = {
  render: () => {
    const [bookmarksChecked, setBookmarksChecked] = useState(true);
    const [urlsChecked, setUrlsChecked] = useState(false);

    return (
      <View className="w-full flex-1 items-center justify-center p-6">
        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Text>View Options</Text>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={bookmarksChecked}
              onCheckedChange={setBookmarksChecked}
            >
              <DropdownMenuItemTitle>Show Bookmarks</DropdownMenuItemTitle>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={urlsChecked}
              onCheckedChange={setUrlsChecked}
            >
              <DropdownMenuItemTitle>Show Full URLs</DropdownMenuItemTitle>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </View>
    );
  },
};

export const WithSubmenu: Story = {
  render: () => (
    <View className="w-full flex-1 items-center justify-center p-6">
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Text>More Actions</Text>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <DropdownMenuItemIcon>
              <Copy className="h-4 w-4" />
            </DropdownMenuItemIcon>
            <DropdownMenuItemTitle>Copy</DropdownMenuItemTitle>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DropdownMenuItemIcon>
              <Share className="h-4 w-4" />
            </DropdownMenuItemIcon>
            <DropdownMenuItemTitle>Share</DropdownMenuItemTitle>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <DropdownMenuItemIcon>
                <Archive className="h-4 w-4" />
              </DropdownMenuItemIcon>
              <DropdownMenuItemTitle>Archive</DropdownMenuItemTitle>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                <DropdownMenuItemTitle>Move to Archive</DropdownMenuItemTitle>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DropdownMenuItemTitle>Archive All</DropdownMenuItemTitle>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <DropdownMenuItemIcon>
              <Trash2 className="h-4 w-4" />
            </DropdownMenuItemIcon>
            <DropdownMenuItemTitle>Delete</DropdownMenuItemTitle>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </View>
  ),
};
