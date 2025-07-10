import {useMDXComponents as getThemeComponents} from "nextra-theme-docs";

const themeComponents = getThemeComponents();

export function useMDXComponents(components?: React.ReactNode[]) {
  return {
    ...themeComponents,
    ...components,
  };
}
