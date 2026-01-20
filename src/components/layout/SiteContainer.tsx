'use client'

import { Container, type ContainerProps } from '@chakra-ui/react'

const defaultPx = { base: 4, md: 8, lg: 16 }

export function SiteContainer({ maxW = 'container.xl', px = defaultPx, ...props }: ContainerProps) {
  return <Container maxW={maxW} px={px} w="100%" mx="auto" {...props} />
}
