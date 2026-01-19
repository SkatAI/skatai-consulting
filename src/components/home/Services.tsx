'use client'

import { Box, Container, Heading, Text, SimpleGrid, VStack } from '@chakra-ui/react'

interface ServiceCardProps {
  title: string
  description: string
  icon: string
}

function ServiceCard({ title, description, icon }: ServiceCardProps) {
  return (
    <Box
      bg="white"
      p={8}
      borderRadius="xl"
      boxShadow="lg"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
      border="1px solid"
      borderColor="gray.200"
    >
      <VStack align="flex-start" gap={4}>
        <Text fontSize="4xl">{icon}</Text>
        <Heading as="h3" size="lg" color="gray.900">
          {title}
        </Heading>
        <Text color="gray.600" lineHeight="tall">
          {description}
        </Text>
      </VStack>
    </Box>
  )
}

export function Services() {
  const services = [
    {
      icon: '🧭',
      title: 'Ideation → POC → Production',
      description:
        'Turn a business idea into a working AI product. I scope the opportunity, prototype quickly, validate with users, and build a path to production without over-engineering.',
    },
    {
      icon: '📌',
      title: 'AI Strategy & Delivery',
      description:
        'Clear decisions on what to build, why now, and how to deliver. I help set priorities, manage risks, and align stakeholders with a realistic plan.',
    },
    {
      icon: '⚙️',
      title: 'Engineering & MLOps',
      description:
        'Production-grade implementation across data pipelines, model serving, and cloud infrastructure (GCP/AWS). Reliable systems, measurable outcomes.',
    },
  ]

  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      bg="gray.50"
      id="services"
      scrollMarginTop="96px"
      minH="100vh"
    >
      <Container maxW="container.xl" px={{ base: 4, md: 8, lg: 16 }}>
        <VStack gap={4} mb={12} textAlign="center">
          <Text
            color="orange.600"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            fontSize="sm"
          >
            How I Help
          </Text>
          <Heading as="h2" size="2xl" color="gray.900">
            Consulting Services
          </Heading>
          <Text color="gray.600" fontSize="lg" maxW="2xl">
            Focused, senior-level help for startups and small teams<br />building AI-enabled products.
          </Text>
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}
