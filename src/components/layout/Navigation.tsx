'use client'

import { Box, Container, HStack, Link, Text, IconButton, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { FaLinkedin } from 'react-icons/fa'
import { SiBluesky } from 'react-icons/si'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/#services', label: 'Services' },
    { href: '/#experience', label: 'Experience' },
    { href: '/courses', label: 'Courses' },
    { href: '/blog', label: 'Blog' },
  ]

  const socialLinks = [
    {
      href: 'https://www.linkedin.com/in/alexisperrier',
      icon: <FaLinkedin size={18} color="#0077B5" />,
      label: 'LinkedIn',
    },
    {
      href: 'https://bsky.app/profile/alexisperrier.bsky.social',
      icon: <SiBluesky size={18} color="#1185FE" />,
      label: 'Bluesky',
    },
    {
      href: 'https://www.malt.fr/profile/alexisperrier',
      icon: <Image src="/images/malt-logo-red.svg" alt="Malt" width={50} height={14} />,
      label: 'Malt',
    },
  ]

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg="var(--color-nav-bg)"
      backdropFilter="blur(10px)"
      zIndex={100}
      borderBottom="1px solid"
      borderColor="var(--color-border-light)"
    >
      <Container maxW="container.xl" px={{ base: 4, md: 8, lg: 16 }}>
        <HStack justify="space-between" py={4}>
          <Link as={NextLink} href="/" _hover={{ textDecoration: 'none' }}>
            <HStack gap={2}>
              {/* <Box
                width="36px"
                height="36px"
                bg="var(--color-overlay-light)"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src="/images/woodpecker_02.png"
                  alt="SkatAI Logo"
                  width={28}
                  height={28}
                />
              </Box> */}
              <Text fontSize="xl" fontWeight="bold" color="var(--color-white)">
                Skat<Text as="span" color="var(--color-brand-primary)">AI</Text>
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
                color="var(--color-gray-300)"
                fontSize="sm"
                fontWeight="medium"
                _hover={{ color: 'var(--color-brand-primary)' }}
                transition="color 0.2s"
              >
                {link.label}
              </Link>
            ))}
            <Link
              as={NextLink}
              href="/#contact"
              color="var(--color-gray-300)"
              fontSize="sm"
              fontWeight="medium"
              _hover={{ color: 'var(--color-brand-primary)' }}
              transition="color 0.2s"
            >
              Contact
            </Link>
            <HStack gap={4}>
              {socialLinks.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="var(--color-gray-300)"
                  _hover={{ color: 'var(--color-brand-primary)', transform: 'scale(1.1)' }}
                  transition="all 0.2s"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </HStack>
          </HStack>

          {/* Mobile Menu Button */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            aria-label="Toggle menu"
            variant="ghost"
            color="var(--color-white)"
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
            borderColor="var(--color-border-light)"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                as={NextLink}
                href={link.href}
                color="var(--color-gray-300)"
                fontSize="sm"
                fontWeight="medium"
                _hover={{ color: 'var(--color-brand-primary)' }}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              as={NextLink}
              href="/#contact"
              color="var(--color-gray-300)"
              fontSize="sm"
              fontWeight="medium"
              _hover={{ color: 'var(--color-brand-primary)' }}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <HStack gap={6} py={2}>
              {socialLinks.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="var(--color-gray-300)"
                  _hover={{ color: 'var(--color-brand-primary)' }}
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </HStack>
          </VStack>
        )}
      </Container>
    </Box>
  )
}
