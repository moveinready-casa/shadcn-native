import React, {useMemo, useState} from "react";
import {Text, View} from "react-native";
import {Meta, StoryObj} from "@storybook/react-native";
import {Slider, SliderProps} from "../slider";

type SliderStoryProps = Omit<
  SliderProps,
  "value" | "defaultValue" | "onValueChange" | "onValueCommit"
> & {
  initialValue: number;
  controlled?: boolean;
};

function SliderStory({
  initialValue,
  controlled = false,
  ...props
}: SliderStoryProps) {
  const [val, setVal] = useState<number>(initialValue);

  const sliderBindings = useMemo(() => {
    if (controlled) {
      return {
        value: [val] as number[],
        onValueChange: (next: number[]) => setVal(next[0] ?? 0),
      } as Pick<SliderProps, "value" | "onValueChange">;
    }
    return {
      defaultValue: [initialValue] as number[],
      onValueChange: (next: number[]) => setVal(next[0] ?? 0),
    } as Pick<SliderProps, "defaultValue" | "onValueChange">;
  }, [controlled, val, initialValue]);

  return (
    <View className="bg-background flex-1 items-center justify-center p-6">
      <View className="w-72">
        <Slider {...(props as SliderProps)} {...sliderBindings} />
        <Text className="text-muted-foreground mt-2 text-sm">Value: {val}</Text>
      </View>
    </View>
  );
}

const meta: Meta<typeof SliderStory> = {
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
    initialValue: {
      control: "number",
      description: "Initial value for the slider",
      table: {defaultValue: {summary: "50"}},
    },
    controlled: {
      control: "boolean",
      description: "Use controlled mode (value managed by the story)",
      table: {defaultValue: {summary: "false"}},
    },
    disabled: {
      control: "boolean",
      description: "Disables user interaction",
      table: {defaultValue: {summary: "false"}},
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
    asChild: {
      control: "boolean",
      description: "Clone props into a child component",
      table: {defaultValue: {summary: "false"}},
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
    initialValue: 50,
    controlled: false,
    disabled: false,
    orientation: "horizontal",
    inverted: false,
    min: 0,
    max: 100,
    step: 1,
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
    controlled: true,
  },
};
