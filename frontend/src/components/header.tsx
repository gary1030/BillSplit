"use client";

import { useState, useEffect } from "react";
import serverLogout from "@/actions/logout";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Text,
  Link,
  Hide,
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
      h={65}
      bg="gray.200"
      color="black"
      p={2}
      display="flex"
      alignItems="center"
      borderBottom="2px"
      pos="sticky"
      top="0"
      mb="50px"
      zIndex={1}
    >
      <Link
        href={loggedIn ? "/group" : "/"}
        style={{ textDecoration: "none" }}
        ml={3}
        mr={3}
      >
        <Flex alignItems="center" cursor="pointer">
          <Image
            src="/images/icon.svg"
            boxSize="50px"
            mr={2}
            border="2px"
            borderRadius={15}
            borderColor="black"
            alt="Icon"
          />
          <Hide below="sm">
            <Text fontSize="3xl" fontWeight="bold" ml={2}>
              BillSplit
            </Text>
          </Hide>
        </Flex>
      </Link>
      {loggedIn && (
        <>
          <Box>
            <Link href="/user">
              <Button
                variant="ghost"
                colorScheme="gray"
                fontWeight="bold"
                color={isgroup ? "gray.500" : "black"}
                _focus={{ outline: "none", boxShadow: "none" }}
                px={2}
                mr={1}
              >
                Personal
              </Button>
            </Link>
            <Link href="/group">
              <Button
                variant="ghost"
                colorScheme="gray"
                fontWeight="bold"
                color={isgroup ? "black" : "gray.500"}
                _focus={{ outline: "none", boxShadow: "none" }}
                px={2}
              >
                Groups
              </Button>
            </Link>
          </Box>
          <Box ml="auto" mr={2} position="relative">
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
