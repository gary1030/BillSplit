"use client";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

import FormHeader from "./formHeader";
import Loading from "./loading";

import fetchGroup from "@/actions/group/fetchGroup";
import fetchUserBatch from "@/actions/user/fetchUserBatch";

import AddGroupRepaymentForm from "./addGroupRepaymentForm";

import deleteGroupSingleRepayment from "@/actions/group/deleteGroupRepayment";
import fetchGroupSingleRepayment from "@/actions/group/fetchGroupRepayment";

import { Repayment } from "@/types";

interface GroupRepaymentFormProps {
  onClose: () => void;
  isOpen: boolean;
  groupId: string;
  repaymentId: string;
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface MembersData {
  users: User[];
}

export default function ReadGroupRepaymentForm({
  onClose,
  isOpen,
  groupId,
  repaymentId,
}: GroupRepaymentFormProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const { data: group } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroup(groupId),
  });

  const { data: membersData } = useQuery<MembersData>({
    queryKey: ["groupMembers", group?.memberIds || []],
    queryFn: () => fetchUserBatch(group.memberIds || []),
  });

  const cancelRef = useRef<HTMLButtonElement>(null);

  const { mutate: deleteGroupRepaymentMutation, isPending } = useMutation({
    mutationFn: () => deleteGroupSingleRepayment(groupId, repaymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["repayment", repaymentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["groupRepayments", groupId],
      });
      toast({
        title: "Repayment deleted successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose();
      onCloseDelete();
    },
    onError: () => {
      toast({
        title: "Failed to delete repayment",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  /* Fetch datas */

  /* Repayments */
  const {
    data: groupRepayment,
    error: repaymentError,
    isLoading,
  } = useQuery<Repayment>({
    queryKey: ["repayment", repaymentId],
    queryFn: () => fetchGroupSingleRepayment(groupId, repaymentId),
  });

  if (isLoading || !groupRepayment) {
    return <Loading />;
  }

  const payerName =
    membersData?.users.find((user) => user.id === groupRepayment.payerId)
      ?.username || "Unknown";
  const payerAvatarUrl = `https://api.dicebear.com/8.x/open-peeps/svg?seed=${payerName}`;

  const receiverName =
    membersData?.users.find((user) => user.id === groupRepayment.receiverId)
      ?.username || "Unknown";
  const receiverAvatarUrl = `https://api.dicebear.com/8.x/open-peeps/svg?seed=${receiverName}`;

  const onModelClose = () => {
    onClose();
  };

  const handleOpenDeleteDialog = () => {
    onOpenDelete();
  };

  const handleConfirmDelete = () => {
    deleteGroupRepaymentMutation();
    onCloseDelete();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onModelClose} isCentered>
        <ModalOverlay />
        <ModalContent w={{ base: "90%", md: "550px" }} maxW="550px">
          <FormHeader
            title="Repayment"
            onClose={onModelClose}
            onEdit={onOpenEdit}
            onDelete={handleOpenDeleteDialog}
          />
          <ModalBody>
            <Flex
              flexDirection={"row"}
              w="full"
              marginTop="40px"
              key={
                groupRepayment.payerId +
                "_" +
                groupRepayment.receiverId +
                "_" +
                groupRepayment.amount
              }
            >
              <Container flex={1} textAlign="center" p={0}>
                <Avatar
                  name={payerName}
                  src={payerAvatarUrl}
                  border="2px"
                  color="black"
                />
                <Text minW="64px">{payerName}</Text>
              </Container>
              <Container flex={1} minW="fit-content" textAlign="center">
                <Text minW="110px" mr="15px">
                  ${groupRepayment.amount}
                </Text>
                <Flex minW="95px" h="fit-content" flexDirection="row">
                  <Box mt="5px" w="full" h="2px" bg="black" float="left" />
                  <Box
                    mt="0px"
                    w="0px"
                    h="0px"
                    borderTop="6px solid transparent"
                    borderBottom="6px solid transparent"
                    borderLeft="15px solid black"
                    float="right"
                  />
                </Flex>
              </Container>
              <Container flex={1} textAlign="center" p={0}>
                <Avatar
                  name={receiverName}
                  src={receiverAvatarUrl}
                  border="2px"
                  color="black"
                />
                <Text minW="64px">{receiverName}</Text>
              </Container>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Box h="10px"></Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Repayment
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to delete this repayment?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDelete}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {isOpenEdit && (
        <AddGroupRepaymentForm
          mode="edit"
          isOpen={isOpen}
          onClose={onCloseEdit}
          repaymentId={repaymentId}
          groupId={groupId}
          payerId={groupRepayment.payerId}
          payerName={payerName}
          payerAvatarUrl={payerAvatarUrl}
          amount={groupRepayment.amount}
          receiverId={groupRepayment.receiverId}
          receiverName={receiverName}
          receiverAvatarUrl={receiverAvatarUrl}
        />
      )}
    </>
  );
}
