import {jest} from "@jest/globals";

export const useFocusRing = jest.fn(() => ({
  isFocusVisible: false,
  focusProps: {} as Record<string, unknown>,
}));
