import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { SiteContainer } from '@/components/layout/SiteContainer'

export const metadata = {
  title: "Conditions d'utilisation - SkatAI",
  description: "Conditions d'utilisation de SkatAI",
}

export default function ConditionsUtilisationPage() {
  return (
    <Box>
      <Navigation />
      <Box pt="72px" minH="100vh" bg="white">
        <SiteContainer maxW="full" py={16}>
          <Box maxW="3xl" mx="auto" w="100%">
            <VStack align="flex-start" gap={4} mb={8}>
              <Heading as="h1" size="2xl" color="gray.800" lineHeight="1.2">
                Conditions d'utilisation
              </Heading>
              <Text color="gray.600">
                En utilisant ce site, vous acceptez les présentes conditions d'utilisation.
              </Text>
              <Text color="gray.600">
                Editeur : L'application a été réalisée par Skatai SAS (Siret 978 308 294 00013), 31 rue
                Pierre Semard 75009 Paris.
              </Text>
              <Text color="gray.600">Contact : Alexis Perrier alexis.perrier@skatai.com</Text>
            </VStack>
          </Box>
        </SiteContainer>
      </Box>
      <Footer />
    </Box>
  )
}
