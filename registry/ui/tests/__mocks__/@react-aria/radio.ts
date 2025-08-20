import {jest} from "@jest/globals";

export const useRadioGroup = jest.fn((props?: Record<string, unknown>) => {
  const name = (props?.name as string) ?? "";
  const isRequired = Boolean(props?.isRequired);
  const orientation = (props?.orientation as string) ?? "vertical";

  return {
    radioGroupProps: {
      role: "radiogroup",
      name,
      required: isRequired,
      "aria-orientation": orientation,
    } as Record<string, unknown>,
    labelProps: {} as Record<string, unknown>,
    descriptionProps: {} as Record<string, unknown>,
    errorMessageProps: {} as Record<string, unknown>,
    isInvalid: false,
    validationErrors: [] as string[],
    validationDetails: {} as Record<string, unknown>,
  };
});

export const useRadio = jest.fn(
  (
    props?: Record<string, unknown>,
    state?: {isSelected?: (value: string) => boolean},
  ) => {
    const value = (props?.value as string) ?? "";
    const isDisabled = Boolean(props?.isDisabled);
    const isSelected =
      typeof state?.isSelected === "function"
        ? Boolean(state?.isSelected(value))
        : false;

    return {
      labelProps: {} as Record<string, unknown>,
      inputProps: {
        disabled: isDisabled,
        checked: isSelected,
        value,
      } as Record<string, unknown>,
      isDisabled,
      isSelected,
      isPressed: false,
    } as Record<string, unknown>;
  },
);
