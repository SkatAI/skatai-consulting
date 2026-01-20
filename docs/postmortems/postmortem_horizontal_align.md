# Postmortem: Horizontal Alignment / Uneven Gutters

Date: 2026-01-20  
Owner: Alexis / SkatAI site

## Summary
Several pages showed an obvious extra right-side gutter, making left and right margins appear inconsistent. The issue persisted across multiple sections and routes (home, blog, courses, navigation, footer). We resolved this by centralizing the site container logic and applying it consistently everywhere.

## Impact
- Visual imbalance across the site.
- Inconsistent horizontal rhythm between sections.
- Reduced perceived quality, especially on wide viewports.

## Root Cause
Multiple pages and components used different `Container` configurations:
- Mixed `maxW` values (`container.xl`, `7xl`, `full`) and varying `px` values.
- Some sections relied on Chakra defaults, others overrode padding.
- The result: inconsistent left/right gutters and “extra” space on the right for certain widths.

## Resolution
Introduced a single shared layout primitive and replaced all local `Container` usage:
- Added `SiteContainer` with consistent `maxW` and responsive `px`.
- Replaced `Container` in navigation, footer, home sections, blog, and courses.
- Any future adjustments now happen in one place.

## Changes
- Added `src/components/layout/SiteContainer.tsx`
- Updated the following to use `SiteContainer`:
  - `src/components/layout/Navigation.tsx`
  - `src/components/layout/Footer.tsx`
  - `src/components/home/Hero.tsx`
  - `src/components/home/Services.tsx`
  - `src/components/home/Projects.tsx`
  - `src/components/home/Contact.tsx`
  - `src/components/home/Experience.tsx`
  - `src/app/blog/page.tsx`
  - `src/app/blog/[slug]/page.tsx`
  - `src/app/courses/page.tsx`
  - `src/app/courses/[...slug]/page.tsx`

## Verification
- Visual review of home/projects section at wide desktop width.
- Confirmed nav/footer gutters match section gutters.
- Spot-checked blog and courses pages for alignment consistency.

## Prevention
- Use `SiteContainer` for any new sections or pages.
- Avoid per-page overrides of `maxW` and `px` unless explicitly required.
- If a section needs a different max width, pass it through `SiteContainer` to keep padding consistent.

## Follow-ups
- None required. If a wider layout is desired later, update `SiteContainer` once.
