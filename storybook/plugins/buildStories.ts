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
    this.registryPath = options.registryPath || "../registry";
    this.outputPath = options.outputPath || ".stories";
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, {recursive: true});
    }
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

    const allFilesPattern = path.join(this.registryPath, "**/*");
    const ignorePattern = path.join(this.registryPath, "**/tests/**");
    const filesToCopy = glob.sync(allFilesPattern, {
      nodir: true,
      ignore: [ignorePattern],
    });
    console.log(`Found ${filesToCopy.length} file(s) in registry`);
    console.log(`Ignoring files that match: ${ignorePattern}`);

    for (const file of filesToCopy) {
      const relativePath = path.relative(this.registryPath, file);
      const destinationPath = path.join(this.outputPath, relativePath);

      this.ensureDirectoryExists(path.dirname(destinationPath));
      this.copyFile(file, destinationPath);
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
        registryPath: path.join(rootDir, "../registry"),
        outputPath: path.join(rootDir, ".stories"),
        ...options,
      });
      await builder.build();
    },
    buildStart() {
      const registryDir = path.join(rootDir, "../registry");
      const ignorePattern = path.join(registryDir, "**/tests/**");
      const componentFiles = glob.sync(path.join(registryDir, "**/*"), {
        ignore: [ignorePattern],
      });
      componentFiles.forEach((file) => {
        this.addWatchFile(file);
      });
    },
    configureServer(server: any) {
      const registryDir = path.join(rootDir, "../registry");
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
