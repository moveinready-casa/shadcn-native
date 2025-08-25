import {jest} from "@jest/globals";

export const useNavigation = jest.fn(() => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(() => false),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  isFocused: jest.fn(() => true),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(() => ({
    key: "mock-key",
    index: 0,
    routeNames: ["Home"],
    routes: [{key: "Home", name: "Home"}],
    type: "stack",
  })),
}));

export const useFocusEffect = jest.fn();

export const useIsFocused = jest.fn(() => true);

export const useRoute = jest.fn(() => ({
  key: "mock-route-key",
  name: "MockRoute",
  params: {},
}));

export const NavigationContainer = jest.fn(({children}) => children);

export const createNavigationContainerRef = jest.fn(() => ({
  current: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn(() => false),
    reset: jest.fn(),
    setParams: jest.fn(),
    dispatch: jest.fn(),
    isFocused: jest.fn(() => true),
    addListener: jest.fn(() => jest.fn()),
    removeListener: jest.fn(),
    getParent: jest.fn(),
    getState: jest.fn(() => ({
      key: "mock-key",
      index: 0,
      routeNames: ["Home"],
      routes: [{key: "Home", name: "Home"}],
      type: "stack",
    })),
  },
}));
