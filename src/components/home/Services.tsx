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
      bg="var(--color-white)"
      p={8}
      borderRadius="xl"
      boxShadow="lg"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
      border="1px solid"
      borderColor="var(--color-gray-100)"
    >
      <VStack align="flex-start" gap={4}>
        <Text fontSize="4xl">{icon}</Text>
        <Heading as="h3" size="lg" color="var(--color-gray-800)">
          {title}
        </Heading>
        <Text color="var(--color-gray-600)" lineHeight="tall">
          {description}
        </Text>
      </VStack>
    </Box>
  )
}

export function Services() {
  const services = [
    {
      icon: '⚙️',
      title: 'MLOps',
      description:
        'End-to-end machine learning operations: from model development to deployment and monitoring. Build robust, scalable ML pipelines that deliver real business value.',
    },
    {
      icon: '🎯',
      title: 'AI Strategy',
      description:
        'Strategic guidance on AI adoption and implementation. Identify high-impact opportunities, assess technical feasibility, and create actionable roadmaps.',
    },
    {
      icon: '🔧',
      title: 'Custom ML Solutions',
      description:
        'Bespoke machine learning models tailored to your specific business needs. From natural language processing to computer vision and predictive analytics.',
    },
  ]

  return (
    <Box as="section" py={{ base: 16, md: 24 }} bg="var(--color-gray-300)" id="services">
      <Container maxW="container.xl" px={{ base: 4, md: 8, lg: 16 }}>
        <VStack gap={4} mb={12} textAlign="center">
          <Text
            color="var(--color-brand-secondary)"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            fontSize="sm"
          >
            What We Do
          </Text>
          <Heading as="h2" size="2xl" color="var(--color-gray-800)">
            Services
          </Heading>
          <Text color="var(--color-gray-600)" fontSize="lg" maxW="2xl">
            Comprehensive AI and ML consulting services to help your organization thrive in the age
            of artificial intelligence.
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
