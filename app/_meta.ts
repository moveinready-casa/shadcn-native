export default {
  index: "Home",
  docs: {
    title: "Documentation",
    type: "page",
    href: "/docs",
  },
  components: {
    title: "Components",
    type: "page",
    href: "/docs/components/accordion",
  },
  storybook: {
    title: "Storybook",
    type: "page",
    href: process.env.STORYBOOK_URL,
  },
  "shadcn/ui": {
    title: "Shadcn/UI",
    type: "page",
    href: "https://ui.shadcn.com/docs/components",
  },
};
