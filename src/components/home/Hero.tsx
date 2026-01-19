'use client'

import { Box, Container, Heading, Text, Button, VStack, HStack } from '@chakra-ui/react'
import Link from 'next/link'

export function Hero() {
  return (
    <Box
      as="section"
      bg="linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
      color="white"
      py={{ base: 20, md: 32 }}
      minH="90vh"
      display="flex"
      alignItems="center"
    >
      <Container maxW="container.xl">
        <VStack gap={6} align="flex-start" maxW="3xl">
          <Text
            color="orange.400"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            fontSize="sm"
          >
            AI & Machine Learning Consulting
          </Text>
          <Heading as="h1" size="4xl" lineHeight="1.1" fontWeight="bold">
            Transform Your Business with{' '}
            <Text as="span" color="orange.400">
              Intelligent Solutions
            </Text>
          </Heading>
          <Text fontSize="xl" color="gray.300" maxW="2xl" lineHeight="tall">
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
                borderColor="orange.400"
                color="orange.400"
                px={8}
                _hover={{ bg: 'orange.400', color: 'white' }}
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
