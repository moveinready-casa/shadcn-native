import React from "react";
import {View} from "react-native";
import {Meta, StoryObj} from "@storybook/react-native";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemTitle,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../select";

function SelectStory() {
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);

  const options = [
    {label: "Apple", value: "apple", group: "fruits"},
    {label: "Banana", value: "banana", group: "fruits"},
    {label: "Orange", value: "orange", group: "fruits"},
    {label: "Carrot", value: "carrot", group: "vegetables"},
    {label: "Broccoli", value: "broccoli", group: "vegetables"},
    {label: "Spinach", value: "spinach", group: "vegetables"},
  ];

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <View className="w-full flex-1 items-center justify-center p-6">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit">
            {selectedOption && selectedOption.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem key="apple" onSelect={() => setSelectedValue("apple")}>
              <SelectItemTitle>Apple</SelectItemTitle>
            </SelectItem>
            <SelectItem
              key="banana"
              onSelect={() => setSelectedValue("banana")}
            >
              <SelectItemTitle>Banana</SelectItemTitle>
            </SelectItem>
            <SelectItem
              key="orange"
              onSelect={() => setSelectedValue("orange")}
            >
              <SelectItemTitle>Orange</SelectItemTitle>
            </SelectItem>
          </SelectGroup>

          <SelectSeparator />

          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            <SelectItem
              key="carrot"
              onSelect={() => setSelectedValue("carrot")}
            >
              <SelectItemTitle>Carrot</SelectItemTitle>
            </SelectItem>
            <SelectItem
              key="broccoli"
              onSelect={() => setSelectedValue("broccoli")}
            >
              <SelectItemTitle>Broccoli</SelectItemTitle>
            </SelectItem>
            <SelectItem
              key="spinach"
              onSelect={() => setSelectedValue("spinach")}
            >
              <SelectItemTitle>Spinach</SelectItemTitle>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </View>
  );
}

const meta: Meta<typeof SelectStory> = {
  title: "Components/Select",
  component: SelectStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
