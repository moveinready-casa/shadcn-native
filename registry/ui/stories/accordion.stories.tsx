import {Text} from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionComponentProps,
  AccordionTrigger,
} from "../accordion";
import {Meta, StoryObj} from "@storybook/react-native";

function AccordionStory({
  asChild,
  type,
  collapsible,
  disabled,
  loading,
  value,
  defaultValue,
  borderRadius,
  compact,
  variant,
}: AccordionComponentProps) {
  return (
    <Accordion
      asChild={asChild}
      type={type}
      collapsible={collapsible}
      disabled={disabled}
      loading={loading}
      value={value}
      defaultValue={defaultValue}
      compact={compact}
      variant={variant}
      borderRadius={borderRadius}
      className="w-full"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Product Information</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <Text>
            Our flagship product combines cutting-edge technology with sleek
            design. Built with premium materials, it offers unparalleled
            performance and reliability.
          </Text>
          <Text>
            Key features include advanced processing capabilities, and an
            intuitive user interface designed for both beginners and experts.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Shipping Details</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <Text>
            We offer worldwide shipping through trusted courier partners.
            Standard delivery takes 3-5 business days, while express shipping
            ensures delivery within 1-2 business days.
          </Text>
          <Text>
            All orders are carefully packaged and fully insured. Track your
            shipment in real-time through our dedicated tracking portal.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Return Policy</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <Text>
            We stand behind our products with a comprehensive 30-day return
            policy. If you&apos;re not completely satisfied, simply return the
            item in its original condition.
          </Text>
          <Text>
            Our hassle-free return process includes free return shipping and
            full refunds processed within 48 hours of receiving the returned
            item.
          </Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

const meta: Meta<typeof AccordionStory> = {
  title: "Accordion",
  component: AccordionStory,
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
    },
    collapsible: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    loading: {
      control: "boolean",
    },
    defaultValue: {
      control: "text",
    },
    compact: {
      control: "boolean",
    },
    variant: {
      control: "select",
      options: ["shadcn", "shadow", "bordered", "splitted"],
    },
    borderRadius: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Controlled: Story = {
  args: {
    value: "item-1",
  },
};
