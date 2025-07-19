import {jest} from "@jest/globals";

export const useButton = jest.fn(() => ({
  buttonProps: {
    onPress: jest.fn(),
    disabled: false,
    "aria-pressed": false,
  } as Record<string, unknown>,
}));
