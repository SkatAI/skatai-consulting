'use client'

import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid } from '@chakra-ui/react'

interface StatProps {
  value: string
  label: string
}

function Stat({ value, label }: StatProps) {
  return (
    <HStack align="baseline" gap={3} whiteSpace="nowrap">
      <Text fontSize="4xl" fontWeight="bold" color="orange.500" lineHeight="1">
        {value}
      </Text>
      <Text
        color="gray.500"
        fontSize={{ base: '2xl', md: '3xl' }}
        fontWeight="semibold"
        letterSpacing="wide"
        textTransform="uppercase"
      >
        {label}
      </Text>
    </HStack>
  )
}

export function Hero() {
  const stats = [
    { value: '10+', label: 'Years Freelance ML/AI' },
    { value: '25+', label: 'ML/AI Projects' },
    { value: '10+', label: 'Schools & Programs Taught' },
  ]

  return (
    <Box
      as="section"
      bgGradient="linear(to-br, orange.50, white, gray.50)"
      color="gray.900"
      py={{ base: 20, md: 32 }}
      minH="90vh"
      display="flex"
      alignItems="center"
    >
      <Container maxW="container.xl" px={{ base: 4, md: 8, lg: 16 }}>
        <Box maxW="960px" mx="auto" w="100%">
          <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            gap={{ base: 12, lg: 10 }}
            alignItems="start"
            w="100%"
          >
            <VStack
              gap={6}
              align="flex-start"
              w="100%"
              h="100%"
              justify="space-between"
            >
              <VStack gap={6} align="flex-start">
                <Heading as="h1" size="4xl" lineHeight="1.1" fontWeight="bold">
                  AI: from{' '}
                  <Text as="span" color="orange.500">
                    idea to production
                  </Text>
                </Heading>
                <Text fontSize="xl" color="gray.600" maxW="2xl" lineHeight="tall">
                  I help startups and small teams design, build, and ship pragmatic AI products.
                  <br /><br />From strategy to POCs to production, <br />I bring 25+ years of software
                  experience<br /><br />with deep expertise in <em>GenAI</em>, <em>NLP</em>, <em>Machine Learning</em> and <em>Data Science</em>.
                </Text>
              </VStack>
              <Text
                color="orange.600"
                fontWeight="semibold"
                textTransform="uppercase"
                letterSpacing="wider"
                fontSize={{ base: 'md', lg: 'lg' }}
              >
                Alexis Perrier, PhD · SkatAI
              </Text>
            </VStack>
            <Box w="100%">
              <SimpleGrid columns={1} gap={6}>
                {stats.map((stat) => (
                  <Stat key={stat.label} {...stat} />
                ))}
              </SimpleGrid>
            </Box>
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  )
}
