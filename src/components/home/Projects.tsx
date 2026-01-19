'use client'

import { Box, Container, Heading, Text, SimpleGrid, VStack, Badge, HStack, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  link?: string
}

function ProjectCard({ title, description, tags, link }: ProjectCardProps) {
  const content = (
    <Box
      bg="var(--color-white)"
      p={6}
      borderRadius="xl"
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
      border="1px solid"
      borderColor="var(--color-gray-100)"
      height="100%"
      cursor={link ? 'pointer' : 'default'}
    >
      <VStack align="flex-start" gap={4} height="100%">
        <VStack align="flex-start" gap={2} flex="1">
          <Heading as="h3" size="md" color="var(--color-gray-800)">
            {title}
          </Heading>
          <Text color="var(--color-gray-600)" fontSize="sm" lineHeight="tall">
            {description}
          </Text>
        </VStack>
        <HStack flexWrap="wrap" gap={2}>
          {tags.map((tag) => (
            <Badge key={tag} colorPalette="orange" variant="subtle" fontSize="xs">
              {tag}
            </Badge>
          ))}
        </HStack>
      </VStack>
    </Box>
  )

  if (link) {
    return (
      <Link as={NextLink} href={link} _hover={{ textDecoration: 'none' }}>
        {content}
      </Link>
    )
  }

  return content
}

export function Projects() {
  const projects = [
    {
      title: 'MLOps Course',
      description:
        'Comprehensive course covering the full ML lifecycle: data pipelines, model training, deployment, monitoring, and continuous improvement.',
      tags: ['MLOps', 'Python', 'Docker', 'Kubernetes'],
      link: '/courses/mlops-dpe',
    },
    {
      title: 'ML to LLM Transition',
      description:
        'Guide for data scientists transitioning from traditional ML to large language models and generative AI applications.',
      tags: ['LLMs', 'NLP', 'Transformers'],
      link: '/courses/ml2llm',
    },
    {
      title: 'NoSQL Databases',
      description:
        'Deep dive into NoSQL database systems, data modeling patterns, and when to choose different database technologies.',
      tags: ['MongoDB', 'Neo4j', 'Database Design'],
      link: '/courses/nosql',
    },
    {
      title: 'AI for Business',
      description:
        'Strategic frameworks for identifying AI opportunities, building business cases, and implementing AI solutions that deliver ROI.',
      tags: ['Strategy', 'Business', 'AI Adoption'],
      link: '/courses/iabiz',
    },
  ]

  return (
    <Box as="section" py={{ base: 16, md: 24 }} bg="var(--color-gray-50)" id="projects">
      <Container maxW="container.xl" px={{ base: 4, md: 8, lg: 16 }}>
        <VStack gap={4} mb={12} textAlign="center">
          <Text
            color="var(--color-brand-secondary)"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            fontSize="sm"
          >
            Featured Work
          </Text>
          <Heading as="h2" size="2xl" color="var(--color-gray-800)">
            Courses & Projects
          </Heading>
          <Text color="var(--color-gray-600)" fontSize="lg" maxW="2xl">
            Explore our educational content and project portfolio.
          </Text>
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}
