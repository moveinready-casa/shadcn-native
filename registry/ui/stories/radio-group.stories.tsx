import React from "react";
import {Text, View} from "react-native";
import {Meta, StoryObj} from "@storybook/react-native";
import {
  RadioGroup,
  RadioGroupComponentProps,
  RadioGroupItem,
} from "../radio-group";

function RadioGroupStory({
  asChild,
  baseClassName,
  value,
  defaultValue,
  onValueChange,
  disabled,
  name,
  required,
  orientation,
  dir,
  loop,
  itemBDisabled,
  itemCDisabled,
}: RadioGroupComponentProps & {
  itemBDisabled?: boolean;
  itemCDisabled?: boolean;
}) {
  const content = (
    <>
      <RadioGroupItem value="apple">
        <Text>Apple</Text>
      </RadioGroupItem>
      <RadioGroupItem value="banana" disabled={itemBDisabled}>
        <Text>Banana</Text>
      </RadioGroupItem>
      <RadioGroupItem value="cherry" disabled={itemCDisabled}>
        <Text>Cherry</Text>
      </RadioGroupItem>
    </>
  );

  return (
    <RadioGroup
      asChild={asChild}
      baseClassName={baseClassName}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
      required={required}
      orientation={orientation}
      dir={dir}
      loop={loop}
      className="w-full"
    >
      {asChild ? <View>{content}</View> : content}
    </RadioGroup>
  );
}

const meta: Meta<typeof RadioGroupStory> = {
  title: "RadioGroup",
  component: RadioGroupStory,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      description: "The orientation of the component.",
      table: {defaultValue: {summary: "vertical"}},
    },
    disabled: {
      control: "boolean",
      description: "When true, prevents the user from interacting with items.",
      table: {defaultValue: {summary: "false"}},
    },
    required: {
      control: "boolean",
      description:
        "When true, indicates that the user must check an item before submit.",
      table: {defaultValue: {summary: "false"}},
    },
    name: {
      control: "text",
      description: "The name of the group (forwarded).",
    },
    dir: {
      control: "select",
      options: ["ltr", "rtl"],
      description:
        "Reading direction of the radio group. If omitted, assumes LTR.",
    },
    loop: {
      control: "boolean",
      description:
        "When true, keyboard navigation will loop from last to first item.",
      table: {defaultValue: {summary: "true"}},
    },
    value: {
      control: "text",
      description:
        "The controlled value of the radio item to check. Use with onValueChange.",
    },
    defaultValue: {
      control: "text",
      description:
        "The value of the radio item that should be checked when initially rendered.",
    },
    onValueChange: {
      control: false,
      description: "Event handler called when the value changes.",
    },
    asChild: {
      control: "boolean",
      description:
        "If true clones the child and passes all accessibility and functionality props to it.",
      table: {defaultValue: {summary: "false"}},
    },
    baseClassName: {
      control: "text",
      description: "Custom tailwind classes to apply to the group container.",
    },
    itemBDisabled: {
      control: "boolean",
      description: "Disable the Banana item.",
    },
    itemCDisabled: {
      control: "boolean",
      description: "Disable the Cherry item.",
    },
  },
  args: {
    orientation: "vertical",
    disabled: false,
    required: false,
    asChild: false,
    itemBDisabled: false,
    itemCDisabled: false,
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: {orientation: "horizontal"},
};

export const Controlled: Story = {
  args: {value: "banana"},
};

export const DefaultValue: Story = {
  args: {defaultValue: "cherry"},
};

export const DisabledGroup: Story = {
  args: {disabled: true},
};

export const ItemDisabled: Story = {
  args: {itemBDisabled: true},
};
