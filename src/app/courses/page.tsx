import { Box, Heading, Text, VStack, SimpleGrid, Badge, HStack } from '@chakra-ui/react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { getCourseIndex, getCourseStructure } from '@/lib/mdx'
import { SiteContainer } from '@/components/layout/SiteContainer'

export const metadata = {
  title: 'Courses - Alexis Perrier',
  description: 'Educational courses on MLOps, AI, Machine Learning, and Data Science',
}

interface CourseInfo {
  slug: string
  title: string
  description: string
  tags: string[]
  chapters: number
  background?: string
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
        background: course.background,
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
              {courses.map((course) => {
                const hasBackground = Boolean(course.background)

                return (
                  <Link key={course.slug} href={`/courses/${course.slug}`}>
                    <Box
                      position="relative"
                      overflow="hidden"
                      bg={hasBackground ? 'gray.900' : 'white'}
                      style={
                        hasBackground
                          ? {
                              backgroundImage: `url(${course.background})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }
                          : undefined
                      }
                      borderRadius="xl"
                      boxShadow="md"
                      transition="all 0.3s"
                      _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                      border="1px solid"
                      borderColor={hasBackground ? 'transparent' : 'gray.100'}
                      height="100%"
                      minH={hasBackground ? '300px' : undefined}
                    >
                      {/* Dark scrim so the text stays readable over the photo */}
                      {hasBackground && (
                        <Box
                          position="absolute"
                          inset="0"
                          background="linear-gradient(180deg, rgba(15,23,42,0.45) 0%, rgba(15,23,42,0.72) 45%, rgba(15,23,42,0.93) 100%)"
                        />
                      )}
                      <VStack
                        align="flex-start"
                        gap={3}
                        height="100%"
                        p={6}
                        position="relative"
                        zIndex={1}
                      >
                        <Heading
                          as="h2"
                          size="md"
                          color={hasBackground ? 'white' : 'gray.800'}
                          textShadow={hasBackground ? '0 2px 6px rgba(0,0,0,0.6)' : undefined}
                        >
                          {course.title}
                        </Heading>
                        <Text
                          color={hasBackground ? 'rgba(255,255,255,0.92)' : 'gray.600'}
                          fontSize="sm"
                          lineHeight="tall"
                          flex="1"
                          textShadow={hasBackground ? '0 1px 4px rgba(0,0,0,0.65)' : undefined}
                        >
                          {course.description}
                        </Text>
                        <Text color={hasBackground ? 'rgba(255,255,255,0.7)' : 'gray.400'} fontSize="xs">
                          {course.chapters} chapters
                        </Text>
                        <HStack flexWrap="wrap" gap={2}>
                          {course.tags.map((tag) =>
                            hasBackground ? (
                              <Badge
                                key={tag}
                                bg="rgba(255,255,255,0.2)"
                                color="white"
                                borderWidth="1px"
                                borderColor="rgba(255,255,255,0.35)"
                                backdropFilter="blur(4px)"
                              >
                                {tag}
                              </Badge>
                            ) : (
                              <Badge key={tag}>{tag}</Badge>
                            ),
                          )}
                        </HStack>
                      </VStack>
                    </Box>
                  </Link>
                )
              })}
            </SimpleGrid>
          )}
        </SiteContainer>
      </Box>
      <Footer />
    </Box>
  )
}
