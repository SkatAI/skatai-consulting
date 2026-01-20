'use client'

import { Box, Heading, Text, SimpleGrid, VStack, Badge, HStack, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { SiteContainer } from '@/components/layout/SiteContainer'

interface ProjectCardProps {
  title: string
  project_description: string
  tags: string[]
  image?: string
  link?: string
  linkText?: string
}

function ProjectCard({ title, project_description, tags, image: _image, link, linkText }: ProjectCardProps) {
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
      position="relative"
    >
      <VStack align="flex-start" gap={4} height="100%">
        <VStack align="flex-start" gap={2} flex="1">
          <Heading
            as="h3"
            size="md"
            fontWeight="bold"
            color="gray.900"
          >
            {title}
          </Heading>
          <Text
            color="gray.600"
            fontSize="sm"
            fontWeight="medium"
            lineHeight="tall"
          >
            {project_description}
          </Text>
          {linkText && (
            <Text color="orange.600" fontSize="sm" fontWeight="semibold">
              {linkText}
            </Text>
          )}
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
      title: 'Mimesis',
      project_description:
        'Interview training platform with adaptive AI personas. Rapid delivery using agentic AI coding practices and deep conceptual work on persona design as a proxy for human social behavior.',
      tags: ['AI', 'Personas', 'Google ADK'],
      link: '/blog/mimesis_project',
      image: '/images/blog/mimesis_illustration_no_text.png'
    },
    {
      title: 'Moliere.love',
      project_description:
        'moliere.love propose une traduction de Molière en français moderne, vers par vers, pour faciliter l’accès aux œuvres étudiées au collège et au lycée. Le projet s’appuie sur l’IA pour rendre ces textes classiques plus lisibles, sans en trahir le sens.',
      tags: ['GenAI', 'Education', 'AI agent', 'Claude'],
      link: '/blog/moliere_project',
      image: '/images/blog/moliere_illustration_no_text.png'
    },
    {
      title: 'Karhoo Mobility ML',
      project_description:
        'Led the migration from bespoke scikit-learn models to Vertex AI AutoML to improve real-time taxi pricing accuracy, scalability, and cost efficiency across a global marketplace.',
      tags: ['Forecasting', 'GCP', 'MLOps'],
      link: '/blog/karhoo_lead_ML',
    },
    {
      title: 'AI-Driven PMF Validation',
      project_description:
        'How AI helped validate startup ideas quickly, even when the business case didn’t hold',
      tags: ['AI experimentation', 'product–market fit', 'startup strategy', 'rapid prototyping'],
      link: '/blog/testing_ideas_with_AI',
    },
  ]

  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      bg="gray.50"
      id="projects"
      scrollMarginTop="96px"
      minH="100vh"
    >
      <SiteContainer>
        <VStack gap={4} mb={12} textAlign="center">
          <Heading
            color="orange.600"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            fontSize="2xl"
            as="h2"
            //  size="2xl"
          >
            Recent Projects & Assets
          </Heading>
          <Text color="gray.600" fontSize="lg" maxW="2xl">
            A snapshot of the kind of work I deliver.
          </Text>
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </SimpleGrid>
      </SiteContainer>
    </Box>
  )
}
