import React from "react";
import {Text, View} from "react-native";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "../tabs";
import {Meta, StoryObj} from "@storybook/react-native";
import {Settings, User, Bell, Home} from "lucide-react-native";

const meta: Meta<typeof Tabs> = {
  title: "Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    orientation: {
      control: "select",
      description:
        "The orientation of the tabs. Controls whether tabs are arranged horizontally or vertically.",
      table: {
        defaultValue: {
          summary: "horizontal",
        },
      },
      options: ["horizontal", "vertical"],
    },
    size: {
      control: "select",
      description:
        "Sets the size of the tabs. Controls height, padding, and text size.",
      table: {
        defaultValue: {
          summary: "md",
        },
      },
      options: ["sm", "md", "lg", "xl"],
    },
    variant: {
      control: "select",
      description:
        "The visual style variant of the tabs. Controls the overall appearance and styling approach.",
      table: {
        defaultValue: {
          summary: "shadcn",
        },
      },
      options: ["shadcn", "underlined", "outlined", "ghost"],
    },
    borderRadius: {
      control: "select",
      description:
        "Sets the border radius of the tabs list container. Controls the roundness of corners.",
      table: {
        defaultValue: {
          summary: "md",
        },
      },
      options: ["none", "sm", "md", "lg", "xl"],
    },
    defaultValue: {
      control: "text",
      description:
        "The default selected tab value when the component is uncontrolled.",
      table: {
        defaultValue: {
          summary: "account",
        },
      },
    },
    value: {
      control: "text",
      description:
        "The controlled value of the selected tab. Use with onValueChange for controlled behavior.",
    },
    onValueChange: {
      control: false,
      description: "Callback function called when the selected tab changes.",
    },
    asChild: {
      description:
        "When true, the tabs component merges its props with the first child element instead of rendering a wrapper.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
  },
  args: {
    orientation: "horizontal",
    size: "md",
    variant: "shadcn",
    borderRadius: "md",
    defaultValue: "account",
    asChild: false,
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args} style={{width: 400}}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Account Settings</Text>
          <Text className="text-muted-foreground">
            Manage your account information and preferences.
          </Text>
        </View>
      </TabsContent>
      <TabsContent value="password">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Password</Text>
          <Text className="text-muted-foreground">
            Update your password and security settings.
          </Text>
        </View>
      </TabsContent>
      <TabsContent value="notifications">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Notifications</Text>
          <Text className="text-muted-foreground">
            Configure your notification preferences.
          </Text>
        </View>
      </TabsContent>
    </Tabs>
  ),
};

export const Variants: Story = {
  render: () => (
    <View style={{gap: 20}}>
      <View>
        <Text className="mb-2 text-sm font-medium">Shadcn Variant</Text>
        <Tabs defaultValue="account" variant="shadcn" style={{width: 400}}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <View className="p-4">
              <Text>Account content</Text>
            </View>
          </TabsContent>
          <TabsContent value="password">
            <View className="p-4">
              <Text>Password content</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium">Underlined Variant</Text>
        <Tabs defaultValue="account" variant="underlined" style={{width: 400}}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <View className="p-4">
              <Text>Account content</Text>
            </View>
          </TabsContent>
          <TabsContent value="password">
            <View className="p-4">
              <Text>Password content</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium">Outlined Variant</Text>
        <Tabs defaultValue="account" variant="outlined" style={{width: 400}}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <View className="p-4">
              <Text>Account content</Text>
            </View>
          </TabsContent>
          <TabsContent value="password">
            <View className="p-4">
              <Text>Password content</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium">Ghost Variant</Text>
        <Tabs defaultValue="account" variant="ghost" style={{width: 400}}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <View className="p-4">
              <Text>Account content</Text>
            </View>
          </TabsContent>
          <TabsContent value="password">
            <View className="p-4">
              <Text>Password content</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{gap: 20}}>
      <View>
        <Text className="mb-2 text-sm font-medium">Small Size</Text>
        <Tabs defaultValue="account" size="sm" style={{width: 400}}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <View className="p-4">
              <Text>Account content</Text>
            </View>
          </TabsContent>
          <TabsContent value="password">
            <View className="p-4">
              <Text>Password content</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium">Medium Size (Default)</Text>
        <Tabs defaultValue="account" size="md" style={{width: 400}}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <View className="p-4">
              <Text>Account content</Text>
            </View>
          </TabsContent>
          <TabsContent value="password">
            <View className="p-4">
              <Text>Password content</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium">Large Size</Text>
        <Tabs defaultValue="account" size="lg" style={{width: 400}}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <View className="p-4">
              <Text>Account content</Text>
            </View>
          </TabsContent>
          <TabsContent value="password">
            <View className="p-4">
              <Text>Password content</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium">Extra Large Size</Text>
        <Tabs defaultValue="account" size="xl" style={{width: 400}}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <View className="p-4">
              <Text>Account content</Text>
            </View>
          </TabsContent>
          <TabsContent value="password">
            <View className="p-4">
              <Text>Password content</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>
    </View>
  ),
};

