# Contributing

We are so glad you want to contribute to this project! You can contribute in many ways:

- Reporting a bug
- Fixing a bug
- Adding new features
- Spreading the word

However, for the purpose of this document we will focus on changes to the codebase (docs, components, architecture).

## Before you start

Open a RFC issue if you are making a major change for anything but components. Open a component RFC issue for a new component. If you are fixing a bug you can skip this step.

## Standards for all contributions

- Use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
- Follow the [Code of Conduct](/CODE_OF_CONDUCT.md)
- Format all changed code before committing (we have pre commit hooks to help you with that)

## Getting started

Fork this repository and clone to your local machine.

## Development setup

To make any substantial changes you will need to set up your development environment:

1. Use the correct node version `nvm install && nvm use`
2. Install pnpm `npm install -g pnpm@10.x.x`
3. Install dependencies `pnpm install`

You are now ready to get started.

## Making changes

## Changes that affect components

- Bug fixes: If you are fixing a bug make your fix and commit. It is that simple.
- New components: After creating an RFC you can write the component:
  - Start by writing tests to ensure functionality. You should make the component compatible with [shadcn/ui](https://ui.shadcn.com/).
  - Write the components code.
  - Add a storybook.
  - Document the code.
  - Ensure all tests pass and that this new component fits in with the general patterns found in this codebase. We will help guide you 🙂.
- New features: after adding your feature update the tests and story(s)

## Other changes

Most other changes do not have specific procedures. But if they are major changes remember to open a RFC.

## Before you make a pull request

**You can also do this after you open a pr**

If your changes affect any components please create a [changeset](https://changesets-docs.vercel.app/en).

Create a changeset:

```shell
pnpm changeset
```

For more information see [Adding a changeset](https://changesets-docs.vercel.app/en/adding-a-changeset).

## Opening the pull request

Once you are done you can open a pull request. Open it against the `dev` branch. You are all set we will take it from here and let you know when your changes are live!

## Contribution ideas

If you want to contribute but don't know what to do check our [Github projects board](https://github.com/orgs/moveinready-casa/projects/2/views/1?template_dialog_tab=all&layout_template=board).
