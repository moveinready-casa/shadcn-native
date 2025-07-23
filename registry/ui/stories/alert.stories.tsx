import {Text, View} from "react-native";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertComponentProps,
  AlertTitleProps,
  AlertDescriptionProps,
} from "../alert";
import {Meta, StoryObj} from "@storybook/react-native";
import {
  InfoIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
} from "lucide-react-native";

function AlertStory({
  variant,
  color,
  radius,
  isVisible,
  isClosable,
  hideIcon,
  hideIconWrapper,
  icon,
  startContent,
  endContent,
  onClose,
  onVisibleChange,
  asChild,
  baseClassName,
}: AlertComponentProps & {
  icon?: AlertComponentProps["icon"];
  startContent?: AlertComponentProps["startContent"];
  endContent?: AlertComponentProps["endContent"];
}) {
  return (
    <Alert
      asChild={asChild}
      baseClassName={baseClassName}
      variant={variant}
      color={color}
      radius={radius}
      isVisible={isVisible}
      isClosable={isClosable}
      hideIcon={hideIcon}
      hideIconWrapper={hideIconWrapper}
      icon={icon}
      startContent={startContent}
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
      options: ["default", "destructive"],
    },
    color: {
      control: "select",
      description: "The color of the alert (HeroUI inspired).",
      table: {
        defaultValue: {
          summary: "default",
        },
      },
      options: [
        "default",
        "primary",
        "secondary",
        "success",
        "warning",
        "danger",
      ],
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
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
    hideIconWrapper: {
      control: "boolean",
      description: "Whether to hide the icon wrapper.",
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
    startContent: {
      control: false,
      description: "Content to display at the start of the alert.",
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
    color: "success",
  },
};

export const Warning: Story = {
  args: {
    color: "warning",
  },
};

export const Danger: Story = {
  args: {
    color: "danger",
  },
};

export const Primary: Story = {
  args: {
    color: "primary",
  },
};

export const Secondary: Story = {
  args: {
    color: "secondary",
  },
};

export const WithCustomIcon: Story = {
  args: {
    icon: <CheckCircle2Icon />,
    color: "success",
  },
};

export const Closable: Story = {
  args: {
    isClosable: true,
  },
};

export const WithStartContent: Story = {
  args: {
    startContent: <Text className="text-xs font-semibold">NOTICE:</Text>,
  },
};

export const WithEndContent: Story = {
  args: {
    endContent: (
      <View className="ml-auto">
        <Text className="text-xs underline">Learn more</Text>
      </View>
    ),
  },
};

export const HiddenIcon: Story = {
  args: {
    hideIcon: true,
  },
};

export const RoundedFull: Story = {
  args: {
    radius: "full",
  },
};

export const WithCustomStyling: Story = {
  args: {
    baseClassName: "bg-purple-50 border-purple-200 text-purple-900",
    radius: "xl",
  },
};

export const Complex: Story = {
  render: () => (
    <View className="flex w-full flex-col gap-4">
      <Alert>
        <InfoIcon />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          This is a general information alert with default styling.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please check your input and try again.
        </AlertDescription>
      </Alert>

      <Alert color="success" isClosable>
        <CheckCircle2Icon />
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>

      <Alert color="warning" isClosable>
        <AlertTriangleIcon />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Please review your settings before proceeding.
        </AlertDescription>
      </Alert>
    </View>
  ),
};
