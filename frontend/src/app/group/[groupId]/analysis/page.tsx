import Footer from "@/components/footer";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Container } from "@chakra-ui/react";

export default function Page({ params }: { params: { groupId: string } }) {
  return (
    <>
      <Header loggedIn={true} isGroup={true} />
      <Sidebar groupId={params.groupId} />
      <Container
        w={{ base: "95%", md: "85%" }}
        maxW="800px"
        mt="40px"
        mb="30px"
        pl={{
          base: "calc(58px + 1rem)",
          md: "calc(164px + 1rem)",
        }}
      >
        <h1>Single Analysis Page</h1>
        <p>Group ID: {params.groupId}</p>
      </Container>
      <Footer />
    </>
  );
}
