"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { Container } from "@chakra-ui/react";
import AccountBook from "./accountBook";

export default function UserPage({ params }: { params: { userId: string } }) {
  const userId = document.cookie.split("; ")[2].replace("userId=", "");

  return (
    <>
      <Header loggedIn={true} isGroup={true} />
      <Container
        w={{ base: "100%", md: "80%" }}
        maxW="600px"
        mt="30px"
        mb="30px"
      >
        <AccountBook userId={userId} />
      </Container>
      <Footer />
    </>
  );
}
