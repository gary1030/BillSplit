import GoogleSignInButton from "@/components/auth/googleSignInButton";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Box, Center, Flex, Image, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex direction="column" align="center" w="full">
      <Header loggedIn={false} isgroup={false} />
      <Flex
        direction={{ base: "column", md: "row" }}
        w="93%"
        align="center"
        justify="center"
      >
        <Box flex="3" textAlign="left" marginLeft="5%" mb="20px">
          <Text
            fontSize={{ base: "4xl", md: "5xl" }}
            as="b"
            textShadow="2px 2px 4px rgba(0, 0, 0, 0.3)"
          >
            Welcome to BillSplit:
            <br /> Simplifying shared expense
          </Text>
        </Box>
        <Box w="400px">
          <Center>
            <Image
              src="images/landingPageImage.png"
              boxSize="350px"
              alt="Landing Page Image"
              borderRadius={10}
            />
          </Center>
        </Box>
      </Flex>
      <Center>
        <Box mt="40px" w="full">
          <GoogleSignInButton />
        </Box>
      </Center>
      <Footer />
    </Flex>
  );
}
