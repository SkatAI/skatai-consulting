import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { parse as parseYaml } from 'yaml'

const contentDirectory = path.join(process.cwd(), 'src/content')

export interface PostMeta {
  slug: string
  title: string
  date: string
  description?: string
  author?: string
  tags?: string[]
  readingTime: string
  layout?: string
  chapitre?: number
  order?: number
  [key: string]: unknown
}

export interface Post {
  meta: PostMeta
  content: string
}

export interface CourseIndexItem {
  slug: string
  title: string
  description: string
  tags?: string[]
  order?: number
  status?: 'live' | 'draft' | 'archived'
  background?: string
}

// Background images live in public/, but are served from the site root.
// Accept both `public/images/...` and `/images/...` in index.yaml.
function normalizeAssetPath(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) {
    return undefined
  }
  const trimmed = value.trim()
  if (/^https?:\/\//.test(trimmed)) {
    return trimmed
  }
  return `/${trimmed.replace(/^\/?public\//, '').replace(/^\//, '')}`
}

export interface CourseSessionItem {
  slug: string
  title: string
  description?: string
  order: number
  file?: string
  status?: 'live' | 'draft' | 'archived'
}

export interface CourseContentIndex {
  title?: string
  description?: string
  tags?: string[]
  status?: 'live' | 'draft' | 'archived'
  order?: number
  index?: {
    file?: string
    title?: string
    description?: string
  }
  sessions?: Array<{
    slug?: string
    title?: string
    description?: string
    order?: number
    file?: string
    status?: 'live' | 'draft' | 'archived'
  }>
}

export function getPostSlugs(directory: string): string[] {
  const fullPath = path.join(contentDirectory, directory)
  if (!fs.existsSync(fullPath)) {
    return []
  }
  return fs.readdirSync(fullPath).filter((file) => /\.(md|mdx)$/.test(file))
}

