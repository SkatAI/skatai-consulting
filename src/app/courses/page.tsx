import { Box, Heading, Text, VStack, SimpleGrid, Badge, HStack } from '@chakra-ui/react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { getCourseIndex, getCourseStructure } from '@/lib/mdx'
import { SiteContainer } from '@/components/layout/SiteContainer'

export const metadata = {
  title: 'Courses - SkatAI',
  description: 'Educational courses on MLOps, AI, Machine Learning, and Data Science',
}

interface CourseInfo {
  slug: string
  title: string
  description: string
  tags: string[]
  chapters: number
}

export default function CoursesPage() {
  const courseIndex = getCourseIndex()
  const courses: CourseInfo[] = courseIndex
    .filter((course) => course.status === 'live')
    .slice()
    .sort((a, b) => {
      const orderA = a.order ?? Number.POSITIVE_INFINITY
      const orderB = b.order ?? Number.POSITIVE_INFINITY
      return orderA - orderB || a.title.localeCompare(b.title)
    })
    .map((course) => {
      const structure = getCourseStructure(course.slug)
      return {
        slug: course.slug,
        title: course.title,
        description: course.description,
        tags: course.tags ?? [],
        chapters: structure.chapters.length,
      }
    })

  return (
    <Box>
      <Navigation />
      <Box pt="72px" minH="100vh" bg="var(--color-gray-300)">
        <SiteContainer py={16}>
          <VStack gap={4} mb={12} textAlign="center">
            <Text
              color="orange.500"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wider"
              fontSize="sm"
            >
              Educational Content
            </Text>
            <Heading as="h1" size="2xl" color="gray.800">
              Courses
            </Heading>
            <Text color="gray.600" fontSize="lg" maxW="2xl">
              Comprehensive courses on AI, Machine Learning, MLOps, and Data Science.
            </Text>
          </VStack>

          {courses.length === 0 ? (
            <Box textAlign="center" py={16}>
              <Text color="gray.500">No courses available yet.</Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
              {courses.map((course) => (
                <Link key={course.slug} href={`/courses/${course.slug}`}>
                  <Box
                    bg="white"
                    p={6}
                    borderRadius="xl"
                    boxShadow="md"
                    transition="all 0.3s"
                    _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                    border="1px solid"
                    borderColor="gray.100"
                    height="100%"
                  >
                    <VStack align="flex-start" gap={3} height="100%">
                      <Heading as="h2" size="md" color="gray.800">
                        {course.title}
                      </Heading>
                      <Text color="gray.600" fontSize="sm" lineHeight="tall" flex="1">
                        {course.description}
                      </Text>
                      <Text color="gray.400" fontSize="xs">
                        {course.chapters} chapters
                      </Text>
                      <HStack flexWrap="wrap" gap={2}>
                        {course.tags.map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </HStack>
                    </VStack>
                  </Box>
                </Link>
              ))}
            </SimpleGrid>
          )}
        </SiteContainer>
      </Box>
      <Footer />
    </Box>
  )
}
