import {Text} from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionComponentProps,
  AccordionTrigger,
  AccordionTriggerProps,
  AccordionContentProps,
} from "../accordion";
import {Meta, StoryObj} from "@storybook/react-native";
import {Home, Laptop} from "lucide-react-native";

function AccordionStory({
  type,
  collapsible,
  disabled,
  loading,
  borderRadius,
  compact,
  variant,
  startContent,
  indicator,
  asChild,
  baseClassName,
  indicatorIconClassName,
  contentClassName,
  textClassName,
  value,
  onValueChange,
  defaultValue,
}: AccordionComponentProps & {
  startContent: AccordionTriggerProps["startContent"];
  indicator: AccordionTriggerProps["indicator"];
  indicatorIconClassName: AccordionTriggerProps["indicatorIconClassName"];
  contentClassName: AccordionTriggerProps["className"];
  textClassName: AccordionContentProps["textClassName"];
}) {
  return (
    <Accordion
      asChild={asChild}
      baseClassName={baseClassName}
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
      onValueChange={onValueChange}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger
          startContent={startContent}
          indicator={indicator}
          indicatorIconClassName={indicatorIconClassName}
          contentClassName={contentClassName}
        >
          Product Information
        </AccordionTrigger>
        <AccordionContent
          className="flex flex-col gap-4 text-balance"
          textClassName={textClassName}
        >
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
        <AccordionTrigger
          startContent={startContent}
          indicator={indicator}
          indicatorIconClassName={indicatorIconClassName}
          contentClassName={contentClassName}
        >
          Shipping Details
        </AccordionTrigger>
        <AccordionContent
          className="flex flex-col gap-4 text-balance"
          textClassName={textClassName}
        >
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
        <AccordionTrigger
          startContent={startContent}
          indicator={indicator}
          indicatorIconClassName={indicatorIconClassName}
          contentClassName={contentClassName}
        >
          Return Policy
        </AccordionTrigger>
        <AccordionContent
          className="flex flex-col gap-4 text-balance"
          textClassName={textClassName}
        >
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
      description:
        "The type of accordion to render. Single only allows one item to be expanded at a time, multiple allows any number of items to be expanded at a time. Use on the top level `Accordion` component.",
      table: {
        defaultValue: {
          summary: "single",
        },
      },
      options: ["single", "multiple"],
    },
    collapsible: {
      control: "boolean",
      description:
        "Whether an accordion item can be collapsed manually. Use on the top level `Accordion` component.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    disabled: {
      control: "boolean",
      description:
        "Whether all accordion items are disabled. Available on the top level `Accordion` component and on the `AccordionItem` component.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    loading: {
      control: "boolean",
      description:
        "Whether all accordion items are loading. Available on the top level `Accordion` component and on the `AccordionItem` component.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    borderRadius: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Sets the border radius of the accordion.",
      table: {
        defaultValue: {
          summary: "md",
        },
      },
    },
    compact: {
      control: "boolean",
      description: "Whether the accordion is in compact mode.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    variant: {
      control: "select",
      options: ["shadcn", "shadow", "bordered", "splitted"],
      description: "Sets the variant of the accordion.",
      table: {
        defaultValue: {
          summary: "shadcn",
        },
      },
    },
    startContent: {
      control: false,
      description:
        "Start content (ReactNode) to display in accordion triggers.",
    },
    indicator: {
      control: false,
      description:
        "Function that returns custom indicator ReactNode: (isExpanded: boolean) => React.ReactNode.",
    },
    asChild: {
      control: "boolean",
      description:
        "If true clones the child and passes all accesibility and functionality props to it. Avalible on any exported component.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    baseClassName: {
      control: "text",
      description:
        "Custom tailwind classes to apply to the base accordion component.",
    },
    indicatorIconClassName: {
      control: "text",
      description: "Custom tailwind classes to apply to the indicator icon.",
    },
    contentClassName: {
      control: "text",
      description: "Custom tailwind classes to apply to the accordion content.",
    },
    textClassName: {
      control: "text",
      description: "Custom tailwind classes to apply to the trigger text.",
    },
    value: {
      control: "text",
      description:
        "Controlled value for the accordion (which items are expanded).",
    },
    onValueChange: {
      control: false,
      description: "Callback function called when the accordion value changes.",
    },
    defaultValue: {
      control: "text",
      description: "Sets uncontrolled default values for accordion items.",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Controlled: Story = {
  args: {
    value: "item-1",
  },
};

export const DefaultValue: Story = {
  args: {
    defaultValue: "item-1",
  },
};

export const WithStartContent: Story = {
  args: {
    startContent: <Laptop />,
  },
};

export const WithCustomIndicator: Story = {
  args: {
    indicator: () => <Home />,
  },
};

export const WithCustomStyling: Story = {
  args: {
    baseClassName: "bg-slate-300",
    borderRadius: "xl",
    indicatorIconClassName: "bg-slate-100 rounded-full p-4",
    textClassName: "text-lg font-bold text-blue-600",
  },
};
