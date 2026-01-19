import { Box, Container, Heading, Text, VStack, SimpleGrid, Badge, HStack } from '@chakra-ui/react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { getAllPosts } from '@/lib/mdx'

export const metadata = {
  title: 'Blog - SkatAI',
  description: 'Articles on AI, Machine Learning, and MLOps',
}

export default function BlogPage() {
  const posts = getAllPosts('blog')

  return (
    <Box>
      <Navigation />
      <Box pt="72px" minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={16}>
          <VStack gap={4} mb={12} textAlign="center">
            <Text
              color="orange.500"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wider"
              fontSize="sm"
            >
              Latest Articles
            </Text>
            <Heading as="h1" size="2xl" color="gray.800">
              Blog
            </Heading>
            <Text color="gray.600" fontSize="lg" maxW="2xl">
              Thoughts on AI, Machine Learning, Data Science, and MLOps.
            </Text>
          </VStack>

          {posts.length === 0 ? (
            <Box textAlign="center" py={16}>
              <Text color="gray.500">No posts yet. Check back soon!</Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
              {posts.map((post) => (
                <Link key={post.meta.slug} href={`/blog/${post.meta.slug}`}>
                  <Box
                    bg="white"
                    p={6}
                    borderRadius="xl"
                    boxShadow="md"
                    transition="all 0.3s"
                    _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                    border="1px solid"
                    borderColor="gray.100"
                    height="100%"
                  >
                    <VStack align="flex-start" gap={3}>
                      <Text color="gray.400" fontSize="sm">
                        {new Date(post.meta.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        {' · '}
                        {post.meta.readingTime}
                      </Text>
                      <Heading as="h2" size="md" color="gray.800">
                        {post.meta.title}
                      </Heading>
                      {post.meta.description && (
                        <Text color="gray.600" fontSize="sm" lineHeight="tall">
                          {post.meta.description}
                        </Text>
                      )}
                      {post.meta.tags && (
                        <HStack flexWrap="wrap" gap={2}>
                          {post.meta.tags.map((tag: string) => (
                            <Badge key={tag} colorPalette="orange" variant="subtle" fontSize="xs">
                              {tag}
                            </Badge>
                          ))}
                        </HStack>
                      )}
                    </VStack>
                  </Box>
                </Link>
              ))}
            </SimpleGrid>
          )}
        </Container>
      </Box>
      <Footer />
    </Box>
  )
}