export const BorderRadius: Story = {
  render: () => (
    <View style={{gap: 20}}>
      <View>
        <Text className="mb-2 text-sm font-medium">No Border Radius</Text>
        <Tabs defaultValue="account" borderRadius="none" style={{width: 400}}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <View className="p-4">
              <Text>Account content</Text>
            </View>
          </TabsContent>
          <TabsContent value="password">
            <View className="p-4">
              <Text>Password content</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium">Small Border Radius</Text>
        <Tabs defaultValue="account" borderRadius="sm" style={{width: 400}}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <View className="p-4">
              <Text>Account content</Text>
            </View>
          </TabsContent>
          <TabsContent value="password">
            <View className="p-4">
              <Text>Password content</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium">
          Medium Border Radius (Default)
        </Text>
        <Tabs defaultValue="account" borderRadius="md" style={{width: 400}}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <View className="p-4">
              <Text>Account content</Text>
            </View>
          </TabsContent>
          <TabsContent value="password">
            <View className="p-4">
              <Text>Password content</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium">Large Border Radius</Text>
        <Tabs defaultValue="account" borderRadius="lg" style={{width: 400}}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <View className="p-4">
              <Text>Account content</Text>
            </View>
          </TabsContent>
          <TabsContent value="password">
            <View className="p-4">
              <Text>Password content</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium">
          Extra Large Border Radius
        </Text>
        <Tabs defaultValue="account" borderRadius="xl" style={{width: 400}}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <View className="p-4">
              <Text>Account content</Text>
            </View>
          </TabsContent>
          <TabsContent value="password">
            <View className="p-4">
              <Text>Password content</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>
    </View>
  ),
};

export const VerticalOrientation: Story = {
  render: () => (
    <Tabs
      orientation="vertical"
      defaultValue="account"
      style={{width: 500, flexDirection: "row"}}
    >
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <View style={{flex: 1, marginLeft: 20}}>
        <TabsContent value="account">
          <View className="p-4">
            <Text className="mb-2 text-lg font-semibold">Account Settings</Text>
            <Text className="text-muted-foreground">
              Manage your account information and preferences.
            </Text>
          </View>
        </TabsContent>
        <TabsContent value="password">
          <View className="p-4">
            <Text className="mb-2 text-lg font-semibold">Password</Text>
            <Text className="text-muted-foreground">
              Update your password and security settings.
            </Text>
          </View>
        </TabsContent>
        <TabsContent value="notifications">
          <View className="p-4">
            <Text className="mb-2 text-lg font-semibold">Notifications</Text>
            <Text className="text-muted-foreground">
              Configure your notification preferences.
            </Text>
          </View>
        </TabsContent>
      </View>
    </Tabs>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="home" style={{width: 400}}>
      <TabsList>
        <TabsTrigger value="home" startContent={<Home className="h-4 w-4" />}>
          Home
        </TabsTrigger>
        <TabsTrigger
          value="account"
          startContent={<User className="h-4 w-4" />}
        >
          Account
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          startContent={<Bell className="h-4 w-4" />}
        >
          Notifications
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          startContent={<Settings className="h-4 w-4" />}
        >
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Home</Text>
          <Text className="text-muted-foreground">
            Welcome to your dashboard.
          </Text>
        </View>
      </TabsContent>
      <TabsContent value="account">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Account</Text>
          <Text className="text-muted-foreground">
            Manage your account settings.
          </Text>
        </View>
      </TabsContent>
      <TabsContent value="notifications">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Notifications</Text>
          <Text className="text-muted-foreground">
            View and manage your notifications.
          </Text>
        </View>
      </TabsContent>
      <TabsContent value="settings">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Settings</Text>
          <Text className="text-muted-foreground">
            Configure your application settings.
          </Text>
        </View>
      </TabsContent>
    </Tabs>
  ),
};

