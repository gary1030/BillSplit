import Footer from "@/components/footer";
import Header from "@/components/header";
import { Container } from "@chakra-ui/react";
import AccountBook from "./accountBook";

export default function UserPage() {
  return (
    <>
      <Header loggedIn={true} isGroup={false} />
      <Container
        w={{ base: "100%", md: "80%" }}
        maxW="600px"
        mt="30px"
        mb="30px"
      >
        <AccountBook />
      </Container>
      <Footer />
    </>
  );
}
