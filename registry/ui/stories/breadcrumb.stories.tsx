import {Meta, StoryObj} from "@storybook/react-native";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbComponentProps,
  BreadcrumbLinkComponentProps,
  BreadcrumbItemComponentProps,
  BreadcrumbPageComponentProps,
  BreadcrumbSeparatorComponentProps,
  BreadcrumbEllipsisComponentProps,
} from "../breadcrumb";
import {Text} from "react-native";

const BreadcrumbStory = ({
  size,
  color,
  variant,
  borderRadius,
  asChild,
  baseClassName,
  startContent,
  endContent,
  href,
  itemDisabled,
  itemBaseClassName,
  pageAsChild,
  pageBaseClassName,
  separatorAsChild,
  separatorBaseClassName,
  separatorChildren,
  ellipsisAsChild,
  ellipsisBaseClassName,
  ellipsisChildren,
}: BreadcrumbComponentProps & {
  startContent: BreadcrumbLinkComponentProps["startContent"];
  endContent: BreadcrumbLinkComponentProps["endContent"];
  href: BreadcrumbLinkComponentProps["href"];
  itemDisabled: BreadcrumbItemComponentProps["disabled"];
  itemBaseClassName: BreadcrumbItemComponentProps["baseClassName"];
  pageAsChild: BreadcrumbPageComponentProps["asChild"];
  pageBaseClassName: BreadcrumbPageComponentProps["baseClassName"];
  separatorAsChild: BreadcrumbSeparatorComponentProps["asChild"];
  separatorBaseClassName: BreadcrumbSeparatorComponentProps["baseClassName"];
  separatorChildren: BreadcrumbSeparatorComponentProps["children"];
  ellipsisAsChild: BreadcrumbEllipsisComponentProps["asChild"];
  ellipsisBaseClassName: BreadcrumbEllipsisComponentProps["baseClassName"];
  ellipsisChildren: BreadcrumbEllipsisComponentProps["children"];
}) => {
  return (
    <Breadcrumb
      size={size}
      color={color}
      variant={variant}
      borderRadius={borderRadius}
      asChild={asChild}
      baseClassName={baseClassName}
    >
      <BreadcrumbList>
        <BreadcrumbItem
          disabled={itemDisabled}
          baseClassName={itemBaseClassName}
        >
          <BreadcrumbLink
            href={href}
            startContent={startContent}
            endContent={endContent}
          >
            <Text>Home</Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator
          asChild={separatorAsChild}
          baseClassName={separatorBaseClassName}
        >
          {separatorChildren}
        </BreadcrumbSeparator>
        <BreadcrumbEllipsis
          asChild={ellipsisAsChild}
          baseClassName={ellipsisBaseClassName}
        >
          {ellipsisChildren}
        </BreadcrumbEllipsis>
        <BreadcrumbSeparator
          asChild={separatorAsChild}
          baseClassName={separatorBaseClassName}
        >
          {separatorChildren}
        </BreadcrumbSeparator>
        <BreadcrumbItem
          disabled={itemDisabled}
          baseClassName={itemBaseClassName}
        >
          <BreadcrumbLink href="/components">
            <Text>Components</Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator
          asChild={separatorAsChild}
          baseClassName={separatorBaseClassName}
        >
          {separatorChildren}
        </BreadcrumbSeparator>
        <BreadcrumbItem
          disabled={itemDisabled}
          baseClassName={itemBaseClassName}
        >
          <BreadcrumbPage
            asChild={pageAsChild}
            baseClassName={pageBaseClassName}
          >
            Breadcrumb
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const meta: Meta<typeof BreadcrumbStory> = {
  title: "Components/Breadcrumb",
  component: BreadcrumbStory,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description:
        "Breadcrumb: The size of the breadcrumb. Controls the text size and spacing.",
      table: {
        defaultValue: {
          summary: "md",
        },
      },
    },
    color: {
      control: "select",
      options: ["default", "warning", "destructive", "success"],
      description:
        "Breadcrumb: The color variant of the breadcrumb. Affects text and hover colors.",
      table: {
        defaultValue: {
          summary: "default",
        },
      },
    },
    variant: {
      control: "select",
      options: ["shadcn", "bordered", "solid"],
      description: "Breadcrumb: The visual variant of the breadcrumb.",
      table: {
        defaultValue: {
          summary: "shadcn",
        },
      },
    },
    borderRadius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
      description: "Breadcrumb: Sets the border radius of the breadcrumb.",
      table: {
        defaultValue: {
          summary: "md",
        },
      },
    },
    asChild: {
      control: "boolean",
      description:
        "Breadcrumb: If true clones the child and passes all accessibility and functionality props to it. Available on any exported component.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    baseClassName: {
      control: "text",
      description:
        "Breadcrumb: Custom tailwind classes to apply to the base breadcrumb component. Takes priority over the className prop.",
    },
    startContent: {
      control: false,
      description:
        "BreadcrumbLink: Start content (ReactNode) to display before the link text.",
    },
    endContent: {
      control: false,
      description:
        "BreadcrumbLink: End content (ReactNode) to display after the link text.",
    },
    href: {
      control: "text",
      description:
        "BreadcrumbLink: The URL to navigate to when the link is pressed.",
      table: {
        defaultValue: {
          summary: "/",
        },
      },
    },
    itemDisabled: {
      control: "boolean",
      description: "BreadcrumbItem: Whether the breadcrumb item is disabled.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    itemBaseClassName: {
      control: "text",
      description:
        "BreadcrumbItem: Custom tailwind classes to apply to the base breadcrumb item component. Takes priority over the className prop.",
    },
    pageAsChild: {
      control: "boolean",
      description:
        "BreadcrumbPage: If true clones the child and passes all accessibility and functionality props to it. Available on any exported component.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    pageBaseClassName: {
      control: "text",
      description:
        "BreadcrumbPage: Custom tailwind classes to apply to the base breadcrumb page component. Takes priority over the className prop.",
    },
    separatorAsChild: {
      control: "boolean",
      description:
        "BreadcrumbSeparator: If true clones the child and passes all accessibility and functionality props to it. Available on any exported component.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    separatorBaseClassName: {
      control: "text",
      description:
        "BreadcrumbSeparator: Custom tailwind classes to apply to the base breadcrumb separator component. Takes priority over the className prop.",
    },
    separatorChildren: {
      control: false,
      description:
        "BreadcrumbSeparator: Custom separator content (ReactNode) to display instead of the default ChevronRightIcon.",
    },
    ellipsisAsChild: {
      control: "boolean",
      description:
        "BreadcrumbEllipsis: If true clones the child and passes all accessibility and functionality props to it. Available on any exported component.",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    ellipsisBaseClassName: {
      control: "text",
      description:
        "BreadcrumbEllipsis: Custom tailwind classes to apply to the base breadcrumb ellipsis component. Takes priority over the className prop.",
    },
    ellipsisChildren: {
      control: false,
      description:
        "BreadcrumbEllipsis: Custom ellipsis content (ReactNode) to display instead of the default MoreHorizontalIcon.",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithStartContent: Story = {
  args: {
    startContent: <Text>🏠</Text>,
  },
};

export const WithEndContent: Story = {
  args: {
    endContent: <Text>🏠</Text>,
  },
};

export const WithCustomStyling: Story = {
  args: {
    baseClassName: "bg-slate-300 p-4",
    borderRadius: "xl",
  },
};

export const WithCustomSeparator: Story = {
  args: {
    separatorChildren: <Text>→</Text>,
  },
};

export const WithCustomEllipsis: Story = {
  args: {
    ellipsisChildren: <Text>...</Text>,
  },
};

export const WithCustomItemStyling: Story = {
  args: {
    itemBaseClassName: "bg-blue-100 rounded-md p-2",
  },
};

export const WithCustomPageStyling: Story = {
  args: {
    pageBaseClassName: "text-lg font-bold text-blue-600",
  },
};
