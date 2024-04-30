import AddGroupCard from "@/components/addGroupCard";
import Header from "@/components/header";
import { Box, Center, Container, SimpleGrid } from "@chakra-ui/react";

export default function GroupPage() {
  return (
    <>
      <Header loggedIn={true} isgroup={true} />
      <h1>Group Page</h1>
      <Container w="80%" maxW="800px">
        <SimpleGrid minChildWidth="220px" spacing="30px" columnGap="30px">
          <Box>
            <Center>
              <AddGroupCard />
            </Center>
          </Box>
          <Box>
            <Center>
              <AddGroupCard />
            </Center>
          </Box>
          <Box>
            <Center>
              <AddGroupCard />
            </Center>
          </Box>
        </SimpleGrid>
      </Container>
    </>
  );
}
