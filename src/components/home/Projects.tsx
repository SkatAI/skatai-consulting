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
      bg="white"
      p={6}
      borderRadius="xl"
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
      border="1px solid"
      borderColor="gray.100"
      height="100%"
      cursor={link ? 'pointer' : 'default'}
    >
      <VStack align="flex-start" gap={4} height="100%">
        <VStack align="flex-start" gap={2} flex="1">
          <Heading as="h3" size="md" color="gray.800">
            {title}
          </Heading>
          <Text color="gray.600" fontSize="sm" lineHeight="tall">
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
      <NextLink href={link} passHref legacyBehavior>
        <Link _hover={{ textDecoration: 'none' }}>{content}</Link>
      </NextLink>
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
    <Box as="section" py={{ base: 16, md: 24 }} bg="gray.50" id="projects">
      <Container maxW="container.xl">
        <VStack gap={4} mb={12} textAlign="center">
          <Text
            color="orange.500"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            fontSize="sm"
          >
            Featured Work
          </Text>
          <Heading as="h2" size="2xl" color="gray.800">
            Courses & Projects
          </Heading>
          <Text color="gray.600" fontSize="lg" maxW="2xl">
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
