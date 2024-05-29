"use client";

import serverLogout from "@/actions/logout";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import {
  Avatar,
  Button,
  Box as ChakraBox,
  Flex,
  Hide,
  Image,
  Link,
  Text,
  forwardRef,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";

const Box = forwardRef((props, ref) => <ChakraBox ref={ref} {...props} />);

interface HeaderProps {
  loggedIn: boolean;
  isGroup: boolean;
}

export default function Header({ loggedIn, isGroup }: HeaderProps) {
  const [userName, setUserName] = useState("");
  const [cookies] = useCookies(["username"]);
  const ref = useRef();
  useOnClickOutside(ref, () => setShowLogoutButton(false));

  useEffect(() => {
    setUserName(cookies.username || "");
  }, [cookies]);
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
      mb="30px"
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
            boxSize="40px"
            mr={2}
            border="2px"
            borderRadius={15}
            borderColor="black"
            alt="Icon"
          />
          <Hide below="sm">
            <Text fontSize="2xl" fontWeight="bold" mr={3}>
              BillSplit
            </Text>
          </Hide>
        </Flex>
      </Link>
      {loggedIn && (
        <>
          <Box display="flex" flex-direction="row">
            <Link href="/user">
              <Button
                variant="ghost"
                colorScheme="gray"
                fontWeight="bold"
                color={isGroup ? "gray.500" : "black"}
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
                color={isGroup ? "black" : "gray.500"}
                _focus={{ outline: "none", boxShadow: "none" }}
                px={2}
              >
                Groups
              </Button>
            </Link>
          </Box>
          <Box ml="auto" mr={2} position="relative" ref={ref}>
            <Avatar
              name={userName}
              src={avatarUrl}
              onClick={handleAvatarClick}
              style={{ cursor: "pointer" }}
              border="2px"
              color="black"
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
