#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Generate RSS feed for the blog
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const SITE_URL = process.env.SITE_URL || 'https://alexisperrier.com'
const blogDir = path.join(process.cwd(), 'src/content/blog')
const outDir = path.join(process.cwd(), 'out')

function getBlogPosts() {
  if (!fs.existsSync(blogDir)) {
    return []
  }

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
  const posts = files.map((file) => {
    const filePath = path.join(blogDir, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(content)
    const slug = file.replace(/\.(md|mdx)$/, '')

    return {
      slug,
      title: data.title || slug,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      description: data.description || '',
    }
  })

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

function generateRSS() {
  const posts = getBlogPosts()

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SkatAI Blog</title>
    <link>${SITE_URL}</link>
    <description>Articles on AI, Machine Learning, and MLOps</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
    </item>`
      )
      .join('')}
  </channel>
</rss>`

  // Ensure out directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  fs.writeFileSync(path.join(outDir, 'feed.xml'), rss)
  console.log('RSS feed generated: out/feed.xml')
}

generateRSS()
