"use client";

import { Flex, Text, Hide } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex
      w="full"
      bg="black"
      color="white"
      p={2}
      display="flex"
      alignItems="center"
      pos="fixed"
      bottom="0"
      mt="50px"
      h={45}
    >
      <Hide below="sm">
        <Text fontSize="sm" ml={5} mr={5}>
          ©️ 2024 BillSplit, Inc.
        </Text>
      </Hide>
    </Flex>
  );
}
