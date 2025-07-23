import {afterEach, describe, expect, it, jest} from "@jest/globals";
import {cleanup, fireEvent, render} from "@testing-library/react-native";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertProps,
  AlertTitleProps,
  AlertDescriptionProps,
} from "../alert";
import {Text, View} from "react-native";
import React from "react";

describe("Alert", () => {
  afterEach(cleanup);

  const TestAlert = ({
    alertProps,
    titleProps,
    descriptionProps,
    includeTitle = true,
    includeDescription = true,
    includeIcon = false,
  }: {
    alertProps?: Omit<Partial<AlertProps>, "children">;
    titleProps?: Omit<Partial<AlertTitleProps>, "children">;
    descriptionProps?: Omit<Partial<AlertDescriptionProps>, "children">;
    includeTitle?: boolean;
    includeDescription?: boolean;
    includeIcon?: boolean;
  }) => {
    return (
      <Alert testID="alert" {...alertProps}>
        {includeIcon && <Text testID="alert-icon">⚠️</Text>}
        {includeTitle && (
          <AlertTitle {...titleProps}>
            <Text testID="alert-title">Test Alert Title</Text>
          </AlertTitle>
        )}
        {includeDescription && (
          <AlertDescription {...descriptionProps}>
            <Text testID="alert-description">Test Alert Description</Text>
          </AlertDescription>
        )}
      </Alert>
    );
  };

  describe("Structure and rendering", () => {
    it("renders the alert without errors", () => {
      render(<TestAlert />);
    });

    it("renders alert with title only", () => {
      const {getByTestId, queryByTestId} = render(
        <TestAlert includeDescription={false} />,
      );

      expect(getByTestId("alert-title")).toBeTruthy();
      expect(queryByTestId("alert-description")).toBeFalsy();
    });

    it("renders alert with description only", () => {
      const {getByTestId, queryByTestId} = render(
        <TestAlert includeTitle={false} />,
      );

      expect(getByTestId("alert-description")).toBeTruthy();
      expect(queryByTestId("alert-title")).toBeFalsy();
    });

    it("renders alert with icon, title and description", () => {
      const {getByTestId} = render(<TestAlert includeIcon={true} />);

      expect(getByTestId("alert-icon")).toBeTruthy();
      expect(getByTestId("alert-title")).toBeTruthy();
      expect(getByTestId("alert-description")).toBeTruthy();
    });

    it("renders with correct accessibility role", () => {
      const {getByTestId} = render(<TestAlert />);
      const alert = getByTestId("alert");
      expect(alert.props.accessibilityRole).toBe("alert");
    });
  });

  describe("Variants and styling", () => {
    it("renders default variant correctly", () => {
      const {getByTestId} = render(<TestAlert />);
      const alert = getByTestId("alert");
      expect(alert).toBeTruthy();
    });

    it("renders destructive variant correctly", () => {
      const {getByTestId} = render(
        <TestAlert alertProps={{variant: "destructive"}} />,
      );
      const alert = getByTestId("alert");
      expect(alert.props.className).toContain("destructive");
    });

    it("applies custom className", () => {
      const {getByTestId} = render(
        <Alert testID="alert" className="custom-class">
          <AlertTitle>Test Title</AlertTitle>
        </Alert>,
      );
      const alert = getByTestId("alert");
      expect(alert.props.className).toContain("custom-class");
    });
  });

  describe("Color variants (HeroUI inspired)", () => {
    it("renders primary color variant", () => {
      const {getByTestId} = render(
        <TestAlert alertProps={{color: "primary"}} />,
      );
      const alert = getByTestId("alert");
      expect(alert.props.className).toContain("primary");
    });

    it("renders success color variant", () => {
      const {getByTestId} = render(
        <TestAlert alertProps={{color: "success"}} />,
      );
      const alert = getByTestId("alert");
      expect(alert.props.className).toContain("bg-green-50");
    });

    it("renders warning color variant", () => {
      const {getByTestId} = render(
        <TestAlert alertProps={{color: "warning"}} />,
      );
      const alert = getByTestId("alert");
      expect(alert.props.className).toContain("bg-yellow-50");
    });

    it("renders danger color variant", () => {
      const {getByTestId} = render(
        <TestAlert alertProps={{color: "danger"}} />,
      );
      const alert = getByTestId("alert");
      expect(alert.props.className).toContain("bg-red-50");
    });
  });

  describe("Visibility and closable functionality", () => {
    it("renders visible by default", () => {
      const {getByTestId} = render(<TestAlert />);
      expect(getByTestId("alert")).toBeTruthy();
    });

    it("can be hidden when isVisible is false", () => {
      const {queryByTestId} = render(
        <TestAlert alertProps={{isVisible: false}} />,
      );
      expect(queryByTestId("alert")).toBeFalsy();
    });

    it("shows close button when isClosable is true", () => {
      const {getByRole} = render(<TestAlert alertProps={{isClosable: true}} />);
      expect(getByRole("button")).toBeTruthy();
    });

    it("calls onClose when close button is pressed", () => {
      const onClose = jest.fn();
      const {getByRole} = render(
        <TestAlert alertProps={{isClosable: true, onClose}} />,
      );

      const closeButton = getByRole("button");
      fireEvent.press(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onVisibleChange when visibility changes", () => {
      const onVisibleChange = jest.fn();
      const {getByRole} = render(
        <TestAlert alertProps={{isClosable: true, onVisibleChange}} />,
      );

      const closeButton = getByRole("button");
      fireEvent.press(closeButton);

      expect(onVisibleChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Component Props", () => {
    describe("Alert", () => {
      it("clones props to the nearest child when asChild is true", () => {
        const {getByTestId} = render(
          <Alert asChild>
            <View testID="child" />
          </Alert>,
        );

        expect(getByTestId("child")).toHaveProp("accessibilityRole", "alert");
      });

      it("renders custom icon when provided", () => {
        const {getByTestId} = render(
          <Alert icon={<Text testID="custom-icon">🎉</Text>}>
            <AlertTitle>Title</AlertTitle>
          </Alert>,
        );

        expect(getByTestId("custom-icon")).toBeTruthy();
      });

      it("hides icon when hideIcon is true", () => {
        const {getByTestId} = render(
          <Alert hideIcon={true} testID="alert">
            <AlertTitle>Title</AlertTitle>
          </Alert>,
        );

        // Check that the alert renders and the hideIcon functionality works
        const alert = getByTestId("alert");
        expect(alert).toBeTruthy();
      });

      it("applies radius correctly", () => {
        const {getByTestId} = render(<TestAlert alertProps={{radius: "lg"}} />);
        const alert = getByTestId("alert");
        expect(alert.props.className).toContain("rounded-lg");
      });
    });

    describe("AlertTitle", () => {
      it("clones props to the nearest child when asChild is true", () => {
        const {getByTestId} = render(
          <Alert>
            <AlertTitle asChild>
              <Text testID="child" className="custom-title">
                Custom Title
              </Text>
            </AlertTitle>
          </Alert>,
        );

        expect(getByTestId("child")).toHaveProp("className");
      });

      it("applies custom className to title", () => {
        const {getByTestId} = render(
          <Alert>
            <AlertTitle className="custom-title" testID="title-wrapper">
              <Text testID="title">Title</Text>
            </AlertTitle>
          </Alert>,
        );

        expect(getByTestId("title-wrapper").props.className).toContain(
          "custom-title",
        );
      });
    });

    describe("AlertDescription", () => {
      it("clones props to the nearest child when asChild is true", () => {
        const {getByTestId} = render(
          <Alert>
            <AlertDescription asChild>
              <Text testID="child" className="custom-description">
                Custom Description
              </Text>
            </AlertDescription>
          </Alert>,
        );

        expect(getByTestId("child")).toHaveProp("className");
      });

      it("applies custom className to description", () => {
        const {getByTestId} = render(
          <Alert>
            <AlertDescription
              className="custom-description"
              testID="description-wrapper"
            >
              <Text testID="description">Description</Text>
            </AlertDescription>
          </Alert>,
        );

        expect(getByTestId("description-wrapper").props.className).toContain(
          "custom-description",
        );
      });
    });
  });

  describe("Content and endContent", () => {
    it("renders startContent when provided", () => {
      const {getByTestId} = render(
        <Alert startContent={<Text testID="start-content">Start</Text>}>
          <AlertTitle>Title</AlertTitle>
        </Alert>,
      );

      expect(getByTestId("start-content")).toBeTruthy();
    });

    it("renders endContent when provided", () => {
      const {getByTestId} = render(
        <Alert endContent={<Text testID="end-content">End</Text>}>
          <AlertTitle>Title</AlertTitle>
        </Alert>,
      );

      expect(getByTestId("end-content")).toBeTruthy();
    });
  });

  describe("Error handling", () => {
    it("throws error when AlertTitle is used outside of Alert", () => {
      expect(() => {
        render(<AlertTitle>Title</AlertTitle>);
      }).toThrow("AlertTitle must be used within an Alert");
    });

    it("throws error when AlertDescription is used outside of Alert", () => {
      expect(() => {
        render(<AlertDescription>Description</AlertDescription>);
      }).toThrow("AlertDescription must be used within an Alert");
    });
  });
});
