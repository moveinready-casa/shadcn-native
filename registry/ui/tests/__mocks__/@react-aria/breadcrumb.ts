import {jest} from "@jest/globals";

export const useBreadcrumbs = jest.fn(() => ({
  navProps: {
    "aria-label": "Breadcrumb",
    role: "navigation",
  } as Record<string, unknown>,
}));

export const useBreadcrumbItem = jest.fn(() => ({
  itemProps: {
    onPress: jest.fn(),
    onKeyDown: jest.fn(),
    role: "link",
    tabIndex: 0,
    "aria-current": undefined,
    "aria-disabled": false,
  } as Record<string, unknown>,
}));
