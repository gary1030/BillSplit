"use client";

import {
  Box,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import FormHeader from "./formHeader";
import ImageCard from "./imageCard";
import Loading from "./loading";

import createGroup from "@/actions/group/createGroup";
import editGroup from "@/actions/group/editGroup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface GroupFormProps {
  mode: "create" | "edit";
  onClose: () => void;
  isOpen: boolean;
  defaultName?: string;
  defaultTheme?: string;
  groupId?: string;
}

const imagePaths = [
  "images/food.jpg",
  "images/mountain.jpg",
  "images/party.jpg",
  "images/tokyo.jpg",
];

export default function GroupForm({
  onClose,
  isOpen,
  mode,
  defaultName,
  defaultTheme,
  groupId,
}: GroupFormProps) {
  const [name, setName] = useState(defaultName || "");
  const [selectedTheme, setSelectedTheme] = useState(
    defaultTheme || imagePaths[0]
  );
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: editGroupMutation, isPending: isEditPending } = useMutation({
    mutationFn: () => {
      if (!groupId) {
        throw new Error("Group ID is required for editing");
      }
      return editGroup(groupId, name, selectedTheme);
    },
    mutationKey: ["group", groupId],
    onSuccess: () => {
      if (groupId) {
        queryClient.invalidateQueries({
          queryKey: ["group", groupId],
        });
      }
      onClose();
    },
    onError: () => {
      toast({
        title: "An error occurred",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  const { mutate: createGroupMutation, isPending } = useMutation({
    mutationFn: () => createGroup(name, selectedTheme),
    onSuccess: (newGroup) => {
      setName("");
      router.push(`/group/${newGroup.id}/management`);
      onClose();
    },
    onError: () => {
      toast({
        title: "An error occurred",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  const onModelClose = () => {
    setName(defaultName || "");
    setSelectedTheme(defaultTheme || imagePaths[0]);
    onClose();
  };

  const handleAdd = () => {
    if (!name || name.trim() === "") {
      toast({
        title: "Name is required",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    createGroupMutation();
  };

  useEffect(() => {
    setName(defaultName || "");
    setSelectedTheme(defaultTheme || imagePaths[0]);
  }, [defaultName, defaultTheme]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onModelClose} isCentered>
        <ModalOverlay />
        <ModalContent w="90%" maxW="800px">
          {mode === "edit" ? (
            <FormHeader
              title="Edit Group"
              onClose={onModelClose}
              onSave={editGroupMutation}
            />
          ) : (
            <FormHeader
              title="Create New Group"
              onClose={onModelClose}
              onSave={handleAdd}
            />
          )}
          <ModalBody>
            <Flex mt="10px" alignItems="center">
              <Box w="30px">
                <RxLetterCaseCapitalize size={24} />
              </Box>
              <Box w="140px">
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  Group Name
                </Text>
              </Box>
              <Box>
                <Input
                  placeholder="Group Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>
            </Flex>
            <Flex mt="40px" alignItems="center">
              <Box w="30px">
                <FaImage size={24} />
              </Box>
              <Box w="140px">
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  Theme
                </Text>
              </Box>
              <Box flex="1">
                <SimpleGrid minChildWidth="190px" spacing="10px">
                  {imagePaths.map((path, index) => (
                    <ImageCard
                      key={index}
                      path={`/${path}`}
                      isSelected={selectedTheme === path}
                      onClick={() => setSelectedTheme(path)}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Box h="10px"></Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isPending || isEditPending ? <Loading /> : null}
    </>
  );
}
