import {jest} from "@jest/globals";

export const usePress = jest.fn(() => ({
  isPressed: false,
  pressProps: {
    onPointerDown: jest.fn(),
    onPointerUp: jest.fn(),
    onPointerCancel: jest.fn(),
    onPointerLeave: jest.fn(),
    onMouseDown: jest.fn(),
    onMouseUp: jest.fn(),
    onMouseLeave: jest.fn(),
    onTouchStart: jest.fn(),
    onTouchEnd: jest.fn(),
    onTouchCancel: jest.fn(),
    onKeyDown: jest.fn(),
    onKeyUp: jest.fn(),
    onClick: jest.fn(),
    onDragStart: jest.fn(),
    tabIndex: undefined,
  } as Record<string, unknown>,
}));

export const useFocus = jest.fn(() => ({
  focusProps: {
    onFocus: jest.fn(),
    onBlur: jest.fn(),
  } as Record<string, unknown>,
}));

export const useFocusVisible = jest.fn(() => ({
  isFocusVisible: false,
}));

export const useFocusWithin = jest.fn(() => ({
  focusWithinProps: {
    onFocusIn: jest.fn(),
    onFocusOut: jest.fn(),
  } as Record<string, unknown>,
}));

export const useHover = jest.fn(() => ({
  isHovered: false,
  hoverProps: {
    onPointerEnter: jest.fn(),
    onPointerLeave: jest.fn(),
    onMouseEnter: jest.fn(),
    onMouseLeave: jest.fn(),
  } as Record<string, unknown>,
}));

export const useKeyboard = jest.fn(() => ({
  keyboardProps: {
    onKeyDown: jest.fn(),
    onKeyUp: jest.fn(),
  } as Record<string, unknown>,
}));

export const useLongPress = jest.fn(() => ({
  longPressProps: {
    onPointerDown: jest.fn(),
    onPointerUp: jest.fn(),
    onPointerCancel: jest.fn(),
    onPointerLeave: jest.fn(),
    onMouseDown: jest.fn(),
    onMouseUp: jest.fn(),
    onMouseLeave: jest.fn(),
    onTouchStart: jest.fn(),
    onTouchEnd: jest.fn(),
    onTouchCancel: jest.fn(),
  } as Record<string, unknown>,
}));

export const useMove = jest.fn(() => ({
  moveProps: {
    onPointerDown: jest.fn(),
    onPointerMove: jest.fn(),
    onPointerUp: jest.fn(),
    onPointerCancel: jest.fn(),
    onMouseDown: jest.fn(),
    onMouseMove: jest.fn(),
    onMouseUp: jest.fn(),
    onTouchStart: jest.fn(),
    onTouchMove: jest.fn(),
    onTouchEnd: jest.fn(),
    onTouchCancel: jest.fn(),
  } as Record<string, unknown>,
}));

export const useLandmark = jest.fn(() => ({
  landmarkProps: {
    role: undefined,
    "aria-label": undefined,
    "aria-labelledby": undefined,
  } as Record<string, unknown>,
}));

export const useFocusable = jest.fn(() => ({
  focusableProps: {
    tabIndex: 0,
    onFocus: jest.fn(),
    onBlur: jest.fn(),
    onKeyDown: jest.fn(),
    onKeyUp: jest.fn(),
  } as Record<string, unknown>,
}));
