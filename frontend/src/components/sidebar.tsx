"use client";

import { Box, Button, Flex, Hide, Link, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GoNote } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineMonetizationOn, MdPieChart } from "react-icons/md";

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
  const managementLink = `/group/${groupId}/management`;
  const recordLink = `/group/${groupId}`;
  const analysisLink = `/group/${groupId}/analysis`;
  const balanceLink = `/group/${groupId}/balance`;

  return (
    <Flex
      w={{ base: "50px", md: "158px" }}
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
      <Box h="100px" />
      <Link href={managementLink}>
        <Button
          variant="ghost"
          colorScheme="gray"
          size="lg"
          px={2}
          minW="30px"
          w="full"
          justifyContent={"flex-start"}
        >
          <IoSettingsOutline size={24}></IoSettingsOutline>
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
          minW="30px"
          w="full"
          justifyContent={"flex-start"}
        >
          <GoNote size={24}></GoNote>
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
          minW="30px"
          w="full"
          justifyContent={"flex-start"}
        >
          <MdPieChart size={24}></MdPieChart>
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
          minW="30px"
          w="full"
          justifyContent={"flex-start"}
        >
          <MdOutlineMonetizationOn size={24}></MdOutlineMonetizationOn>
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
