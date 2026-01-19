'use client'

import { Box, Container, Heading, Text, VStack, HStack, Link, Input, Textarea, Button, SimpleGrid } from '@chakra-ui/react'

export function Contact() {
  return (
    <Box as="section" py={{ base: 16, md: 24 }} bg="white" id="contact">
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={16}>
          <VStack align="flex-start" gap={6}>
            <Text
              color="orange.500"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wider"
              fontSize="sm"
            >
              Get in Touch
            </Text>
            <Heading as="h2" size="2xl" color="gray.800">
              Let&apos;s Work Together
            </Heading>
            <Text color="gray.600" fontSize="lg" lineHeight="tall">
              Have a project in mind or want to discuss how AI can transform your business? I&apos;d
              love to hear from you.
            </Text>
            <VStack align="flex-start" gap={4} pt={4}>
              <HStack gap={3}>
                <Text fontSize="xl">📧</Text>
                <Link href="mailto:contact@skatai.com" color="gray.700" _hover={{ color: 'orange.500' }}>
                  contact@skatai.com
                </Link>
              </HStack>
              <HStack gap={3}>
                <Text fontSize="xl">🔗</Text>
                <Link
                  href="https://linkedin.com/in/skatai"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="gray.700"
                  _hover={{ color: 'orange.500' }}
                >
                  LinkedIn
                </Link>
              </HStack>
              <HStack gap={3}>
                <Text fontSize="xl">🐙</Text>
                <Link
                  href="https://github.com/skatai"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="gray.700"
                  _hover={{ color: 'orange.500' }}
                >
                  GitHub
                </Link>
              </HStack>
            </VStack>
          </VStack>

          <Box bg="gray.50" p={8} borderRadius="xl">
            <VStack as="form" gap={4} align="stretch">
              <Box>
                <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.700">
                  Name
                </Text>
                <Input
                  placeholder="Your name"
                  bg="white"
                  borderColor="gray.200"
                  _hover={{ borderColor: 'gray.300' }}
                  _focus={{ borderColor: 'orange.400', boxShadow: '0 0 0 1px orange.400' }}
                />
              </Box>
              <Box>
                <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.700">
                  Email
                </Text>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  bg="white"
                  borderColor="gray.200"
                  _hover={{ borderColor: 'gray.300' }}
                  _focus={{ borderColor: 'orange.400', boxShadow: '0 0 0 1px orange.400' }}
                />
              </Box>
              <Box>
                <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.700">
                  Message
                </Text>
                <Textarea
                  placeholder="Tell me about your project..."
                  rows={5}
                  bg="white"
                  borderColor="gray.200"
                  _hover={{ borderColor: 'gray.300' }}
                  _focus={{ borderColor: 'orange.400', boxShadow: '0 0 0 1px orange.400' }}
                />
              </Box>
              <Button
                type="submit"
                colorPalette="orange"
                size="lg"
                mt={2}
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                Send Message
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  )
}
