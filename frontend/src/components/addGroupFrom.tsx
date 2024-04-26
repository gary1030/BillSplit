"use client";

import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaImage } from "react-icons/fa";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import ImageCard from "./imageCard";

import createGroup from "@/actions/createGroup";

interface AddGroupFormProps {
  onClose: () => void;
  isOpen: boolean;
}

const imagePaths = [
  "images/food.jpg",
  "images/mountain.jpg",
  "images/party.jpg",
  "images/tokyo.jpg",
];

export default function AddGroupForm({ onClose, isOpen }: AddGroupFormProps) {
  const [name, setName] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(imagePaths[0]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleSave = async () => {
    if (!name || name.trim() === "") {
      toast({
        title: "Name is required",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    const group = await createGroup(name, selectedTheme);
    if (!group) {
      toast({
        title: "An error occurred",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else {
      setName("");
      router.push(`/group/${group.id}/management`);
      onClose();
    }

    setIsLoading(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="90%" maxW="800px">
          <ModalHeader>Create New Group</ModalHeader>
          <ModalCloseButton />
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
                  placeholder="Name"
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
                      path={path}
                      isSelected={selectedTheme === path}
                      onClick={() => setSelectedTheme(path)}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isLoading ? <Spinner /> : null}
    </>
  );
}
