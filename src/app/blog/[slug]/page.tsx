import { Box, Heading, Text, VStack, Badge, HStack } from '@chakra-ui/react'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { getPostBySlug, getPostSlugs } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import { MDXRemote } from '@/components/MDXRemote'
import '../../prose.css'
import { SiteContainer } from '@/components/layout/SiteContainer'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getPostSlugs('blog')
  return slugs.map((slug) => ({
    slug: slug.replace(/\.(md|mdx)$/, ''),
  }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  try {
    const post = getPostBySlug('blog', slug)
    return {
      title: `${post.meta.title} - SkatAI Blog`,
      description: post.meta.description || post.meta.title,
    }
  } catch {
    return {
      title: 'Post Not Found - SkatAI',
    }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  let post
  try {
    post = getPostBySlug('blog', slug)
  } catch {
    notFound()
  }

  return (
    <Box>
      <Navigation />
      <Box pt="72px" minH="100vh" bg="white">
        <SiteContainer maxW="full" py={16}>
          <Box maxW="3xl" mx="auto" w="100%">
            <VStack align="center" textAlign="center" gap={6} mb={8}>
              <Text color="gray.400" fontSize="sm">
                {new Date(post.meta.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {' · '}
                {post.meta.readingTime}
              </Text>
              <Heading as="h1" size="2xl" color="gray.800" lineHeight="1.2">
                {post.meta.title}
              </Heading>
              {post.meta.tags && (
                <HStack flexWrap="wrap" gap={2}>
                  {post.meta.tags.map((tag: string) => (
                    <Badge key={tag} colorPalette="orange" variant="subtle">
                      {tag}
                    </Badge>
                  ))}
                </HStack>
              )}
              {post.meta.author && (
                <Text color="gray.600" fontSize="sm">
                  By {post.meta.author}
                </Text>
              )}
            </VStack>

            <Box className="prose" textAlign="left">
              <MDXRemote source={post.content} />
            </Box>
          </Box>
        </SiteContainer>
      </Box>
      <Footer />
    </Box>
  )
}
