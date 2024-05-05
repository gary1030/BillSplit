"use client";

import { useState, useEffect } from "react";
import serverLogout from "@/actions/logout";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";

interface HeaderProps {
  loggedIn: boolean;
  isgroup: boolean;
}

export default function Header({ loggedIn, isgroup }: HeaderProps) {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const getUserNameFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("username="))
      ?.split("=")[1];
    if (getUserNameFromCookie) {
      setUserName(getUserNameFromCookie);
    }
  });
  const avatarUrl = `https://api.dicebear.com/8.x/open-peeps/svg?seed=${userName}`;

  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const handleAvatarClick = () => {
    setShowLogoutButton(!showLogoutButton);
  };

  const handleLogout = async () => {
    await serverLogout();
  };

  return (
    <Flex
      w="full"
      bg="gray.200"
      color="black"
      p={2}
      display="flex"
      alignItems="center"
      borderBottom="2px"
      pos="sticky"
      top="0"
      zIndex="10"
    >
      <a href={loggedIn ? "/group" : "/"}>
        <Flex alignItems="center" cursor="pointer">
          <Image
            src="/images/icon.svg"
            boxSize="50px"
            ml={3}
            border="2px"
            borderRadius={15}
            borderColor="black"
            alt="Icon"
          />
          <Text fontSize="3xl" fontWeight="bold" ml={5}>
            BillSplit
          </Text>
        </Flex>
      </a>
      {loggedIn && (
        <>
          <Box ml={5}>
            <Tabs variant="unstyled" defaultIndex={isgroup ? 1 : 0}>
              <TabList>
                <a href="/user">
                  <Tab _selected={{ color: "blue.600" }} fontWeight="bold">
                    Personal
                  </Tab>
                </a>
                <a href="/group">
                  <Tab _selected={{ color: "blue.600" }} fontWeight="bold">
                    Groups
                  </Tab>
                </a>
              </TabList>
            </Tabs>
          </Box>
          <Box ml="auto" mr={3} position="relative">
            <Avatar
              name={userName}
              src={avatarUrl}
              onClick={handleAvatarClick}
              style={{ cursor: "pointer" }}
              border="2px"
            />
            {loggedIn && showLogoutButton && (
              <Button
                border="2px"
                position="absolute"
                bottom="-60px"
                right="0px"
                colorScheme="gray"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </Box>
        </>
      )}
    </Flex>
  );
}
