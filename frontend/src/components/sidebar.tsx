"use client";

import { Button, Flex, Link, Text, Hide } from "@chakra-ui/react";
import { IoSettingsOutline } from "react-icons/io5";
import { GoNote } from "react-icons/go";
import { MdPieChart, MdOutlineMonetizationOn } from "react-icons/md";
import { useState, useEffect } from "react";

interface SidebarProps {
  groupId: string;
}

export default function Sidebar({ groupId }: SidebarProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }
  const managementLink = `${window.location.origin}/group/${groupId}/management`;
  const recordLink = `${window.location.origin}/group/${groupId}/record`;
  const analysisLink = `${window.location.origin}/group/${groupId}/analysis`;
  const balanceLink = `${window.location.origin}/group/${groupId}/balance`;

  return (
    <Flex
      w={{ base: "58px", md: "164px" }}
      h="full"
      borderRight="2px"
      pos="fixed"
      top={0}
      p={1}
      bg="gray.200"
      color="black"
      display="flex"
      flexDirection={"column"}
    >
      <Link href={managementLink}>
        <Button
          variant="ghost"
          colorScheme="gray"
          size="lg"
          px={2}
          w="full"
          justifyContent={"flex-start"}
          mt={115}
        >
          <IoSettingsOutline size={30}></IoSettingsOutline>
          <Hide below="md">
            <Text ml={2} fontSize="md">
              Management
            </Text>
          </Hide>
        </Button>
      </Link>
      <Link href={recordLink}>
        <Button
          variant="ghost"
          colorScheme="gray"
          size="lg"
          px={2}
          w="full"
          justifyContent={"flex-start"}
        >
          <GoNote size={30}></GoNote>
          <Hide below="md">
            <Text ml={2} fontSize="md">
              Record
            </Text>
          </Hide>
        </Button>
      </Link>
      <Link href={analysisLink}>
        <Button
          variant="ghost"
          colorScheme="gray"
          size="lg"
          px={2}
          w="full"
          justifyContent={"flex-start"}
        >
          <MdPieChart size={30}></MdPieChart>
          <Hide below="md">
            <Text ml={2} fontSize="md">
              Analysis
            </Text>
          </Hide>
        </Button>
      </Link>
      <Link href={balanceLink}>
        <Button
          variant="ghost"
          colorScheme="gray"
          size="lg"
          px={2}
          w="full"
          justifyContent={"flex-start"}
        >
          <MdOutlineMonetizationOn size={30}></MdOutlineMonetizationOn>
          <Hide below="md">
            <Text ml={2} fontSize="md">
              Balance
            </Text>
          </Hide>
        </Button>
      </Link>
    </Flex>
  );
}
