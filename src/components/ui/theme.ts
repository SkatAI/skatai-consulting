import { createSystem, defaultConfig, defineRecipe } from '@chakra-ui/react'

const badgeRecipe = defineRecipe({
  base: {
    paddingInline: '0.6rem',
    paddingBlock: '0.2rem',
    borderRadius: 'sm',
    lineHeight: '1.2',
  },
  variants: {
    variant: {
      solid: {
        bg: 'teal.100',
        color: 'teal.800',
      },
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
})

export const system = createSystem(defaultConfig, {
  theme: {
    recipes: { badge: badgeRecipe },
  },
})
