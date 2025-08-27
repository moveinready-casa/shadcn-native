import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarComponentProps,
} from "../avatar";
import {Meta, StoryObj} from "@storybook/react-native";
import {UserIcon, View} from "lucide-react-native";

const AVATAR_SRC = "https://picsum.photos/100";

function AvatarStory({
  size,
  borderRadius,
  isBordered,
  isDisabled,
  baseClassName,
  showFallback,
  variant,
}: AvatarComponentProps & {showFallback?: boolean}) {
  return (
    <Avatar
      size={size}
      borderRadius={borderRadius}
      isBordered={isBordered}
      isDisabled={isDisabled}
      baseClassName={baseClassName}
      variant={variant}
    >
      <AvatarImage source={{uri: showFallback ? undefined : AVATAR_SRC}} />
      <AvatarFallback>
        <UserIcon className="text-foreground" />
      </AvatarFallback>
    </Avatar>
  );
}

const meta: Meta<typeof AvatarStory> = {
  title: "Avatar",
  component: AvatarStory,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Avatar size: presets for width/height and font-size.",
      table: {defaultValue: {summary: "md"}},
    },
    borderRadius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl", "full"],
      description: "Border radius",
      table: {defaultValue: {summary: "full"}},
    },
    isBordered: {
      control: "boolean",
      description: "Adds a theme-colored 2-pixel ring around the avatar.",
      table: {defaultValue: {summary: "false"}},
    },
    isDisabled: {
      control: "boolean",
      description: "Disabled state",
      table: {defaultValue: {summary: "false"}},
    },
    baseClassName: {
      control: "text",
      description: "Custom Tailwind classes for base element.",
    },
    variant: {
      control: "select",
      options: ["shadcn", "warning", "error", "success"],
      description: "Avatar variant",
      table: {defaultValue: {summary: "shadcn"}},
    },
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <AvatarStory size="sm" />
      <AvatarStory size="md" />
      <AvatarStory size="lg" />
      <AvatarStory size="xl" />
    </View>
  ),
};

export const BorderRadius: Story = {
  render: () => (
    <View style={{gap: 12}}>
      <AvatarStory borderRadius="none" />
      <AvatarStory borderRadius="sm" />
      <AvatarStory borderRadius="md" />
      <AvatarStory borderRadius="lg" />
      <AvatarStory borderRadius="xl" />
      <AvatarStory borderRadius="full" />
    </View>
  ),
};

export const Bordered: Story = {
  args: {
    isBordered: true,
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const FallbackIcon: Story = {
  args: {
    showFallback: true,
  },
};
