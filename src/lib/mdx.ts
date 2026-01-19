import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

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
  chapters: { slug: string; title: string; order: number }[]
} {
  const coursePath = path.join(contentDirectory, 'courses', courseName)
  if (!fs.existsSync(coursePath)) {
    return { chapters: [] }
  }

  const files = fs.readdirSync(coursePath).filter((file) => /\.(md|mdx)$/.test(file))
  const chapters = files.map((file) => {
    const slug = file.replace(/\.(md|mdx)$/, '')
    const fullPath = path.join(coursePath, file)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    // Handle various title formats
    const title = data.page_title || data.title || slug

    return {
      slug,
      title,
      order: data.order || data.chapitre || extractOrderFromSlug(slug),
    }
  })

  return {
    chapters: chapters.sort((a, b) => a.order - b.order),
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