export function getPostBySlug(directory: string, slug: string): Post {
  const realSlug = slug.replace(/\.(md|mdx)$/, '')
  const fullPath = path.join(contentDirectory, directory, `${realSlug}.md`)
  const mdxPath = path.join(contentDirectory, directory, `${realSlug}.mdx`)

  const filePath = fs.existsSync(fullPath) ? fullPath : mdxPath
  if (!fs.existsSync(filePath)) {
    throw new Error(`Post not found: ${directory}/${slug}`)
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  const stats = readingTime(content)

  // Handle various title formats used in Jekyll
  const title = data.page_title || data.title || realSlug

  return {
    meta: {
      ...data,
      slug: realSlug,
      title,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      readingTime: stats.text,
      layout: data.layout,
      chapitre: data.chapitre,
      order: data.order || data.chapitre || extractOrderFromSlug(realSlug),
    } as PostMeta,
    content,
  }
}

// Extract order from filename patterns like "2023-10-01-chapitre_01" or "S01.01.dbsql.welcome"
function extractOrderFromSlug(slug: string): number {
  // Try to match patterns like "chapitre_01" or "chapitre_1"
  const chapitreMatch = slug.match(/chapitre[_-]?(\d+)/i)
  if (chapitreMatch) {
    return parseInt(chapitreMatch[1], 10)
  }

  // Try to match patterns like "S01.02" or "01-"
  const sessionMatch = slug.match(/S?(\d{2})[._-](\d{2})/)
  if (sessionMatch) {
    return parseInt(sessionMatch[1], 10) * 100 + parseInt(sessionMatch[2], 10)
  }

  // Try to match leading numbers like "01-introduction"
  const leadingMatch = slug.match(/^(\d+)/)
  if (leadingMatch) {
    return parseInt(leadingMatch[1], 10)
  }

  return 999 // Put at end if no order found
}

export function getAllPosts(directory: string): Post[] {
  const slugs = getPostSlugs(directory)
  const posts = slugs
    .map((slug) => getPostBySlug(directory, slug))
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
  return posts
}

export function getCourseStructure(courseName: string): {
  chapters: CourseSessionItem[]
  index?: { title: string; description?: string; file?: string }
} {
  const coursePath = path.join(contentDirectory, 'courses', courseName)
  if (!fs.existsSync(coursePath)) {
    return { chapters: [] }
  }

  const contentIndex = getCourseContentIndex(courseName)
  const usedSlugs = new Map<string, number>()
  const chaptersFromIndex = contentIndex?.sessions
    ? contentIndex.sessions
        .filter(Boolean)
        .map((item, index) => {
          const file = typeof item?.file === 'string' ? item.file : undefined
          const baseSlug = deriveCourseSlug(courseName, item?.slug, file)
          const slug = ensureUniqueSlug(baseSlug, usedSlugs)
          const { title: fileTitle, description: fileDescription } = file
            ? getCourseFileMeta(courseName, file)
            : { title: slug, description: undefined }
          const title = typeof item?.title === 'string' ? item.title : fileTitle
          const description =
            typeof item?.description === 'string' ? item.description : fileDescription
          const rawOrder = item?.order
          const order = typeof rawOrder === 'number' ? rawOrder : Number(rawOrder)
          const status =
            item?.status === 'live' || item?.status === 'draft' || item?.status === 'archived'
              ? item.status
              : 'live'

          return {
            slug,
            title,
            description,
            order: Number.isFinite(order) ? order : index + 1,
            file,
            status,
          }
        })
    : []

  const indexFromContent = contentIndex?.index
    ? {
        title: contentIndex.index.title || contentIndex.title || courseName,
        description: contentIndex.index.description || contentIndex.description,
        file: contentIndex.index.file,
      }
    : contentIndex?.title
      ? { title: contentIndex.title, description: contentIndex.description }
      : undefined

  // A course may declare an index page with no sessions (single-page course).
  if (chaptersFromIndex.length > 0 || indexFromContent?.file) {
    return {
      chapters: chaptersFromIndex.sort((a, b) => a.order - b.order),
      index: indexFromContent,
    }
  }

  const files = fs.readdirSync(coursePath).filter((file) => /\.(md|mdx)$/.test(file))
  const chapters = files
    .filter((file) => /^S\d{2}\.\d{2}\./.test(file))
    .map((file, index) => {
      const slug = ensureUniqueSlug(deriveCourseSlug(courseName, undefined, file), usedSlugs)
      const { title, description } = getCourseFileMeta(courseName, file)
      return {
        slug,
        title,
        description,
        order: extractOrderFromSlug(file.replace(/\.(md|mdx)$/, '')) || index + 1,
        file,
        status: 'live' as const,
      }
    })

  return {
    chapters: chapters.sort((a, b) => a.order - b.order),
    index: indexFromContent,
  }
}

export function getAllCourses(): string[] {
  const coursesPath = path.join(contentDirectory, 'courses')
  if (!fs.existsSync(coursesPath)) {
    return []
  }
  return fs.readdirSync(coursesPath).filter((item) => {
    const itemPath = path.join(coursesPath, item)
    return fs.statSync(itemPath).isDirectory()
  })
}

export function getCourseIndex(): CourseIndexItem[] {
  const indexPath = path.join(contentDirectory, 'courses', 'index.yaml')
  const courseDirs = getAllCourses()
  const courseIndexBySlug = new Map<string, CourseIndexItem>()

  if (fs.existsSync(indexPath)) {
    const fileContents = fs.readFileSync(indexPath, 'utf8')
    let data: unknown
    try {
      data = parseYaml(fileContents)
    } catch {
      data = null
    }
    const rawCourses = Array.isArray(data) ? data : (data as { courses?: unknown })?.courses

    if (Array.isArray(rawCourses)) {
      rawCourses
        .filter(Boolean)
        .forEach((item) => {
          const slug = typeof item?.slug === 'string' ? item.slug : ''
          if (!slug) {
            return
          }
          const title = typeof item?.title === 'string' ? item.title : slug
          const description = typeof item?.description === 'string' ? item.description : ''
          const tags = Array.isArray(item?.tags) ? item.tags.map(String) : []
          const status =
            item?.status === 'live' || item?.status === 'draft' || item?.status === 'archived'
              ? item.status
              : 'live'
          const rawOrder = item?.order
          const order = typeof rawOrder === 'number' ? rawOrder : Number(rawOrder)

          courseIndexBySlug.set(slug, {
            slug,
            title,
            description,
            tags,
            order: Number.isFinite(order) ? order : undefined,
            status,
            background: normalizeAssetPath(item?.background),
          })
        })
    }
  }

  courseDirs.forEach((slug) => {
    const courseMeta = getCourseContentIndex(slug)
    if (!courseMeta) {
      return
    }
    const existing = courseIndexBySlug.get(slug)
    const status =
      courseMeta.status === 'live' || courseMeta.status === 'draft' || courseMeta.status === 'archived'
        ? courseMeta.status
        : existing?.status ?? 'live'
    const rawOrder = courseMeta.order
    const order = typeof rawOrder === 'number' ? rawOrder : Number(rawOrder)

    if (existing) {
      courseIndexBySlug.set(slug, {
        ...existing,
        title: existing.title || courseMeta.title || slug,
        description: existing.description || courseMeta.description || '',
        tags: existing.tags?.length ? existing.tags : courseMeta.tags,
        order: existing.order ?? (Number.isFinite(order) ? order : undefined),
        status,
      })
    } else {
      courseIndexBySlug.set(slug, {
        slug,
        title: courseMeta.title || slug,
        description: courseMeta.description || '',
        tags: courseMeta.tags || [],
        order: Number.isFinite(order) ? order : undefined,
        status,
      })
    }
  })

  return Array.from(courseIndexBySlug.values()).filter((item) => item.slug.length > 0)
}

export function getCourseContentIndex(courseName: string): CourseContentIndex | null {
  const indexPath = path.join(contentDirectory, 'courses', courseName, 'index.yaml')
  if (!fs.existsSync(indexPath)) {
    return null
  }
  const fileContents = fs.readFileSync(indexPath, 'utf8')
  let data: unknown
  try {
    data = parseYaml(fileContents)
  } catch {
    return null
  }
  if (!data || typeof data !== 'object') {
    return null
  }
  return data as CourseContentIndex
}

export function getCourseSessionBySlug(courseName: string, slug: string): CourseSessionItem | null {
  const { chapters } = getCourseStructure(courseName)
  const liveChapters = chapters.filter((chapter) => chapter.status !== 'draft' && chapter.status !== 'archived')
  return liveChapters.find((chapter) => chapter.slug === slug) || null
}

function deriveCourseSlug(courseName: string, explicitSlug?: string, file?: string): string {
  if (explicitSlug && typeof explicitSlug === 'string') {
    return explicitSlug
  }
  if (!file) {
    return courseName
  }
  let base = file.replace(/\.(md|mdx)$/, '')
  base = base.replace(/^S\d{2}\.\d{2}\./, '')
  base = base.replace(/^00[-_.]?/, '')
  base = base.replace(new RegExp(`^${courseName}\\.`, 'i'), '')
  return base
}

function ensureUniqueSlug(slug: string, registry: Map<string, number>): string {
  const count = registry.get(slug) ?? 0
  registry.set(slug, count + 1)
  if (count === 0) {
    return slug
  }
  return `${slug}-${count + 1}`
}

function getCourseFileMeta(courseName: string, file: string): { title: string; description?: string } {
  const coursePath = path.join(contentDirectory, 'courses', courseName)
  const fullPath = path.join(coursePath, file)
  if (!fs.existsSync(fullPath)) {
    return { title: file.replace(/\.(md|mdx)$/, '') }
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)
  const slug = file.replace(/\.(md|mdx)$/, '')
  const title = data.page_title || data.title || slug
  const description = data.summary || data.description
  return { title, description }
}
