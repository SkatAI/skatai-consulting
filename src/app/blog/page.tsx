import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Badge,
  HStack,
  Link as ChakraLink,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react'
import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { getAllPosts } from '@/lib/mdx'
import { SiteContainer } from '@/components/layout/SiteContainer'

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
        <SiteContainer py={16}>
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
            <SimpleGrid columns={1} gap={8}>
              {posts.map((post) => (
                <LinkBox key={post.meta.slug} as="article" maxW="5xl" mx="auto" w="100%">
                  <Box
                    bg="white"
                    borderRadius="xl"
                    boxShadow="md"
                    transition="all 0.3s"
                    _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                    border="1px solid"
                    borderColor="gray.100"
                    height="100%"
                    w="100%"
                    overflow="hidden"
                  >
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} alignItems="center">
                      <Box p={6}>
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
                            <LinkOverlay asChild>
                              <Link href={`/blog/${post.meta.slug}`}>{post.meta.title}</Link>
                            </LinkOverlay>
                          </Heading>
                          {post.meta.description && (
                            <Text color="gray.600" fontSize="sm" lineHeight="tall">
                              {post.meta.description}
                            </Text>
                          )}
                          {Boolean(post.meta.link) && (
                            <ChakraLink
                              href={post.meta.link as string}
                              color="orange.600"
                              fontSize="sm"
                              fontWeight="semibold"
                              textDecoration="underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {(post.meta.link_text as string) || 'Learn more'}
                            </ChakraLink>
                          )}
                          {post.meta.tags && (
                            <HStack flexWrap="wrap" gap={2}>
                          {post.meta.tags.map((tag: string) => (
                            <Badge
                              key={tag}
                            >
                              {tag}
                            </Badge>
                          ))}
                            </HStack>
                          )}
                        </VStack>
                      </Box>
                      <Box
                        position="relative"
                        w="100%"
                        aspectRatio={{ base: '16 / 9', md: '4 / 3' }}
                        borderRadius={{ base: 'lg', md: '0' }}
                        borderTopRightRadius={{ base: 'lg', md: 'xl' }}
                        borderBottomRightRadius={{ base: 'lg', md: 'xl' }}
                        borderTopLeftRadius={{ base: 'lg', md: '0' }}
                        borderBottomLeftRadius={{ base: 'lg', md: '0' }}
                        overflow="hidden"
                        bg="gray.100"
                      >
                        {Boolean(post.meta.image) && (
                          <Image
                            src={post.meta.image as string}
                            alt={post.meta.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        )}
                      </Box>
                    </SimpleGrid>
                  </Box>
                </LinkBox>
              ))}
            </SimpleGrid>
          )}
        </SiteContainer>
      </Box>
      <Footer />
    </Box>
  )
}
