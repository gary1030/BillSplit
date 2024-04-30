"use client";

import { Card, CardBody, Center, Text, useDisclosure } from "@chakra-ui/react";
import { MdAddCircleOutline } from "react-icons/md";

import AddGroupForm from "./addGroupForm";

export default function AddGroupCard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Card
        align="center"
        w="220px"
        h="270px"
        onClick={onOpen}
        _hover={{
          cursor: "pointer",
          transform: "scale(1.03)",
          transition: "all 0.1s",
        }}
      >
        <CardBody display="flex" flexDirection="column" justifyContent="center">
          <Center>
            <MdAddCircleOutline size={50} />
          </Center>
          <Text pt="10px" pe="10px">
            Create new group
          </Text>
        </CardBody>
      </Card>
      <AddGroupForm isOpen={isOpen} onClose={onClose} />
    </>
  );
}
