import {Meta, StoryObj} from "@storybook/react-native";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../breadcrumb";
import {Text} from "react-native";

const BreadcrumbStory = ({
  disabled,
  size,
  color,
  variant,
  borderRadius,
  startContent,
  endContent,
}: {
  disabled: boolean;
  size: "sm" | "md" | "lg";
  color: "default" | "warning" | "destructive" | "success";
  variant: "shadcn" | "bordered" | "solid";
  borderRadius: "sm" | "md" | "lg" | "xl";
  startContent: React.ReactNode;
  endContent: React.ReactNode;
}) => {
  return (
    <Breadcrumb
      size={size}
      color={color}
      variant={variant}
      borderRadius={borderRadius}
    >
      <BreadcrumbList>
        <BreadcrumbItem disabled={disabled}>
          <BreadcrumbLink startContent={startContent} endContent={endContent}>
            <Text>Home</Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbEllipsis />
        <BreadcrumbSeparator />
        <BreadcrumbItem disabled={disabled}>
          <BreadcrumbLink>
            <Text>Components</Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem disabled={disabled}>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const meta: Meta<typeof BreadcrumbStory> = {
  title: "Breadcrumb",
  component: BreadcrumbStory,
  argTypes: {
    disabled: {
      control: "boolean",
      defaultValue: false,
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      defaultValue: "md",
    },
    color: {
      control: "select",
      options: ["default", "warning", "destructive", "success"],
      defaultValue: "default",
    },
    variant: {
      control: "select",
      options: ["shadcn", "bordered", "solid"],
      defaultValue: "shadcn",
    },
    borderRadius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
      defaultValue: "md",
    },
  },
};

export default meta;

export const Default: StoryObj<typeof meta> = {};

export const WithStartContent: StoryObj<typeof meta> = {
  args: {
    startContent: <Text>🏠</Text>,
  },
};

export const WithEndContent: StoryObj<typeof meta> = {
  args: {
    endContent: <Text>🏠</Text>,
  },
};
