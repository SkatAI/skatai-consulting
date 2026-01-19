'use client'

import { Box, Container, Heading, Text, Button, VStack, HStack } from '@chakra-ui/react'
import Link from 'next/link'

export function Hero() {
  return (
    <Box
      as="section"
      bg="linear-gradient(135deg, var(--color-bg-dark-primary) 0%, var(--color-bg-dark-secondary) 50%, var(--color-bg-dark-tertiary) 100%)"
      color="var(--color-white)"
      py={{ base: 20, md: 32 }}
      minH="90vh"
      display="flex"
      alignItems="center"
    >
      <Container maxW="container.xl" px={{ base: 4, md: 8, lg: 16 }}>
        <VStack gap={6} align="flex-start" maxW="3xl">
          <Text
            color="var(--color-brand-primary)"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            fontSize="sm"
          >
            AI & Machine Learning Consulting
          </Text>
          <Heading as="h1" size="4xl" lineHeight="1.1" fontWeight="bold">
            Transform Your Business with{' '}
            <Text as="span" color="var(--color-brand-primary)">
              Intelligent Solutions
            </Text>
          </Heading>
          <Text fontSize="xl" color="var(--color-gray-300)" maxW="2xl" lineHeight="tall">
            Expert consulting in MLOps, AI Strategy, and Custom Machine Learning. We help
            organizations leverage AI to drive innovation, efficiency, and growth.
          </Text>
          <HStack gap={4} pt={4}>
            <Link href="#contact">
              <Button
                size="lg"
                colorPalette="orange"
                px={8}
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                Get in Touch
              </Button>
            </Link>
            <Link href="/courses">
              <Button
                size="lg"
                variant="outline"
                borderColor="var(--color-brand-primary)"
                color="var(--color-brand-primary)"
                px={8}
                _hover={{ bg: 'var(--color-brand-primary)', color: 'var(--color-white)' }}
                transition="all 0.2s"
              >
                Explore Courses
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}
