import fs from "fs";

fs.mkdirSync("app/docs/changelog", {recursive: true});

fs.copyFileSync("CHANGELOG.md", "app/docs/changelog/page.mdx");

let content = fs.readFileSync("app/docs/changelog/page.mdx", "utf8");
content = content.replace(/^# shadcn-native/, "# Changelog");
fs.writeFileSync("app/docs/changelog/page.mdx", content);
