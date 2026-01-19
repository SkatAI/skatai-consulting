'use client'

import { Box, Container, HStack, Link, Text, IconButton, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/#services', label: 'Services' },
    { href: '/#experience', label: 'Experience' },
    { href: '/courses', label: 'Courses' },
    { href: '/blog', label: 'Blog' },
    { href: '/#contact', label: 'Contact' },
  ]

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg="rgba(26, 26, 46, 0.95)"
      backdropFilter="blur(10px)"
      zIndex={100}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Container maxW="container.xl">
        <HStack justify="space-between" py={4}>
          <Link as={NextLink} href="/" _hover={{ textDecoration: 'none' }}>
            <HStack gap={2}>
              <Image
                src="/images/woodpecker_02.png"
                alt="SkatAI Logo"
                width={32}
                height={32}
              />
              <Text fontSize="xl" fontWeight="bold" color="white">
                Skat<Text as="span" color="orange.400">AI</Text>
              </Text>
            </HStack>
          </Link>

          {/* Desktop Navigation */}
          <HStack gap={8} display={{ base: 'none', md: 'flex' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                as={NextLink}
                href={link.href}
                color="gray.300"
                fontSize="sm"
                fontWeight="medium"
                _hover={{ color: 'orange.400' }}
                transition="color 0.2s"
              >
                {link.label}
              </Link>
            ))}
          </HStack>

          {/* Mobile Menu Button */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            aria-label="Toggle menu"
            variant="ghost"
            color="white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Text fontSize="xl">{isOpen ? '✕' : '☰'}</Text>
          </IconButton>
        </HStack>

        {/* Mobile Navigation */}
        {isOpen && (
          <VStack
            display={{ base: 'flex', md: 'none' }}
            py={4}
            gap={4}
            borderTop="1px solid"
            borderColor="whiteAlpha.200"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                as={NextLink}
                href={link.href}
                color="gray.300"
                fontSize="sm"
                fontWeight="medium"
                _hover={{ color: 'orange.400' }}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  )
}
