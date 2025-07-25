import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarComponentProps,
} from "../avatar";
import {Meta, StoryObj} from "@storybook/react-native";
import {UserIcon} from "lucide-react-native";

const AVATAR_SRC = "https://picsum.photos/100";

function AvatarStory({
  size,
  radius,
  isBordered,
  isDisabled,
  baseClassName,
  showFallback,
  variant,
}: AvatarComponentProps & {showFallback?: boolean}) {
  return (
    <Avatar
      size={size}
      radius={radius}
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
      options: ["sm", "md", "lg"],
      description: "Avatar size",
      table: {defaultValue: {summary: "md"}},
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
      description: "Border radius",
      table: {defaultValue: {summary: "full"}},
    },
    isBordered: {
      control: "boolean",
      description: "Add ring border",
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
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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

export const CustomRadius: Story = {
  args: {
    radius: "lg",
    size: "lg",
  },
};

export const FallbackIcon: Story = {
  args: {
    showFallback: true,
  },
};
