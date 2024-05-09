import Header from "@/components/header";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";
import { Container } from "@chakra-ui/react";
import GroupManagement from "./groupManagement";

export default function GroupManagementPage({
  params,
}: {
  params: { groupId: string };
}) {
  return (
    <>
      <Header loggedIn={true} isgroup={true} />
      <Sidebar groupId={params.groupId} />
      <Container
        w={{ base: "90%", md: "80%" }}
        maxW="800px"
        mt="40px"
        mb="30px"
        // 58px, 164px for sidebar width when hidden and shown respectively, 1rem for paddingf
        pl={{ base: "calc(58px + 1rem)", md: "calc(164px + 1rem)" }}
      >
        <GroupManagement groupId={params.groupId} />
      </Container>
      <Footer />
    </>
  );
}
