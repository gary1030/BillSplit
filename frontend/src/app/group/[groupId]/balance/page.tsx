import Footer from "@/components/footer";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Container } from "@chakra-ui/react";
import GroupBalance from "./groupBalance";

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
          base: "calc(50px + 1rem)",
          md: "calc(158px + 1rem)",
        }}
      >
        <GroupBalance groupId={params.groupId} />
      </Container>
      <Footer />
    </>
  );
}
