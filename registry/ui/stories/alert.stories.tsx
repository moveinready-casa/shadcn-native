import {Text, View} from "react-native";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertComponentProps,
} from "../alert";
import {Meta, StoryObj} from "@storybook/react-native";
import {HomeIcon} from "lucide-react-native";

function AlertStory({
  variant,
  radius,
  isVisible,
  isClosable,
  hideIcon,
  icon,
  endContent,
  onClose,
  onVisibleChange,
  asChild,
  baseClassName,
}: AlertComponentProps & {
  icon?: AlertComponentProps["icon"];
  endContent?: AlertComponentProps["endContent"];
}) {
  return (
    <Alert
      asChild={asChild}
      baseClassName={baseClassName}
      variant={variant}
      radius={radius}
      isVisible={isVisible}
      isClosable={isClosable}
      hideIcon={hideIcon}
      icon={icon}
      endContent={endContent}
      onClose={onClose}
      onVisibleChange={onVisibleChange}
      className="w-full"
    >
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the cli.
      </AlertDescription>
    </Alert>
  );
}

const meta: Meta<typeof AlertStory> = {
  title: "Alert",
  component: AlertStory,
  argTypes: {
    variant: {
      control: "select",
      description: "The variant of the alert.",
      table: {
        defaultValue: {
          summary: "default",
        },
      },
      options: ["default", "destructive", "success", "warning"],
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
      description: "Sets the border radius of the alert.",
      table: {
        defaultValue: {
          summary: "lg",
        },
      },
    },
    isVisible: {
      control: "boolean",
      description: "Whether the alert is visible.",
      table: {
        defaultValue: {
          summary: "true",
        },
      },
    },
    isClosable: {
      control: "boolean",
      description: "Whether the alert can be closed.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    hideIcon: {
      control: "boolean",
      description: "Whether to hide the icon.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    icon: {
      control: false,
      description: "Custom icon to display.",
    },
    endContent: {
      control: false,
      description: "Content to display at the end of the alert.",
    },
    onClose: {
      control: false,
      description: "Callback function called when the alert is closed.",
    },
    onVisibleChange: {
      control: false,
      description: "Callback function called when the visibility changes.",
    },
    asChild: {
      control: "boolean",
      description:
        "If true clones the child and passes all accessibility and functionality props to it. Available on any exported component.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    baseClassName: {
      control: "text",
      description:
        "Custom tailwind classes to apply to the base alert component.",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
  },
};

export const WithCustomIcon: Story = {
  args: {
    icon: <HomeIcon className="text-red-500" />,
    variant: "success",
  },
};

export const Closable: Story = {
  args: {
    isClosable: true,
  },
};

export const WithEndContent: Story = {
  args: {
    endContent: (
      <View className="ml-auto">
        <Text className="text-card-foreground text-xs underline">
          Learn more
        </Text>
      </View>
    ),
  },
};

export const HiddenIcon: Story = {
  args: {
    hideIcon: true,
  },
};

export const WithCustomStyling: Story = {
  args: {
    baseClassName: "bg-purple-300 border-purple-50 text-purple-900",
    radius: "lg",
  },
};
