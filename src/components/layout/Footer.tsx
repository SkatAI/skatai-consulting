'use client'

import { Box, Container, HStack, VStack, Text, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <Box as="footer" bg="gray.900" color="gray.400" py={12}>
      <Container maxW="container.xl">
        <VStack gap={8}>
          <HStack gap={8} flexWrap="wrap" justify="center">
            <Link
              as={NextLink}
              href="/courses"
              _hover={{ color: 'orange.400' }}
              transition="color 0.2s"
            >
              Courses
            </Link>
            <Link
              as={NextLink}
              href="/blog"
              _hover={{ color: 'orange.400' }}
              transition="color 0.2s"
            >
              Blog
            </Link>
            <Link
              as={NextLink}
              href="/#contact"
              _hover={{ color: 'orange.400' }}
              transition="color 0.2s"
            >
              Contact
            </Link>
            <Link
              href="https://github.com/skatai"
              target="_blank"
              rel="noopener noreferrer"
              _hover={{ color: 'orange.400' }}
              transition="color 0.2s"
            >
              GitHub
            </Link>
            <Link
              href="https://linkedin.com/in/skatai"
              target="_blank"
              rel="noopener noreferrer"
              _hover={{ color: 'orange.400' }}
              transition="color 0.2s"
            >
              LinkedIn
            </Link>
          </HStack>

          <Box textAlign="center">
            <Text fontSize="lg" fontWeight="bold" color="white" mb={2}>
              Skat<Text as="span" color="orange.400">AI</Text>
            </Text>
            <Text fontSize="sm">© {currentYear} SkatAI. All rights reserved.</Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
