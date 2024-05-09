import Footer from "@/components/footer";
import Header from "@/components/header";
import { Container } from "@chakra-ui/react";
import GroupGrid from "./groupGrid";

export default function GroupPage() {
  return (
    <>
      <Header loggedIn={true} isGroup={true} />
      <Container w="80%" maxW="800px" mt="30px" mb="30px">
        <GroupGrid />
      </Container>
      <Footer />
    </>
  );
}
