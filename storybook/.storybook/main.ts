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
    "../stories/**/Welcome.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../.stories/**/*.mdx",
    "../.stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../stories/**/*.mdx",
  ],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: getAbsolutePath("@storybook/react-native-web-vite"),
    options: {
      modulesToTranspile: [
        "react-native-reanimated",
        "react-native-vector-icons",
        "nativewind",
        "react-native-css-interop",
        "@rn-primitives/portal",
      ],
      pluginReactOptions: {
        babel: {
          presets: [["nativewind/babel", {mode: "transformOnly"}]],
        },
      },
    },
  },
  async viteFinal(viteConfig) {
    viteConfig.plugins = viteConfig.plugins || [];
    viteConfig.plugins.push(createBuildStoriesPlugin());

    // Ensure JSX inside ESM from certain node_modules is transpiled in build
    const esbuild = require("esbuild");
    viteConfig.plugins.push({
      name: "transform-portal-mjs-jsx",
      enforce: "pre",
      async transform(code, id) {
        const isPortal = id.includes("/node_modules/@rn-primitives/portal/");
        const isJsLike = id.endsWith(".mjs") || id.endsWith(".js");
        if (isPortal && isJsLike) {
          const result = await esbuild.transform(code, {
            loader: "jsx",
            jsx: "automatic",
            sourcemap: false,
            sourcefile: id,
          });
          return {code: result.code};
        }
        return null;
      },
    });

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
      viteConfig.optimizeDeps = {
        esbuildOptions: {
          loader: {
            ".js": "jsx",
            ".mjs": "jsx",
          },
        },
      };
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
