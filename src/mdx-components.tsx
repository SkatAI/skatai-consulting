import type { MDXComponents } from 'mdx/types'
import { Heading, Text, Code, Link, Box } from '@chakra-ui/react'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <Heading as="h1" size="2xl" mb={4}>
        {children}
      </Heading>
    ),
    h2: ({ children }) => (
      <Heading as="h2" size="xl" mb={3} mt={6}>
        {children}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading as="h3" size="lg" mb={2} mt={4}>
        {children}
      </Heading>
    ),
    p: ({ children }) => (
      <Text mb={4} lineHeight="tall">
        {children}
      </Text>
    ),
    code: ({ children }) => (
      <Code px={2} py={1} borderRadius="md">
        {children}
      </Code>
    ),
    pre: ({ children }) => (
      <Box as="pre" p={4} borderRadius="md" bg="gray.50" color="gray.800" overflow="auto" mb={4}>
        {children}
      </Box>
    ),
    a: ({ href, children }) => (
      <Link href={href} color="blue.500" textDecoration="underline">
        {children}
      </Link>
    ),
    ...components,
  }
}
