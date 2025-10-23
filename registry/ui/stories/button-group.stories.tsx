import React from "react";
import {View, TextInput} from "react-native";
import {Meta, StoryObj} from "@storybook/react-native";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "../button-group";
import {Button} from "../button";
import {ChevronDown, Search, Mail, Phone} from "lucide-react-native";

const meta: Meta<typeof ButtonGroup> = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Layout direction of the button group.",
      table: {
        defaultValue: {summary: "horizontal"},
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "icon"],
      description: "Size to apply to all buttons in the group.",
      table: {
        defaultValue: {summary: "undefined (uses individual button sizes)"},
      },
    },
    disabled: {
      control: "boolean",
      description: "If true, disables all buttons in the group.",
      table: {
        defaultValue: {summary: "false"},
      },
    },
    loading: {
      control: "boolean",
      description: "If true, sets all buttons in the group to loading state.",
      table: {
        defaultValue: {summary: "false"},
      },
    },
    nested: {
      control: "boolean",
      description:
        "If true, adds gap between child groups. Auto-detected if children contain ButtonGroups.",
      table: {
        defaultValue: {summary: "false (auto-detected)"},
      },
    },
    asChild: {
      control: "boolean",
      description:
        "If true, merges props with first child element instead of rendering wrapper.",
      table: {
        defaultValue: {summary: "false"},
      },
    },
    baseClassName: {
      control: "text",
      description:
        "Custom tailwind classes applied to the base group component. Takes priority over className.",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the button group.",
    },
    "aria-label": {
      control: "text",
      description: "Accessible label for the button group.",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Button 1</Button>
      <Button variant="outline">Button 2</Button>
      <Button variant="outline">Button 3</Button>
    </ButtonGroup>
  ),
};

export const Connected: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <ButtonGroup>
        <Button>Connected</Button>
        <Button>Buttons</Button>
        <Button>Example</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="outline">Outline</Button>
        <Button variant="outline">Variant</Button>
        <Button variant="outline">Group</Button>
      </ButtonGroup>
    </View>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Button 1</Button>
      <Button variant="outline">Button 2</Button>
      <Button variant="outline">Button 3</Button>
    </ButtonGroup>
  ),
};

export const WithSeparator: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="ghost">Cut</Button>
      <Button variant="ghost">Copy</Button>
      <ButtonGroupSeparator />
      <Button variant="ghost">Paste</Button>
    </ButtonGroup>
  ),
};

export const SplitButton: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Save</Button>
      <ButtonGroupSeparator />
      <Button size="icon">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  ),
};

export const DifferentVariants: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <ButtonGroup>
        <Button variant="default">Button 1</Button>
        <Button variant="default">Button 2</Button>
        <Button variant="default">Button 3</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="outline">Button 1</Button>
        <Button variant="outline">Button 2</Button>
        <Button variant="outline">Button 3</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="ghost">Button 1</Button>
        <Button variant="ghost">Button 2</Button>
        <Button variant="ghost">Button 3</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="secondary">Button 1</Button>
        <Button variant="secondary">Button 2</Button>
        <Button variant="secondary">Button 3</Button>
      </ButtonGroup>
    </View>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <ButtonGroup size="sm">
        <Button variant="outline">Small</Button>
        <Button variant="outline">Small</Button>
        <Button variant="outline">Small</Button>
      </ButtonGroup>

      <ButtonGroup size="md">
        <Button variant="outline">Medium</Button>
        <Button variant="outline">Medium</Button>
        <Button variant="outline">Medium</Button>
      </ButtonGroup>

      <ButtonGroup size="lg">
        <Button variant="outline">Large</Button>
        <Button variant="outline">Large</Button>
        <Button variant="outline">Large</Button>
      </ButtonGroup>

      <ButtonGroup size="xl">
        <Button variant="outline">Extra Large</Button>
        <Button variant="outline">Extra Large</Button>
        <Button variant="outline">Extra Large</Button>
      </ButtonGroup>
    </View>
  ),
};

export const GroupSize: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <ButtonGroup size="sm">
        <Button>Small Group</Button>
        <Button>Button 2</Button>
        <Button>Button 3</Button>
      </ButtonGroup>

      <ButtonGroup size="lg">
        <Button>Large Group</Button>
        <Button>Button 2</Button>
        <Button>Button 3</Button>
      </ButtonGroup>
    </View>
  ),
};

