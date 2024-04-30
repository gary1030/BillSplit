"use client";

import fetchGroup from "@/actions/group/fetchGroup";
import joinGroup from "@/actions/group/joinGroup";
import ImageCard from "@/components/imageCard";
import { Box, Button, Center, Heading, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

interface Group {
  id: string;
  name: string;
  theme: string;
}

export default function InvitePage({
  params,
}: {
  params: { groupId: string };
}) {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [group, setGroup] = useState<Group | null>(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGroup(params.groupId);
        setGroup(data);
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
    };

    fetchData();
  }, [params.groupId, router, toast]);

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
        {group && (
          <>
            <Center>
              <ImageCard
                path={`../${group?.theme}` || ""}
                isSelected={false}
                onClick={() => {}}
              />
            </Center>
            <Box mb={4}>
              <Text fontSize="lg" as="b">
                {group?.name}
              </Text>
            </Box>
          </>
        )}
        <Button isLoading={isLoading} onClick={handleJoin}>
          Join Group
        </Button>
      </Box>
    </Center>
  );
}