export const WithEndContent: Story = {
  render: () => (
    <Tabs defaultValue="account" style={{width: 400}}>
      <TabsList>
        <TabsTrigger
          value="account"
          endContent={
            <Text className="bg-muted rounded px-2 py-1 text-xs">3</Text>
          }
        >
          Account
        </TabsTrigger>
        <TabsTrigger
          value="password"
          endContent={
            <Text className="bg-muted rounded px-2 py-1 text-xs">1</Text>
          }
        >
          Password
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          endContent={
            <Text className="bg-muted rounded px-2 py-1 text-xs">5</Text>
          }
        >
          Notifications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Account</Text>
          <Text className="text-muted-foreground">
            You have 3 pending actions.
          </Text>
        </View>
      </TabsContent>
      <TabsContent value="password">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Password</Text>
          <Text className="text-muted-foreground">
            You have 1 security alert.
          </Text>
        </View>
      </TabsContent>
      <TabsContent value="notifications">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Notifications</Text>
          <Text className="text-muted-foreground">
            You have 5 unread notifications.
          </Text>
        </View>
      </TabsContent>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="account" style={{width: 400}}>
      <TabsList disabled>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Account</Text>
          <Text className="text-muted-foreground">
            This content is disabled.
          </Text>
        </View>
      </TabsContent>
      <TabsContent value="password">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Password</Text>
          <Text className="text-muted-foreground">
            This content is disabled.
          </Text>
        </View>
      </TabsContent>
      <TabsContent value="notifications">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Notifications</Text>
          <Text className="text-muted-foreground">
            This content is disabled.
          </Text>
        </View>
      </TabsContent>
    </Tabs>
  ),
};

export const IndividualDisabled: Story = {
  render: () => (
    <Tabs defaultValue="account" style={{width: 400}}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password" disabled>
          Password
        </TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Account</Text>
          <Text className="text-muted-foreground">
            Account settings are available.
          </Text>
        </View>
      </TabsContent>
      <TabsContent value="password">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Password</Text>
          <Text className="text-muted-foreground">
            Password tab is disabled.
          </Text>
        </View>
      </TabsContent>
      <TabsContent value="notifications">
        <View className="p-4">
          <Text className="mb-2 text-lg font-semibold">Notifications</Text>
          <Text className="text-muted-foreground">
            Notification settings are available.
          </Text>
        </View>
      </TabsContent>
    </Tabs>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("account");

    return (
      <Tabs value={value} onValueChange={setValue} style={{width: 400}}>
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <View className="p-4">
            <Text className="mb-2 text-lg font-semibold">Account</Text>
            <Text className="text-muted-foreground">Current tab: {value}</Text>
          </View>
        </TabsContent>
        <TabsContent value="password">
          <View className="p-4">
            <Text className="mb-2 text-lg font-semibold">Password</Text>
            <Text className="text-muted-foreground">Current tab: {value}</Text>
          </View>
        </TabsContent>
        <TabsContent value="notifications">
          <View className="p-4">
            <Text className="mb-2 text-lg font-semibold">Notifications</Text>
            <Text className="text-muted-foreground">Current tab: {value}</Text>
          </View>
        </TabsContent>
      </Tabs>
    );
  },
};
