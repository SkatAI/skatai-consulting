'use client'

import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack } from '@chakra-ui/react'

interface StatProps {
  value: string
  label: string
}

function Stat({ value, label }: StatProps) {
  return (
    <VStack gap={1}>
      <Text fontSize="5xl" fontWeight="bold" color="orange.400" lineHeight="1">
        {value}
      </Text>
      <Text color="gray.400" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
        {label}
      </Text>
    </VStack>
  )
}

export function Experience() {
  const stats = [
    { value: '10+', label: 'Years Experience' },
    { value: '50+', label: 'Projects Delivered' },
    { value: '20+', label: 'Enterprise Clients' },
    { value: '200+', label: 'Students Trained' },
  ]

  const highlights = [
    {
      year: 'Today',
      title: 'AI & ML Consulting',
      description: 'Helping organizations build and deploy production ML systems',
    },
    {
      year: '2020',
      title: 'MLOps Education',
      description: 'Developing comprehensive courses on ML engineering best practices',
    },
    {
      year: '2015',
      title: 'Data Science',
      description: 'Building data-driven solutions for startups and enterprises',
    },
    {
      year: '2010',
      title: 'Software Engineering',
      description: 'Full-stack development and system architecture',
    },
  ]

  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      bg="linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
      color="white"
      id="experience"
    >
      <Container maxW="container.xl">
        <VStack gap={4} mb={16} textAlign="center">
          <Text
            color="orange.400"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            fontSize="sm"
          >
            Track Record
          </Text>
          <Heading as="h2" size="2xl">
            Experience & Expertise
          </Heading>
        </VStack>

        <SimpleGrid columns={{ base: 2, md: 4 }} gap={8} mb={16}>
          {stats.map((stat) => (
            <Stat key={stat.label} {...stat} />
          ))}
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
          {highlights.map((item) => (
            <HStack
              key={item.year}
              gap={6}
              p={6}
              bg="whiteAlpha.100"
              borderRadius="lg"
              borderLeft="4px solid"
              borderLeftColor="orange.400"
              transition="all 0.2s"
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="orange.400"
                minW="60px"
                textAlign="center"
              >
                {item.year}
              </Text>
              <VStack align="flex-start" gap={1}>
                <Heading as="h4" size="md">
                  {item.title}
                </Heading>
                <Text color="gray.400" fontSize="sm">
                  {item.description}
                </Text>
              </VStack>
            </HStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}
