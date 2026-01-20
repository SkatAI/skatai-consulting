'use client'

import { Box, Heading, Text, VStack, HStack, Link, SimpleGrid } from '@chakra-ui/react'
import { FaLinkedin, FaMedium } from 'react-icons/fa'
import { SiBluesky } from 'react-icons/si'
import Image from 'next/image'
import { SiteContainer } from '@/components/layout/SiteContainer'

export function Contact() {
  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      bg="gray.50"
      id="contact"
      scrollMarginTop="96px"
      minH="100vh"
    >
      <SiteContainer>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={16}>
          <VStack align="flex-start" gap={6}>
            <Text
              color="orange.600"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wider"
              fontSize="sm"
            >
              Get in Touch
            </Text>
            <Heading as="h2" size="2xl" color="gray.900">
              Let&apos;s Build Something Serious
            </Heading>
            <Text color="gray.600" fontSize="lg" lineHeight="tall">
              Tell me about your product, constraints, and timeline. I work with startups and small
              teams that need reliable AI delivery from strategy to production.
            </Text>
          </VStack>

          <VStack align="flex-start" gap={8}>
            <VStack align="flex-start" gap={2}>
              <Text fontWeight="bold" fontSize="xl" color="gray.900">
                Alexis Perrier
              </Text>
              <Text color="gray.700">31 rue Pierre Semard</Text>
              <Text color="gray.700">75009 Paris</Text>
              <HStack gap={2} pt={2}>
                <Text color="gray.700">Tel:</Text>
                <Link
                  href="tel:+33661055150"
                  color="gray.700"
                  _hover={{ color: 'orange.600' }}
                >
                  +33 (0) 661055150
                </Link>
              </HStack>
              <HStack gap={2}>
                <Text color="gray.700">Email:</Text>
                <Link
                  href="mailto:alexis.perrier@skatai.com"
                  color="gray.700"
                  _hover={{ color: 'orange.600' }}
                >
                  alexis.perrier@skatai.com
                </Link>
              </HStack>
            </VStack>

            <VStack align="flex-start" gap={3}>
              <Link
                href="https://www.linkedin.com/in/alexisperrier"
                target="_blank"
                rel="noopener noreferrer"
                color="gray.700"
                _hover={{ color: '#0A66C2' }}
              >
                <HStack gap={2}>
                  <Box color="#0A66C2">
                    <FaLinkedin size={20} />
                  </Box>
                  <Text>LinkedIn</Text>
                </HStack>
              </Link>
              <Link
                href="https://bsky.app/profile/alexisperrier.bsky.social"
                target="_blank"
                rel="noopener noreferrer"
                color="gray.700"
                _hover={{ color: '#0085FF' }}
              >
                <HStack gap={2}>
                  <Box color="#0085FF">
                    <SiBluesky size={20} />
                  </Box>
                  <Text>Bluesky</Text>
                </HStack>
              </Link>
              <Link
                href="https://medium.com/@alexisperrier"
                target="_blank"
                rel="noopener noreferrer"
                color="gray.700"
                _hover={{ color: '#000000' }}
              >
                <HStack gap={2}>
                  <Box color="#000000">
                    <FaMedium size={20} />
                  </Box>
                  <Text>Medium</Text>
                </HStack>
              </Link>
              <Link
                href="https://www.malt.fr/profile/alexisperrier"
                target="_blank"
                rel="noopener noreferrer"
                color="gray.700"
                _hover={{ color: '#FC5757' }}
              >
                <Image
                  src="/images/malt-logo-red.svg"
                  alt="Malt"
                  width={70}
                  height={20}
                />
              </Link>
            </VStack>
          </VStack>
        </SimpleGrid>
      </SiteContainer>
    </Box>
  )
}
