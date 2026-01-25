import { Box, Heading, Text, VStack, HStack } from '@chakra-ui/react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import {
  getCourseContentIndex,
  getCourseIndex,
  getCourseSessionBySlug,
  getCourseStructure,
  getPostBySlug,
} from '@/lib/mdx'
import { notFound } from 'next/navigation'
import { MDXRemote } from '@/components/MDXRemote'
import { SlidePresentation } from '@/components/slides/SlidePresentation'
import '../../prose.css'
import { SiteContainer } from '@/components/layout/SiteContainer'

interface Props {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  const courses = getCourseIndex().filter((course) => course.status === 'live')
  const params: { slug: string[] }[] = []

  for (const course of courses) {
    // Course index page
    params.push({ slug: [course.slug] })

    // Chapter pages
    const structure = getCourseStructure(course.slug)
    const chapters = structure.chapters.filter(
      (chapter) => chapter.status !== 'draft' && chapter.status !== 'archived',
    )
    for (const chapter of chapters) {
      params.push({ slug: [course.slug, chapter.slug] })
    }
  }

  return params
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const [courseName, chapterSlug] = slug
  const courseMeta = getCourseContentIndex(courseName)

  if (chapterSlug) {
    try {
      const session = getCourseSessionBySlug(courseName, chapterSlug)
      if (!session) {
        return { title: 'Chapter Not Found - SkatAI' }
      }
      const fileSlug = session?.file?.replace(/\.(md|mdx)$/, '') || chapterSlug
      const post = getPostBySlug(`courses/${courseName}`, fileSlug)
      return {
        title: `${post.meta.title} - SkatAI`,
        description: post.meta.description || post.meta.title,
      }
    } catch {
      return { title: 'Chapter Not Found - SkatAI' }
    }
  }

  return {
    title: `${courseMeta?.title || courseName} Course - SkatAI`,
    description: courseMeta?.description || `Course content for ${courseName}`,
  }
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  const [courseName, chapterSlug] = slug

  const courses = getCourseIndex().filter((course) => course.status === 'live')
  if (!courses.some((course) => course.slug === courseName)) {
    notFound()
  }

  const structure = getCourseStructure(courseName)
  const courseMeta = getCourseContentIndex(courseName)
  const chapters = structure.chapters.filter(
    (chapter) => chapter.status !== 'draft' && chapter.status !== 'archived',
  )
  const indexFile = structure.index?.file
  const indexMeta = structure.index

