import {Checkbox} from "../checkbox";
import {Meta, StoryObj} from "@storybook/react-native";

const meta: Meta<typeof Checkbox> = {
  title: "Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      description: "Sets the size of the checkbox. Controls height and width.",
      table: {
        defaultValue: {
          summary: "md",
        },
      },
      options: ["sm", "md", "lg", "xl"],
    },
    color: {
      control: "select",
      description: "Sets the color theme of the checkbox when checked.",
      table: {
        defaultValue: {
          summary: "primary",
        },
      },
      options: ["primary", "secondary", "success", "warning", "destructive"],
    },
    radius: {
      control: "select",
      description:
        "Sets the border radius of the checkbox. Controls the roundness of corners.",
      table: {
        defaultValue: {
          summary: "md",
        },
      },
      options: ["none", "sm", "md", "lg", "full"],
    },
    disabled: {
      control: "boolean",
      description:
        "Whether the checkbox is disabled. Reduces opacity and prevents interaction.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    loading: {
      control: "boolean",
      description:
        "Whether the checkbox is in a loading state. Shows pulse animation.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    checked: {
      control: "select",
      options: ["indeterminate", true, false],
      description:
        "Whether the checkbox is checked. Use this for controlled state.",
    },
    defaultChecked: {
      control: "select",
      options: ["indeterminate", true, false],
      description:
        "Whether the checkbox is checked by default. Use this for uncontrolled state.",
    },
    onCheckedChange: {
      control: false,
      description: "Callback function called when the checkbox state changes.",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the checkbox.",
    },
    animation: {
      control: "select",
      options: ["shadcn", "enhanced"],
      description: "Sets the animation of the checkbox.",
    },
  },
  args: {
    size: "md",
    color: "primary",
    radius: "md",
    disabled: false,
    loading: false,
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
