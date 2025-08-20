import {Meta, StoryObj} from "@storybook/react-native";
import {RangeSlider, Slider} from "../slider";
import {View} from "react-native";

function SliderStory({...props}) {
  return (
    <View className="w-72">
      <Slider {...props} />
    </View>
  );
}
const meta: Meta<typeof Slider> = {
  title: "Slider",
  component: SliderStory,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A slider component for selecting a value within a range. Supports controlled and uncontrolled usage.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size variant of the slider",
      table: {defaultValue: {summary: "md"}},
    },
    borderRadius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
      description: "The border radius of the thumb",
      table: {defaultValue: {summary: "full"}},
    },
    disabled: {
      control: "boolean",
      description: "Disables user interaction",
      table: {defaultValue: {summary: "false"}},
    },
    color: {
      control: "select",
      options: ["default", "secondary", "destructive", "warning", "success"],
      description: "The color variant of the slider",
      table: {defaultValue: {summary: "default"}},
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "The orientation of the slider",
      table: {defaultValue: {summary: "horizontal"}},
    },
    inverted: {
      control: "boolean",
      description: "Whether the slider is visually inverted",
      table: {defaultValue: {summary: "false"}},
    },
    min: {
      control: "number",
      description: "The minimum value",
      table: {defaultValue: {summary: "0"}},
    },
    max: {
      control: "number",
      description: "The maximum value",
      table: {defaultValue: {summary: "100"}},
    },
    step: {
      control: "number",
      description: "The stepping interval",
      table: {defaultValue: {summary: "1"}},
    },
    dir: {
      control: "select",
      options: ["ltr", "rtl"],
      description: "Reading direction",
    },
    name: {
      control: "text",
      description: "Form name attribute",
    },
    form: {
      control: "text",
      description: "Form ID",
    },
    minStepsBetweenThumbs: {
      control: "number",
      description: "Minimum steps between thumbs (for multi-thumb semantics)",
      table: {defaultValue: {summary: "0"}},
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
    orientation: "horizontal",
  },
};

export const Vertical: Story = {
  args: {
    ...Default.args,
    orientation: "vertical",
  },
};

export const Controlled: Story = {
  args: {
    ...Default.args,
    value: [50],
  },
};

export const Range: Story = {
  render: () => (
    <View className="m-auto h-full w-72">
      <RangeSlider />
    </View>
  ),
  args: {},
};

export const Secondary: Story = {
  args: {
    ...Default.args,
    color: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    ...Default.args,
    color: "destructive",
  },
};

export const Warning: Story = {
  args: {
    ...Default.args,
    color: "warning",
  },
};

export const Success: Story = {
  args: {
    ...Default.args,
    color: "success",
  },
};

export const Small: Story = {
  args: {
    ...Default.args,
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    ...Default.args,
    size: "md",
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: "lg",
  },
};

export const RoundedNone: Story = {
  args: {
    ...Default.args,
    borderRadius: "none",
  },
};

export const RoundedSmall: Story = {
  args: {
    ...Default.args,
    borderRadius: "sm",
  },
};

export const RoundedMedium: Story = {
  args: {
    ...Default.args,
    borderRadius: "md",
  },
};

export const RoundedLarge: Story = {
  args: {
    ...Default.args,
    borderRadius: "lg",
  },
};

export const RoundedFull: Story = {
  args: {
    ...Default.args,
    borderRadius: "full",
  },
};
