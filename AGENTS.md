# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` holds Next.js App Router pages, including `page.tsx` for the home page plus `blog/` and `courses/` routes.
- `src/components/` contains UI building blocks (home sections, layout, slides, Chakra provider).
- `src/content/` stores MD/MDX content for blog posts and course chapters.
- `src/lib/` includes utilities such as MDX loading helpers.
- `public/` is for static assets (images).
- `scripts/` contains build helpers like `generate-rss.js`.
- `out/` is the static export output after `npm run build`.

## Build, Test, and Development Commands
- `npm run dev`: start the local dev server with hot reload.
- `npm run build`: create a production build; `postbuild` generates sitemap + RSS into `out/`.
- `npm run start`: run the production server (useful to validate the build locally).
- `npm run lint`: run ESLint with Next.js + TypeScript rules.
- `npm run format`: run Prettier on `src/**/*.{ts,tsx,js,jsx,json,css,md,mdx}`.

## Coding Style & Naming Conventions
- Use 2-space indentation (default Prettier) and TypeScript for app code.
- Follow Next.js App Router conventions for route structure under `src/app/`.
- Content files are Markdown/MDX with frontmatter, e.g. `src/content/blog/my-post.md` and course chapters under `src/content/courses/{course-name}/`.
- When Chakra UI behavior is unexpected, read the Chakra UI documentation files in `docs/chakra-ui` before making changes.

## Testing Guidelines
- No automated test framework is configured. If you add tests, document the runner and add a `npm run test` script.
- When modifying content or routes, validate by running `npm run dev` and navigating to the affected pages.

## Commit & Pull Request Guidelines
- Git history is minimal (“Initial commit” only), so no established commit convention is visible.
- Use clear, imperative commit subjects (e.g., “Add new course chapter index”).
- PRs should include: a concise description, any related issue link, and screenshots for UI/content changes.

## Content Authoring Tips
- Blog posts live in `src/content/blog/` as `.md` with frontmatter: `title`, `date`, `description`, `tags`.
- Course content lives in `src/content/courses/{course-name}/` and supports `layout: slides` with `---` slide breaks.
