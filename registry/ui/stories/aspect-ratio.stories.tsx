import {Meta, StoryObj} from "@storybook/react-native";
import {AspectRatio, AspectRatioProps} from "../aspect-ratio";
import {Image} from "react-native";

function AspectRatioStory({ratio, asChild, baseClassName}: AspectRatioProps) {
  return (
    <AspectRatio
      ratio={ratio}
      asChild={asChild}
      baseClassName={baseClassName}
      className="bg-muted w-[400px] overflow-hidden rounded-lg"
    >
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80",
        }}
        resizeMode="cover"
        className="h-full w-full"
      />
    </AspectRatio>
  );
}

const meta: Meta<typeof AspectRatioStory> = {
  title: "AspectRatio",
  component: AspectRatioStory,
  argTypes: {
    ratio: {
      control: "number",
      description: "Desired aspect ratio (width / height).",
      table: {
        defaultValue: {summary: "1 / 1"},
      },
    },
    asChild: {
      control: "boolean",
      description:
        "If true clones the child and passes all layout props to it.",
      table: {
        defaultValue: {summary: "false"},
      },
    },
    baseClassName: {
      control: "text",
      description: "Custom tailwind classes to apply to the base component.",
    },
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ratio: 16 / 9,
  },
};
