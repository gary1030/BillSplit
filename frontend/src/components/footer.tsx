"use client";

import { Flex, Text, Hide } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function Footer() {
  const [isContentLong, setIsContentLong] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsContentLong(
        document.documentElement.scrollHeight >
          document.documentElement.clientHeight
      );
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Flex
      w="full"
      bg="black"
      color="white"
      p={2}
      display="flex"
      alignItems="center"
      pos={isContentLong ? "static" : "fixed"}
      bottom={isContentLong ? "auto" : "0"}
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
