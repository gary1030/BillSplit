import GoogleSignInButton from "@/components/auth/googleSignInButton";
import { Box, Flex, Center, Text, Image } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex direction="column" align="center" w="full" mt="100">
      <Flex
        direction={{ base: "column", md: "row" }}
        w="full"
        align="center"
        justify="center"
      >
        <Box flex="3" textAlign="left" marginLeft="5em">
          <Text
            fontSize="5xl"
            as="b"
            textShadow="2px 2px 4px rgba(0, 0, 0, 0.3)"
          >
            Welcome to BillSplit:
            <br /> Simplifying shared expense
          </Text>
        </Box>
        <Image
          src="images/landingPageImage.png"
          boxSize="30em"
          marginRight="5em"
        />
      </Flex>
      <Center>
        <Box mt="55" w="full">
          <GoogleSignInButton />
        </Box>
      </Center>
    </Flex>
  );
}
