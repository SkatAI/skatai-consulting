'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Box, Button, HStack, VStack } from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight, FiHome, FiMaximize2 } from 'react-icons/fi'
import './slides.css'

interface SlidePresentationProps {
  children: React.ReactNode
  courseHome?: string
}

export function SlidePresentation({ children, courseHome }: SlidePresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<Array<{ html: string; className?: string }>>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)

  // Parse slides from children
  useEffect(() => {
    if (containerRef.current) {
      const contentDiv = containerRef.current.querySelector('.slide-content-raw')
      if (contentDiv) {
        const html = contentDiv.innerHTML
        // Split by <hr> tags (from markdown ---)
        const slideContents = html.split(/<hr\s*\/?>/gi).filter((s) => s.trim())
        const parsedSlides = slideContents.map((slide) => {
          const classMatch = slide.match(/<!--\s*_class:\s*([\s\S]*?)-->/i)
          let className = ''
          if (classMatch?.[1]) {
            className = classMatch[1]
              .split(/\s+/)
              .map((token) => token.trim().replace(/_+$/, ''))
              .filter(Boolean)
              .join(' ')
          }
          const cleaned = slide
            .replace(/<!--\s*_class:\s*[\s\S]*?-->/i, '')
            .replace(/<\/?titleslide>/gi, (match) =>
              match.startsWith('</') ? '</div>' : '<div class="title-slide">',
            )
            .replace(/<\/?columns>/gi, (match) =>
              match.startsWith('</') ? '</div>' : '<div class="columns">',
            )
            .replace(/<\/?column>/gi, (match) =>
              match.startsWith('</') ? '</div>' : '<div class="column">',
            )
            .trim()
          return { html: cleaned, className }
        })
        setSlides(parsedSlides)
      }
    }
  }, [children])

  // Initialize from URL hash
  useEffect(() => {
    if (slides.length === 0) return

    const hash = window.location.hash
    const match = hash.match(/^#slide-(\d+)$/)
    if (match) {
      const slideNum = parseInt(match[1], 10) - 1
      if (slideNum >= 0 && slideNum < slides.length) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: initialize from URL hash on mount
        setCurrentSlide(slideNum)
      }
    }
  }, [slides.length])

  // Update URL hash when slide changes
  useEffect(() => {
    if (slides.length === 0) return
    const newHash = currentSlide === 0 ? '' : `#slide-${currentSlide + 1}`
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', newHash || window.location.pathname)
    }
  }, [currentSlide, slides.length])

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < slides.length) {
        setCurrentSlide(index)
      }
    },
    [slides.length]
  )

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1)
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1)
  }, [currentSlide, goToSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          prevSlide()
          e.preventDefault()
          break
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          nextSlide()
          e.preventDefault()
          break
        case 'Home':
          goToSlide(0)
          e.preventDefault()
          break
        case 'End':
          goToSlide(slides.length - 1)
          e.preventDefault()
          break
        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide, goToSlide, slides.length])

  // Touch/swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].screenX
    const diff = touchStartX.current - touchEndX
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
  }

  // Handle browser back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      const match = hash.match(/^#slide-(\d+)$/)
      if (match) {
        const slideNum = parseInt(match[1], 10) - 1
        if (slideNum >= 0 && slideNum < slides.length && slideNum !== currentSlide) {
          setCurrentSlide(slideNum)
        }
      } else if (!hash && currentSlide !== 0) {
        setCurrentSlide(0)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [currentSlide, slides.length])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <Box
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="slide-presentation"
    >
      {/* Hidden raw content for parsing */}
      <Box display="none" className="slide-content-raw">
        {children}
      </Box>

      {/* Slide container */}
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        w="100%"
        minH="100vh"
        p={5}
      >
        {slides.map((slideContent, index) => (
          <div
            key={index}
            className="slide-frame"
            style={{ display: index === currentSlide ? 'flex' : 'none' }}
          >
            <div
              className={`slide ${slideContent.className || ''} ${index === currentSlide ? 'active' : ''}`}
              dangerouslySetInnerHTML={{ __html: slideContent.html }}
            />

            {index === currentSlide && (
              <VStack
                position="absolute"
                top="8px"
                right="8px"
                zIndex={100}
                gap={1}
                align="center"
              >
                {courseHome && (
                  <Button
                    size="xs"
                    bg="rgba(255, 255, 255, 0.12)"
                    color="var(--color-white)"
                    _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
                    borderRadius="full"
                    minW="28px"
                    h="28px"
                    p={0}
                    onClick={() => (window.location.href = courseHome)}
                  >
                    <FiHome />
                  </Button>
                )}
                <HStack gap={1} justify="center">
                  <Button
                    size="xs"
                    bg="rgba(255, 255, 255, 0.12)"
                    color="var(--color-white)"
                    _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
                    borderRadius="full"
                    minW="28px"
                    h="28px"
                    p={0}
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                  >
                    <FiChevronLeft />
                  </Button>
                  <Button
                    size="xs"
                    bg="rgba(255, 255, 255, 0.12)"
                    color="var(--color-white)"
                    _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
                    borderRadius="full"
                    minW="28px"
                    h="28px"
                    p={0}
                    onClick={nextSlide}
                    disabled={currentSlide === slides.length - 1}
                  >
                    <FiChevronRight />
                  </Button>
                </HStack>
                <Button
                  size="xs"
                  bg="rgba(255, 255, 255, 0.12)"
                  color="var(--color-white)"
                  _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
                  borderRadius="full"
                  minW="28px"
                  h="28px"
                  p={0}
                  onClick={toggleFullscreen}
                >
                  <FiMaximize2 />
                </Button>
              </VStack>
            )}
          </div>
        ))}
      </Box>

      {/* Slide counter */}
      <Box
        position="fixed"
        bottom="20px"
        right="20px"
        zIndex={100}
        bg="var(--color-overlay-dark)"
        color="var(--color-white)"
        px={3}
        py={1}
        borderRadius="15px"
        fontSize="12px"
      >
        {currentSlide + 1} / {slides.length}
      </Box>

    </Box>
  )
}
