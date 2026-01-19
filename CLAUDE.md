# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Build static site to /out (includes sitemap & RSS generation)
npm run lint       # Run ESLint
npm run format     # Auto-format with Prettier
```

Makefile shortcuts are also available: `make dev`, `make build`, `make lint`, `make format-fix`, `make clean`.

## Architecture Overview

This is a **static content site** built with Next.js App Router, configured for static export (`output: 'export'`). All pages are pre-generated at build time.

### Tech Stack
- Next.js 16 with App Router (static export)
- React 19
- Chakra UI v3 for components
- MDX for content with gray-matter for frontmatter parsing
- TypeScript with strict mode

### Chakra UI Documentation
For Chakra UI v3 questions, consult the local documentation in `docs/chakra-ui/`:
- `llms.txt` - General overview
- `llms-components.txt` - Component usage
- `llms-styling.txt` - Styling patterns
- `llms-theming.txt` - Theming configuration

### Key Directories
- `src/app/` - Next.js routes (uses App Router, not Pages Router)
- `src/components/` - Reusable components organized by feature (home/, layout/, slides/, ui/)
- `src/content/` - Markdown/MDX content files (blog/, courses/)
- `src/lib/mdx.ts` - Content loading utilities for posts and courses

### Routing Patterns
- `/blog/[slug]` - Single blog posts from `src/content/blog/`
- `/courses/[...slug]` - Catch-all route for courses and chapters from `src/content/courses/{courseName}/`

### Content System
Content uses MDX with YAML frontmatter. The `src/lib/mdx.ts` module provides:
- `getPostBySlug(directory, slug)` - Load a single post
- `getAllPosts(directory)` - Get all posts sorted by date
- `getCourseStructure(courseName)` - Get chapters with ordering
- `getAllCourses()` - List all course directories

Chapter ordering is extracted from frontmatter (`order`, `chapitre`) or filename patterns (`chapitre_01`, `S01.02`, `01-intro`).

### Slide Presentations
Use `layout: slides` in frontmatter and separate slides with `---` in the content. The SlidePresentation component handles keyboard/touch navigation.

## Code Style
- No semicolons, single quotes, 2-space indent, 100 char line width
- Client components marked with `'use client'` directive
- Server components are the default (async components for data fetching)
- Path alias: `@/*` maps to `./src/*`
