"use client";

import { Flex, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex
      w="full"
      bg="black"
      color="white"
      p={2}
      display="flex"
      alignItems="center"
      pos="absolute"
      bottom="-95"
      h={45}
      mt={50}
    >
      <Text fontSize="sm" ml={5} mr={5}>
        ©️ 2024 BillSplit, Inc.
      </Text>
    </Flex>
  );
}
