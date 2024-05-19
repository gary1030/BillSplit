"use client";

import { Container, Heading } from "@chakra-ui/react";

interface PersonalRecordProps {
  startTime: Date;
  endTime: Date;
}

export default function PersonalRecord({
  startTime,
  endTime,
}: PersonalRecordProps) {
  return (
    <Container mt={5} mb={5} ml={0} mr={0} p={0}>
      <Heading size={{ base: "md", md: "lg" }} mb="10px">
        Personal Record
      </Heading>
    </Container>
  );
}
