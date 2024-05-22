"use client";

import { Box, Center, Flex, IconButton, Text } from "@chakra-ui/react";
import { FiSave } from "react-icons/fi";
import { MdEdit, MdOutlineClose } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

interface FormHeaderProps {
  onClose: () => void;
  title: string;
  onSave?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function FormHeader({
  title,
  onClose,
  onSave,
  onEdit,
  onDelete,
}: FormHeaderProps) {
  return (
    <Flex
      h="60px"
      alignItems="center"
      bgColor="purple.600"
      borderTopRightRadius="md"
      borderTopLeftRadius="md"
    >
      <Box flex={1} ml="10px">
        <IconButton
          colorScheme="white"
          aria-label="Close"
          icon={<MdOutlineClose size={24} />}
          _hover={{
            cursor: "pointer",
          }}
          onClick={onClose}
        />
      </Box>
      <Box flex={2}>
        <Center>
          <Text fontSize={{ base: "lg", md: "xl" }} color="white" as="b">
            {title}
          </Text>
        </Center>
      </Box>
      <Box flex={1} display="flex" justifyContent="end" mr="10px">
        {onSave && (
          <IconButton
            colorScheme="white"
            aria-label="Save"
            icon={<FiSave size={24} />}
            _hover={{
              cursor: "pointer",
            }}
            onClick={onSave}
          />
        )}
        {onDelete && (
          <IconButton
            colorScheme="white"
            aria-label="Delete"
            icon={<RiDeleteBin6Line size={24} />}
            _hover={{
              cursor: "pointer",
            }}
            onClick={onDelete}
          />
        )}
        {onEdit && (
          <IconButton
            colorScheme="white"
            aria-label="Edit"
            icon={<MdEdit size={24} />}
            _hover={{
              cursor: "pointer",
            }}
            onClick={onEdit}
          />
        )}
      </Box>
    </Flex>
  );
}
