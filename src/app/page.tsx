import { Box } from '@chakra-ui/react'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { Hero, Services, Projects, Contact } from '@/components/home'

export default function Home() {
  return (
    <Box>
      <Navigation />
      <Box pt="72px">
        <Hero />
        <Services />
        <Projects />
        <Contact />
      </Box>
      <Footer />
    </Box>
  )
}
