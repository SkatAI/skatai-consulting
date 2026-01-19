# SkatAI Website

Modern consulting services website built with Next.js 14+, React, TypeScript, and Chakra UI v3.

## Features

- **Home Page**: Consulting pitch with Hero, Services, Projects, and Contact sections
- **Blog**: MDX-based blog with full markdown support
- **Courses**: 160+ course chapters across 9 courses
- **Slides**: Full-screen presentation mode with keyboard/touch navigation
- **SEO**: Automatic sitemap and RSS feed generation
- **Static Export**: Fully static site for hosting on any CDN

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (generates static site in /out)
npm run build

# Format code
npm run format

# Lint code
npm run lint
```

## Project Structure

```
skatai-next/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── blog/              # Blog pages
│   │   └── courses/           # Course pages
│   ├── components/
│   │   ├── home/              # Home page sections
│   │   ├── layout/            # Navigation, Footer
│   │   ├── slides/            # SlidePresentation component
│   │   └── ui/                # Chakra provider
│   ├── content/
│   │   ├── blog/              # Blog posts (markdown)
│   │   └── courses/           # Course content (markdown)
│   └── lib/
│       └── mdx.ts             # Content loading utilities
├── public/
│   └── images/                # Static images
├── out/                       # Static build output
└── scripts/
    └── generate-rss.js        # RSS feed generator
```

## Deployment

The site is configured for static export. After building:

1. The static files are in the `/out` directory
2. Upload to any static hosting (Digital Ocean, Vercel, Netlify, etc.)
3. Configure your domain to point to the hosting

### Digital Ocean App Platform

```yaml
# app.yaml
name: skatai
services:
  - name: web
    source:
      type: github
      repo: your-username/skatai-next
      branch: main
    build_command: npm run build
    output_dir: out
```

## Content Management

### Adding Blog Posts

Create a new `.md` file in `src/content/blog/`:

```markdown
---
title: "Post Title"
date: 2024-01-01
description: "Post description"
tags: [AI, ML]
image: "/images/blog/your-image.png"
link: "https://example.com"
link_text: "Example"
---

Content here...
```

Notes:
- `image` is optional and must be a path under `public/` (do not include `/public` in the path).
- `link` and `link_text` are optional and render on the blog listing card.

### Adding Course Content

Create or edit files in `src/content/courses/{course-name}/`:

```markdown
---
layout: default
title: "Chapter Title"
---

Content here...
```

For slides, use `layout: slides` and separate slides with `---`:

```markdown
---
layout: slides
title: "Presentation Title"
---

# Slide 1

Content...

---

# Slide 2

More content...
```

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **UI**: Chakra UI v3
- **Content**: MDX with gray-matter
- **Styling**: CSS + Chakra UI tokens
- **Build**: Static export for CDN hosting
