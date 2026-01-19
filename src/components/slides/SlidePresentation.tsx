'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Box, Button, HStack, Text } from '@chakra-ui/react'
import './slides.css'

interface SlidePresentationProps {
  children: React.ReactNode
  courseHome?: string
  footer?: string
}

export function SlidePresentation({ children, courseHome, footer }: SlidePresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<string[]>([])
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
        setSlides(slideContents)
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
        alignItems="center"
        justifyContent="center"
        w="100%"
        h="100%"
        p={5}
      >
        {slides.map((slideContent, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ display: index === currentSlide ? 'flex' : 'none' }}
            dangerouslySetInnerHTML={{ __html: slideContent }}
          />
        ))}
      </Box>

      {/* Footer */}
      {footer && (
        <Text
          position="absolute"
          bottom="70px"
          right="30px"
          fontSize="12px"
          color="#666"
        >
          {footer}
        </Text>
      )}

      {/* Navigation controls */}
      <HStack
        position="fixed"
        bottom="20px"
        left="50%"
        transform="translateX(-50%)"
        zIndex={100}
        gap={2}
        bg="rgba(0, 0, 0, 0.7)"
        p={2}
        borderRadius="25px"
      >
        {courseHome && (
          <Button
            size="sm"
            bg="#666"
            color="white"
            _hover={{ bg: '#8263ff' }}
            onClick={() => (window.location.href = courseHome)}
          >
            🏠
          </Button>
        )}
        <Button
          size="sm"
          bg="#666"
          color="white"
          _hover={{ bg: '#8263ff' }}
          onClick={() => goToSlide(0)}
        >
          ⏮
        </Button>
        <Button
          size="sm"
          bg="#666"
          color="white"
          _hover={{ bg: '#8263ff' }}
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          ←
        </Button>
        <Button
          size="sm"
          bg="#666"
          color="white"
          _hover={{ bg: '#8263ff' }}
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          →
        </Button>
        <Button
          size="sm"
          bg="#666"
          color="white"
          _hover={{ bg: '#8263ff' }}
          onClick={() => goToSlide(slides.length - 1)}
        >
          ⏭
        </Button>
        <Button
          size="sm"
          bg="#666"
          color="white"
          _hover={{ bg: '#8263ff' }}
          onClick={toggleFullscreen}
        >
          ⛶
        </Button>
      </HStack>

      {/* Slide counter */}
      <Box
        position="fixed"
        bottom="20px"
        right="20px"
        zIndex={100}
        bg="rgba(0, 0, 0, 0.7)"
        color="white"
        px={3}
        py={1}
        borderRadius="15px"
        fontSize="12px"
      >
        {currentSlide + 1} / {slides.length}
      </Box>

      {/* Keyboard hint */}
      <Box
        position="fixed"
        top="20px"
        right="20px"
        zIndex={100}
        bg="rgba(0, 0, 0, 0.8)"
        color="white"
        px={3}
        py={2}
        borderRadius="8px"
        fontSize="11px"
        opacity={0.8}
        border="1px solid rgba(255, 255, 255, 0.2)"
      >
        ← → arrow keys | Space
      </Box>
    </Box>
  )
}
