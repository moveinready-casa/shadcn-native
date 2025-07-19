import {jest} from "@jest/globals";

export const useDisclosure = jest.fn(() => ({
  buttonProps: {
    onPress: jest.fn(),
    "aria-expanded": false,
    "aria-controls": "content-id",
  } as Record<string, unknown>,
  panelProps: {
    id: "content-id",
    "aria-labelledby": "button-id",
  } as Record<string, unknown>,
}));
