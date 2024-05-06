import Header from "@/components/header";
import Footer from "@/components/footer";
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
      <Container
        w={{ base: "90%", md: "80%" }}
        maxW="800px"
        mt="40px"
        mb="30px"
      >
        <GroupManagement groupId={params.groupId} />
      </Container>
      <Footer />
    </>
  );
}
