import {jest} from "@jest/globals";

export const useButton = jest.fn(() => ({
  buttonProps: {
    onPress: jest.fn(),
    disabled: false,
    "aria-pressed": false,
  } as Record<string, unknown>,
}));

export const useToggleButton = jest.fn(() => {
  return {
    onPress: jest.fn(),
  } as Record<string, unknown>;
});

export const useToggleButtonGroup = jest.fn(() => ({
  groupProps: {
    role: "group",
    "aria-orientation": "horizontal",
  } as Record<string, unknown>,
}));

export const useToggleButtonGroupItem = jest.fn(() => ({
  buttonProps: {
    onPress: jest.fn(),
    role: "button",
    "aria-pressed": false,
  } as Record<string, unknown>,
}));
