"use client";

import { Center, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";
import GroupForm from "./groupForm";

interface GroupTitleProps {
  title: string;
  theme: string;
  canEdit: boolean;
}

export default function GroupTitle({
  title,
  theme,
  canEdit = true,
}: GroupTitleProps) {
  const params = useParams<{ groupId: string }>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Center>
      <Text fontSize={{ base: "2xl", md: "3xl" }} as="b">
        {title}
      </Text>
      {canEdit && (
        <IconButton
          ml="10px"
          aria-label="Edit"
          bgColor={"transparent"}
          icon={<FaRegEdit size={24} />}
          _hover={{
            cursor: "pointer",
          }}
          _focus={{
            outline: "none",
            bgColor: "transparent",
          }}
          onClick={onOpen}
        />
      )}
      <GroupForm
        isOpen={isOpen}
        onClose={onClose}
        mode="edit"
        defaultName={title}
        defaultTheme={theme}
        groupId={params.groupId}
      />
    </Center>
  );
}
