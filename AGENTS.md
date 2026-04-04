# Repository Guidelines

## Project Structure & Module Organization
- `content/`: Markdown source for the blog (folders map to site routes).
- `quartz/`: Quartz core code (components, plugins, styles, emitters, utilities).
- `quartz/components/`: UI components and page renderers (`pages/`, `styles/`, `scripts/`).
- `public/`: Generated static output after build.
- `docs/`: Project documentation for Quartz usage and features.
- Root config files: `quartz.config.ts` (site/plugins), `quartz.layout.ts` (page layout), `tsconfig.json`.

## Build, Test, and Development Commands
- `npx quartz build --serve`: Build site and run local dev server with live reload.
- `npx quartz build`: Production build to `public/`.
- `npm run check`: Type-check (`tsc`) and Prettier format check.
- `npm run format`: Format repository files with Prettier.
- `npm test`: Run test suite with `tsx --test`.
- `npm run docs`: Build and serve docs content from `docs/`.

## Coding Style & Naming Conventions
- Language: TypeScript + Preact + SCSS.
- Formatting: Prettier (2-space indentation, semicolons per formatter output).
- Components: PascalCase filenames (e.g., `HomePage.tsx`).
- Scripts/styles: lower camel or feature-based naming (e.g., `homeTabs.inline.ts`, `homePage.scss`).
- Keep changes scoped: avoid broad refactors in content + framework code in one PR.

## Testing Guidelines
- Framework: native Node test runner via `tsx --test`.
- Existing tests live near utilities/scripts (`*.test.ts`).
- Add/update tests when modifying parsing, path logic, trie behavior, or client scripts.
- Run at minimum: `npm test` and `npm run check` before pushing.

## Commit & Pull Request Guidelines
- Prefer clear, scoped commit messages. Conventional style is encouraged:
  - `feat(home): add tabbed homepage`
  - `fix(layout): remove left sidebar gap`
- Historical date-based commits exist; for new work, favor semantic prefixes (`feat`, `fix`, `style`, `refactor`, `docs`).
- PRs should include:
  - What changed and why.
  - Affected paths/components.
  - Screenshots for UI/layout changes.
  - Verification steps (`npx quartz build`, `npm run check`, tests).

## Configuration Tips
- Update `quartz.config.ts` carefully (`baseUrl`, plugins, analytics).
- Layout-only changes should usually stay in `quartz.layout.ts` + component/style files, not content.
## memory
- content folder is forbiden to directly edit, it's main source of my blog articles
- every round changes should pull the laster submodule of content(using .push.sh script)
## workflow
- every round changes should follow this workflow:
  - pull the laster submodule of content
  - make changes based current requirements
  - build and test
  - commit and push
  - wait bolg content builded, then check the blog online base current round requirement: https://haloworld-c.github.io/blog-quartz/, not only check reachable, but also check the content is correct as expected
  - if any issue, fix it and repeat the workflow

