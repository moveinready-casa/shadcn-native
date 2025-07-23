import {join, dirname} from "path";
import type {StorybookConfig} from "@storybook/react-native-web-vite";
import {createRequire} from "module";
import {createBuildStoriesPlugin} from "../plugins/buildStories";

const require = createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
  stories: [
    "../.stories/**/*.mdx",
    "../.stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: getAbsolutePath("@storybook/react-native-web-vite"),
    options: {
      pluginReactOptions: {
        jsxImportSource: "nativewind",
        babel: {
          presets: [["nativewind/babel", {mode: "transformOnly"}]],
          plugins: ["react-native-worklets/plugin"],
        },
      },
    },
  },
  async viteFinal(viteConfig) {
    viteConfig.plugins = viteConfig.plugins || [];
    viteConfig.plugins.push(createBuildStoriesPlugin());

    // Configure CSS processing for Tailwind
    viteConfig.css = {
      ...viteConfig.css,
      postcss: {
        plugins: [
          require("tailwindcss")({
            config: "./tailwind.config.js",
          }),
        ],
      },
    };

    if (!viteConfig.optimizeDeps) {
      viteConfig.optimizeDeps = {};
    }
    if (!viteConfig.optimizeDeps.esbuildOptions) {
      viteConfig.optimizeDeps.esbuildOptions = {};
    }
    if (!viteConfig.optimizeDeps.esbuildOptions.loader) {
      viteConfig.optimizeDeps.esbuildOptions.loader = {};
    }
    viteConfig.optimizeDeps.esbuildOptions.loader[".js"] = "jsx";
    viteConfig.optimizeDeps.esbuildOptions.loader[".mjs"] = "jsx";

    return viteConfig;
  },
};
export default config;
