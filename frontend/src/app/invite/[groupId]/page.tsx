"use client";

import joinGroup from "@/actions/joinGroup";
import { Box, Button, Center, Heading, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function InvitePage({
  params,
}: {
  params: { groupId: string };
}) {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    setIsLoading(true);

    try {
      const data = await joinGroup(params.groupId);
      if (!data) {
        throw new Error("Failed to join group");
      } else {
        router.push(`/group/${params.groupId}/management`);
      }
    } catch (error: any) {
      toast({
        title: error?.message || "An error occurred",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setTimeout(() => {
        router.push("/group");
      }, 500);
    }

    setIsLoading(false);
  };

  return (
    <Center h="100vh">
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        w="400px"
        textAlign="center"
      >
        <Heading size="md" mb={4}>
          You&apos;ve been invited to join a group
        </Heading>
        <Button isLoading={isLoading} onClick={handleJoin}>
          Join Group
        </Button>
      </Box>
    </Center>
  );
}
