'use client'

import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack } from '@chakra-ui/react'

interface StatProps {
  value: string
  label: string
}

function Stat({ value, label }: StatProps) {
  return (
    <VStack gap={1}>
      <Text fontSize="5xl" fontWeight="bold" color="orange.500" lineHeight="1">
        {value}
      </Text>
      <Text color="gray.600" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
        {label}
      </Text>
    </VStack>
  )
}

export function Experience() {
  const stats = [
    { value: '25+', label: 'Years in Software & AI' },
    { value: '8+', label: 'Years Freelance AI' },
    { value: '2', label: 'Published ML Books' },
    { value: '7+', label: 'Schools & Programs Taught' },
  ]

  const highlights = [
    {
      year: '2024–2025',
      title: 'GenAI Applications',
      description: 'Built end-to-end GenAI products, from UX to production infrastructure',
    },
    {
      year: '2022–2023',
      title: 'Karhoo (Renault Group)',
      description: 'Led mobility ML projects: pricing, coverage optimization, cancellation forecasting',
    },
    {
      year: '2021–2022',
      title: 'Praexo (Fintech)',
      description: 'Launched NLP and recommendation services in production on AWS',
    },
    {
      year: '2011–2016',
      title: 'Berklee Online',
      description: 'Built data and software systems for a global education platform',
    },
  ]

  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      bg="white"
      color="gray.900"
      id="experience"
    >
      <Container maxW="container.xl" px={{ base: 4, md: 8, lg: 16 }}>
        <VStack gap={4} mb={16} textAlign="center">
          <Text
            color="orange.600"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            fontSize="sm"
          >
            Track Record
          </Text>
          <Heading as="h2" size="2xl">
            Experience & Credibility
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
              bg="gray.50"
              borderRadius="lg"
              borderLeft="4px solid"
              borderLeftColor="orange.500"
              transition="all 0.2s"
              _hover={{ bg: 'orange.50' }}
            >
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="orange.500"
                minW="60px"
                textAlign="center"
              >
                {item.year}
              </Text>
              <VStack align="flex-start" gap={1}>
                <Heading as="h4" size="md">
                  {item.title}
                </Heading>
                <Text color="gray.600" fontSize="sm">
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