  // If no chapter slug, show course index
  if (!chapterSlug) {
    if (indexFile) {
      let indexPost
      try {
        indexPost = getPostBySlug(`courses/${courseName}`, indexFile.replace(/\.(md|mdx)$/, ''))
      } catch {
        notFound()
      }

      const marker = '__COURSE_PATH__'
      const rewrittenContent = indexPost.content
        .replaceAll(`/courses/${courseName}/`, marker)
        .replaceAll(`/${courseName}/`, `/courses/${courseName}/`)
        .replaceAll(marker, `/courses/${courseName}/`)

      return (
        <Box>
          <Navigation />
          <Box pt="72px" minH="100vh" bg="white">
            <SiteContainer maxW="full" py={16}>
              <Box maxW="3xl" mx="auto" w="100%">
                <VStack align="flex-start" textAlign="left" gap={4} mb={8}>
                  <Link href="/courses">
                    <Text
                      color="orange.500"
                      fontSize="sm"
                      _hover={{ textDecoration: 'underline' }}
                      textAlign="left"
                      width="100%"
                    >
                      ← Back to Courses
                    </Text>
                  </Link>
                  <Heading as="h1" size="2xl" color="gray.800" lineHeight="1.2">
                    {courseMeta?.title || courseName.toUpperCase().replace(/-/g, ' ')}
                  </Heading>
                  {(indexMeta?.description || indexPost.meta.description) && (
                    <Text color="gray.700" fontSize="lg" fontWeight="semibold" maxW="2xl">
                      {indexMeta?.description || indexPost.meta.description}
                    </Text>
                  )}
                </VStack>

                <Box className="prose" textAlign="left">
                  <MDXRemote source={rewrittenContent} />
                </Box>
              </Box>
            </SiteContainer>
          </Box>
          <Footer />
        </Box>
      )
    }

    return (
      <Box>
        <Navigation />
        <Box pt="72px" minH="100vh" bg="gray.50">
          <SiteContainer py={16}>
            <VStack align="flex-start" gap={6} mb={8}>
              <Link href="/courses">
                <Text color="orange.500" fontSize="sm" _hover={{ textDecoration: 'underline' }}>
                  ← Back to Courses
                </Text>
              </Link>
              <Heading as="h1" size="2xl" color="gray.800">
                {courseMeta?.title || courseName.toUpperCase().replace(/-/g, ' ')}
              </Heading>
              {courseMeta?.description && <Text color="gray.600">{courseMeta.description}</Text>}
            </VStack>

            <VStack align="stretch" gap={3}>
              {chapters.map((chapter, index) => (
                <Link key={chapter.slug} href={`/courses/${courseName}/${chapter.slug}`}>
                  <Box
                    bg="white"
                    p={4}
                    borderRadius="lg"
                    boxShadow="sm"
                    transition="all 0.2s"
                    _hover={{ boxShadow: 'md', transform: 'translateX(4px)' }}
                    border="1px solid"
                    borderColor="gray.100"
                  >
                    <HStack gap={4}>
                      <Text color="orange.500" fontWeight="bold" fontSize="lg" minW="40px">
                        {(index + 1).toString().padStart(2, '0')}
                      </Text>
                      <VStack align="flex-start" gap={0}>
                        <Text color="gray.700" fontWeight="medium">
                          {chapter.title}
                        </Text>
                        {chapter.description && (
                          <Text color="gray.500" fontSize="sm">
                            {chapter.description}
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  </Box>
                </Link>
              ))}
            </VStack>
          </SiteContainer>
        </Box>
        <Footer />
      </Box>
    )
  }

  // Show chapter content
  let post
  try {
    const session = getCourseSessionBySlug(courseName, chapterSlug)
    if (!session) {
      notFound()
    }
    const fileSlug = session?.file?.replace(/\.(md|mdx)$/, '') || chapterSlug
    post = getPostBySlug(`courses/${courseName}`, fileSlug)
  } catch {
    notFound()
  }

  const currentIndex = chapters.findIndex((c) => c.slug === chapterSlug)
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  // Check if this is a slides layout
  const isSlides = post.meta.layout === 'slides'

  if (isSlides) {
    const courseHome = `/courses/${courseName}`
    const footer = (post.meta.footer as string) || ''

    return (
      <SlidePresentation courseHome={courseHome} footer={footer}>
        <MDXRemote source={post.content} />
      </SlidePresentation>
    )
  }

  return (
    <Box>
      <Navigation />
      <Box pt="72px" minH="100vh" bg="white">
        <SiteContainer maxW="container.md" py={16}>
          <VStack align="flex-start" gap={4} mb={8}>
            <Link href={`/courses/${courseName}`}>
              <Text color="orange.500" fontSize="sm" _hover={{ textDecoration: 'underline' }}>
                ← Back to {courseName}
              </Text>
            </Link>
            <Heading as="h1" size="2xl" color="gray.800" lineHeight="1.2">
              {post.meta.title}
            </Heading>
            <Text color="gray.400" fontSize="sm">
              {post.meta.readingTime}
            </Text>
          </VStack>

          <Box className="prose">
            <MDXRemote source={post.content} />
          </Box>

          {/* Navigation */}
          <HStack justify="space-between" mt={12} pt={8} borderTop="1px solid" borderColor="gray.200">
            {prevChapter ? (
              <Link href={`/courses/${courseName}/${prevChapter.slug}`}>
                <VStack align="flex-start" gap={0}>
                  <Text color="gray.400" fontSize="xs">
                    Previous
                  </Text>
                  <Text color="orange.500" fontWeight="medium" _hover={{ textDecoration: 'underline' }}>
                    ← {prevChapter.title}
                  </Text>
                </VStack>
              </Link>
            ) : (
              <Box />
            )}
            {nextChapter && (
              <Link href={`/courses/${courseName}/${nextChapter.slug}`}>
                <VStack align="flex-end" gap={0}>
                  <Text color="gray.400" fontSize="xs">
                    Next
                  </Text>
                  <Text color="orange.500" fontWeight="medium" _hover={{ textDecoration: 'underline' }}>
                    {nextChapter.title} →
                  </Text>
                </VStack>
              </Link>
            )}
          </HStack>
        </SiteContainer>
      </Box>
      <Footer />
    </Box>
  )
}
