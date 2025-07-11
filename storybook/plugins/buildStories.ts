import fs from "fs";
import path from "path";
import {glob} from "glob";
import type {Plugin, HmrContext} from "vite";

interface BuildStoriesOptions {
  registryPath?: string;
  outputPath?: string;
}

export class ComponentStoryBuilder {
  private registryPath: string;
  private outputPath: string;

  constructor(options: BuildStoriesOptions = {}) {
    this.registryPath = options.registryPath || "../registry/ui";
    this.outputPath = options.outputPath || ".stories";
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, {recursive: true});
    }
  }

  private getComponentName(filePath: string): string {
    const basename = path.basename(filePath, ".tsx");
    return basename.charAt(0).toUpperCase() + basename.slice(1);
  }

  private findStoryFile(componentName: string): string | null {
    const storyFilename = `${componentName}.stories.tsx`;
    const storyPath = path.join(this.registryPath, "stories", storyFilename);

    if (fs.existsSync(storyPath)) {
      return storyPath;
    }

    const lowercaseStoryFilename = `${componentName.toLowerCase()}.stories.tsx`;
    const lowercaseStoryPath = path.join(
      this.registryPath,
      "stories",
      lowercaseStoryFilename,
    );

    if (fs.existsSync(lowercaseStoryPath)) {
      return lowercaseStoryPath;
    }

    return null;
  }

  private copyFile(src: string, dest: string): void {
    try {
      const content = fs.readFileSync(src, "utf-8");
      fs.writeFileSync(dest, content);
      console.log(`✓ Copied: ${src} → ${dest}`);
    } catch (error) {
      console.error(`✗ Failed to copy ${src} to ${dest}:`, error);
    }
  }

  public async build(): Promise<void> {
    console.log("🔨 Building stories...");

    this.ensureDirectoryExists(this.outputPath);
    this.ensureDirectoryExists(path.join(this.outputPath, "stories"));

    const componentPattern = path.join(this.registryPath, "*.tsx");
    const componentFiles = glob.sync(componentPattern);

    console.log(`Found ${componentFiles.length} component(s) in registry`);

    for (const componentFile of componentFiles) {
      const componentName = this.getComponentName(componentFile);
      const storyFile = this.findStoryFile(componentName);

      const outputComponentPath = path.join(
        this.outputPath,
        path.basename(componentFile),
      );
      this.copyFile(componentFile, outputComponentPath);

      if (storyFile) {
        const outputStoryPath = path.join(
          this.outputPath,
          "stories",
          path.basename(storyFile),
        );
        this.copyFile(storyFile, outputStoryPath);
      } else {
        console.log(`⚠ No story found for component: ${componentName}`);
      }
    }

    console.log("✅ Build complete!");
  }
}

export async function buildComponentStories(
  options: BuildStoriesOptions = {},
): Promise<void> {
  const builder = new ComponentStoryBuilder(options);
  await builder.build();
}

export function createBuildStoriesPlugin(
  options: BuildStoriesOptions = {},
): Plugin {
  let builder: ComponentStoryBuilder;
  let rootDir: string;

  return {
    name: "vite:build-stories",
    async configResolved(resolved: any) {
      rootDir = resolved.root;
      builder = new ComponentStoryBuilder({
        registryPath: path.join(rootDir, "../registry/ui"),
        outputPath: path.join(rootDir, ".stories"),
        ...options,
      });
      await builder.build();
    },
    buildStart() {
      const registryDir = path.join(rootDir, "../registry/ui");
      const componentFiles = glob.sync(
        path.join(registryDir, "**/*.{tsx,ts,mdx}"),
      );
      componentFiles.forEach((file) => {
        this.addWatchFile(file);
      });
    },
    configureServer(server: any) {
      const registryDir = path.join(rootDir, "../registry/ui");
      server.watcher.add(registryDir);
    },
    async handleHotUpdate(ctx: HmrContext) {
      if (
        ctx.file.includes(`${path.sep}.stories${path.sep}`) ||
        ctx.file.includes(`/.stories/`)
      ) {
        return;
      }

      if (ctx.file.includes(`${path.sep}registry${path.sep}`)) {
        await builder.build();
      }
    },
  };
}

// CLI usage when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const builder = new ComponentStoryBuilder();
    await builder.build();
  })();
}
