import { Box, Heading, Text, VStack, HStack } from '@chakra-ui/react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { getAllCourses, getCourseStructure, getPostBySlug } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import { MDXRemote } from '@/components/MDXRemote'
import { SlidePresentation } from '@/components/slides/SlidePresentation'
import '../../prose.css'
import { SiteContainer } from '@/components/layout/SiteContainer'

interface Props {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  const courses = getAllCourses()
  const params: { slug: string[] }[] = []

  for (const course of courses) {
    // Course index page
    params.push({ slug: [course] })

    // Chapter pages
    const structure = getCourseStructure(course)
    for (const chapter of structure.chapters) {
      params.push({ slug: [course, chapter.slug] })
    }
  }

  return params
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const [courseName, chapterSlug] = slug

  if (chapterSlug) {
    try {
      const post = getPostBySlug(`courses/${courseName}`, chapterSlug)
      return {
        title: `${post.meta.title} - SkatAI`,
        description: post.meta.description || post.meta.title,
      }
    } catch {
      return { title: 'Chapter Not Found - SkatAI' }
    }
  }

  return {
    title: `${courseName} Course - SkatAI`,
    description: `Course content for ${courseName}`,
  }
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  const [courseName, chapterSlug] = slug

  const courses = getAllCourses()
  if (!courses.includes(courseName)) {
    notFound()
  }

  const structure = getCourseStructure(courseName)

  // If no chapter slug, show course index
  if (!chapterSlug) {
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
                {courseName.toUpperCase().replace(/-/g, ' ')}
              </Heading>
            </VStack>

            <VStack align="stretch" gap={3}>
              {structure.chapters.map((chapter, index) => (
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
                      <Text color="gray.700" fontWeight="medium">
                        {chapter.title}
                      </Text>
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
    post = getPostBySlug(`courses/${courseName}`, chapterSlug)
  } catch {
    notFound()
  }

  const currentIndex = structure.chapters.findIndex((c) => c.slug === chapterSlug)
  const prevChapter = currentIndex > 0 ? structure.chapters[currentIndex - 1] : null
  const nextChapter =
    currentIndex < structure.chapters.length - 1 ? structure.chapters[currentIndex + 1] : null

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
