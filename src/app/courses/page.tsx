import { Box, Heading, Text, VStack, SimpleGrid, Badge, HStack } from '@chakra-ui/react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { getAllCourses, getCourseStructure } from '@/lib/mdx'
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

const courseMetadata: Record<string, Omit<CourseInfo, 'slug' | 'chapters'>> = {
  'mlops-dpe': {
    title: 'MLOps',
    description: 'End-to-end machine learning operations: from model development to deployment and monitoring.',
    tags: ['MLOps', 'Python', 'Docker'],
  },
  'ml2llm': {
    title: 'ML to LLM',
    description: 'Transition from traditional machine learning to large language models and generative AI.',
    tags: ['LLMs', 'NLP', 'Transformers'],
  },
  'nosql': {
    title: 'NoSQL Databases',
    description: 'Deep dive into NoSQL database systems and data modeling patterns.',
    tags: ['MongoDB', 'Neo4j', 'Redis'],
  },
  'dbsql': {
    title: 'SQL Databases',
    description: 'Comprehensive course on SQL databases, queries, and optimization.',
    tags: ['SQL', 'PostgreSQL', 'Database'],
  },
  'iabiz': {
    title: 'AI for Business',
    description: 'Strategic frameworks for identifying AI opportunities and implementing solutions.',
    tags: ['Strategy', 'Business', 'AI'],
  },
  'initml': {
    title: 'Introduction to ML',
    description: 'Fundamentals of machine learning: algorithms, techniques, and practical applications.',
    tags: ['ML', 'Python', 'Scikit-learn'],
  },
  'inwai': {
    title: 'Investigating with AI',
    description: 'Using AI tools for investigation, analysis, and research.',
    tags: ['AI', 'Analysis', 'Research'],
  },
  'python': {
    title: 'Python Programming',
    description: 'Python programming fundamentals for data science and ML.',
    tags: ['Python', 'Programming'],
  },
  'ipsadb': {
    title: 'IPSA Databases',
    description: 'Database fundamentals and advanced concepts.',
    tags: ['SQL', 'Database', 'Design'],
  },
}

export default function CoursesPage() {
  const courseSlugs = getAllCourses()

  const courses: CourseInfo[] = courseSlugs.map((slug) => {
    const structure = getCourseStructure(slug)
    const meta = courseMetadata[slug] || {
      title: slug,
      description: 'Course content',
      tags: [],
    }
    return {
      slug,
      ...meta,
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
                          <Badge key={tag} colorPalette="orange" variant="subtle" fontSize="xs">
                            {tag}
                          </Badge>
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
