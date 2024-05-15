"use client";

import { Container, Text } from "@chakra-ui/react";

export default function PersonalRecord() {
  return (
    <Container mt={5} mb={5} ml={0} mr={0} p={0}>
      <Text fontSize={{ base: "xl", md: "2xl" }} as="b">
        Personal Record
      </Text>
    </Container>
  );
}
