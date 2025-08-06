import {jest} from "@jest/globals";

export const useDialog = jest.fn(() => ({
  dialogProps: {
    role: "dialog",
    "aria-modal": true,
  } as Record<string, unknown>,
  titleProps: {
    id: "dialog-title",
  } as Record<string, unknown>,
}));

export type AriaDialogProps = {
  role?: string;
  "aria-modal"?: boolean;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};
