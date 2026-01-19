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
      borderColor="gray.200"
      height="100%"
      cursor={link ? 'pointer' : 'default'}
    >
      <VStack align="flex-start" gap={4} height="100%">
        <VStack align="flex-start" gap={2} flex="1">
          <Heading as="h3" size="md" color="gray.900">
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
      title: 'Mimesis Interview Coach',
      description:
        'A GenAI chatbot for student interview training and evaluation, designed as a full application rather than a demo.',
      tags: ['GenAI', 'Chatbot', 'Evaluation'],
    },
    {
      title: 'Moliere.love',
      description:
        'Educational web and mobile app built end-to-end with a GenAI content pipeline and full product stack.',
      tags: ['Full-Stack', 'GenAI', 'Mobile'],
    },
    {
      title: 'Karhoo Mobility ML',
      description:
        'Led pricing, coverage optimization, and cancellation forecasting for a global taxi marketplace.',
      tags: ['Forecasting', 'GCP', 'MLOps'],
    },
    {
      title: 'Courses & Writing',
      description:
        'ML and GenAI courses used in universities and online programs, plus published books on applied ML.',
      tags: ['Teaching', 'Books', 'Courses'],
      link: '/courses',
    },
  ]

  return (
    <Box as="section" py={{ base: 16, md: 24 }} bg="gray.50" id="projects">
      <Container maxW="container.xl" px={{ base: 4, md: 8, lg: 16 }}>
        <VStack gap={4} mb={12} textAlign="center">
          <Text
            color="orange.600"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            fontSize="sm"
          >
            Selected Work
          </Text>
          <Heading as="h2" size="2xl" color="gray.900">
            Recent Projects & Assets
          </Heading>
          <Text color="gray.600" fontSize="lg" maxW="2xl">
            A snapshot of the kind of work I deliver, plus the educational material that supports it.
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
