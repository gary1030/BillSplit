import Footer from "@/components/footer";
import Header from "@/components/header";
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
      <Header loggedIn={true} isGroup={true} />
      <Sidebar groupId={params.groupId} />
      <Container
        w={{ base: "95%", md: "85%" }}
        maxW="800px"
        mt="40px"
        mb="30px"
        // 58px, 164px for sidebar width when hidden and shown respectively, 1rem for paddingf
        pl={{
          base: "calc(58px + 1rem)",
          md: "calc(164px + 1rem)",
        }}
      >
        <GroupManagement groupId={params.groupId} />
      </Container>
      <Footer />
    </>
  );
}