export const WithText: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>Search:</ButtonGroupText>
      <Button variant="outline">Search</Button>
    </ButtonGroup>
  ),
};

export const InputGroup: Story = {
  render: () => (
    <View style={{width: 300}}>
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <View className="border-input bg-background flex-1 justify-center border px-3">
          <TextInput
            placeholder="Search..."
            className="text-foreground text-sm"
            placeholderTextColor="#999"
          />
        </View>
        <Button>Go</Button>
      </ButtonGroup>
    </View>
  ),
};

export const NestedGroups: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Copy</Button>
        <Button variant="outline">Cut</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Undo</Button>
        <Button variant="outline">Redo</Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
};

export const NestedGroupsVertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <ButtonGroup>
        <Button variant="outline">Copy</Button>
        <Button variant="outline">Cut</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Undo</Button>
        <Button variant="outline">Redo</Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
};

export const WithDisabledButtons: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <ButtonGroup>
        <Button>Active</Button>
        <Button disabled>Individual Disabled</Button>
        <Button>Active</Button>
      </ButtonGroup>

      <ButtonGroup disabled>
        <Button>All Disabled</Button>
        <Button>All Disabled</Button>
        <Button>All Disabled</Button>
      </ButtonGroup>
    </View>
  ),
};

export const WithLoadingButtons: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <ButtonGroup>
        <Button>Save</Button>
        <Button loading>Individual Loading</Button>
        <Button>Cancel</Button>
      </ButtonGroup>

      <ButtonGroup loading>
        <Button>All Loading</Button>
        <Button>All Loading</Button>
        <Button>All Loading</Button>
      </ButtonGroup>
    </View>
  ),
};

export const MixedStates: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <ButtonGroupSeparator />
      <Button loading>Loading</Button>
      <Button>Normal</Button>
    </ButtonGroup>
  ),
};

export const GroupDisabled: Story = {
  render: () => (
    <ButtonGroup disabled>
      <Button variant="outline">Disabled 1</Button>
      <Button variant="outline">Disabled 2</Button>
      <Button variant="outline">Disabled 3</Button>
    </ButtonGroup>
  ),
};

export const GroupLoading: Story = {
  render: () => (
    <ButtonGroup loading>
      <Button>Loading 1</Button>
      <Button>Loading 2</Button>
      <Button>Loading 3</Button>
    </ButtonGroup>
  ),
};

export const Toolbar: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline" size="icon">
        <Mail className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Phone className="h-4 w-4" />
      </Button>
      <ButtonGroupSeparator />
      <Button variant="outline" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  ),
};

export const VerticalWithSeparator: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Option 1</Button>
      <ButtonGroupSeparator orientation="horizontal" />
      <Button variant="outline">Option 2</Button>
      <ButtonGroupSeparator orientation="horizontal" />
      <Button variant="outline">Option 3</Button>
    </ButtonGroup>
  ),
};

export const SplitButtonWithDropdown: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <ButtonGroup>
        <Button>
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </Button>
        <ButtonGroupSeparator />
        <Button size="icon">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="destructive">Delete</Button>
        <ButtonGroupSeparator />
        <Button variant="destructive" size="icon">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="outline">More Actions</Button>
        <ButtonGroupSeparator />
        <Button variant="outline" size="icon">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </ButtonGroup>
    </View>
  ),
};

export const FullWidthGroup: Story = {
  render: () => (
    <View style={{width: "100%", maxWidth: 400}}>
      <ButtonGroup>
        <Button fullWidth>Button 1</Button>
        <Button fullWidth>Button 2</Button>
        <Button fullWidth>Button 3</Button>
      </ButtonGroup>
    </View>
  ),
};

export const WithCustomStyles: Story = {
  render: () => (
    <ButtonGroup className="gap-2">
      <Button variant="outline">Button 1</Button>
      <Button variant="outline">Button 2</Button>
      <Button variant="outline">Button 3</Button>
    </ButtonGroup>
  ),
};

export const ResponsiveExample: Story = {
  render: () => (
    <View style={{gap: 12, width: "100%"}}>
      <ButtonGroup>
        <Button fullWidth variant="outline">
          Left
        </Button>
        <Button fullWidth variant="outline">
          Center
        </Button>
        <Button fullWidth variant="outline">
          Right
        </Button>
      </ButtonGroup>
    </View>
  ),
};
