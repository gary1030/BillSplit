"use client";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Container,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

import { GoNote } from "react-icons/go";
import { HiUserGroup } from "react-icons/hi";
import { IoPerson } from "react-icons/io5";
import { MdAttachMoney, MdCategory, MdDateRange } from "react-icons/md";

import FormHeader from "./formHeader";
import Loading from "./loading";

import AddPersonalTransactionForm from "./addPersonalTransactionForm";

import fetchCategories from "@/actions/fetchCategories";
import deletePersonalSingleTransaction from "@/actions/user/deletePersonalTransaction";
import fetchPersonalSingleTransaction from "@/actions/user/fetchPersonalTransaction";

import { Category, Transaction } from "@/types";

interface PersonalTransactionFormProps {
  onClose: () => void;
  isOpen: boolean;
  userId: string;
  transactionId: string;
}

export default function ReadPersonalTransactionForm({
  onClose,
  isOpen,
  userId,
  transactionId,
}: PersonalTransactionFormProps) {
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

  const cancelRef = useRef<HTMLButtonElement>(null);

  const { mutate: deletePersonalTransactionMutation, isPending } = useMutation({
    mutationFn: () => deletePersonalSingleTransaction(userId, transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transaction", transactionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["personalTransactions", userId],
      });
      toast({
        title: "Transaction deleted successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose();
      onCloseDelete();
    },
    onError: () => {
      toast({
        title: "Failed to delete transaction",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  /* Fetch datas */
  /* Categories */
  const {
    data: categoryData,
    error: categoryError,
    isLoading: categoryLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
    staleTime: Infinity,
  });

  // extract unique categories
  const uniqueCategoryMap = new Map<string, Category>();
  categoryData?.forEach((item: Category) => {
    if (!uniqueCategoryMap.has(item.name)) {
      uniqueCategoryMap.set(item.name, item);
    }
  });
  const uniqueCategories = Array.from(uniqueCategoryMap?.values());

  // create options for select
  const options = uniqueCategories?.map((category: Category) => ({
    value: category.id,
    label: category.name,
  }));

  /* Transaction */
  const {
    data: personalTransaction,
    error: transactionError,
    isLoading,
  } = useQuery<Transaction>({
    queryKey: ["transaction", transactionId],
    queryFn: () => fetchPersonalSingleTransaction(userId, transactionId),
  });

  if (isLoading || !personalTransaction) {
    return <Loading />;
  }
  /* Data Processing */

  // Get category name
  const selectedOption = options.find(
    (option) => option.value === personalTransaction?.categoryId
  );
  const categoryName = selectedOption?.label;

  // Get date
  const date = new Date(personalTransaction.consumptionDate);
  date.setHours(date.getHours() + 8);
  const formattedDate = date.toISOString().substring(0, 10);

  const onModelClose = () => {
    onClose();
  };

  const handleOpenDeleteDialog = () => {
    onOpenDelete();
  };

  const handleConfirmDelete = () => {
    deletePersonalTransactionMutation();
    onCloseDelete();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onModelClose} blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent w="90%" maxW="700px">
          <FormHeader
            title="Expense"
            onClose={onModelClose}
            onEdit={onOpenEdit}
            onDelete={handleOpenDeleteDialog}
          />
          <ModalBody>
            <Flex mt="20px" justifyContent="center" alignItems="center">
              <Box>
                <Text fontSize="larger" as="b">
                  {personalTransaction.title}
                </Text>
              </Box>
            </Flex>
            <Flex mt="30px" alignItems="center">
              <Box w="30px">
                <MdDateRange size={24} />
              </Box>
              <Box w="140px">
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  Date
                </Text>
              </Box>
              <Box>
                <Text fontSize="md" noOfLines={1} pl="10px" pr="5px">
                  {formattedDate}
                </Text>
              </Box>
            </Flex>
            <Flex mt="30px" alignItems="center">
              <Box w="30px">
                <MdCategory size={24} />
              </Box>
              <Box w="140px">
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  Category
                </Text>
              </Box>
              <Box>
                <Text fontSize="md" noOfLines={1} pl="10px" pr="5px">
                  {categoryName ? categoryName : "No category selected"}
                </Text>
              </Box>
            </Flex>
            <Flex mt="30px" alignItems="center">
              <Box w="30px">
                <MdAttachMoney size={24} />
              </Box>
              <Box w="140px">
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  Amount
                </Text>
              </Box>
              <Box>
                <Text fontSize="md" noOfLines={1} pl="10px" pr="5px">
                  ${personalTransaction.amount}
                </Text>
              </Box>
            </Flex>
            <Flex mt="20px" alignItems="center">
              <Box w="30px">
                <GoNote size={24} />
              </Box>
              <Box w="140px">
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  Note
                </Text>
              </Box>
              <Box>
                <Text fontSize="md" pl="10px" pr="5px">
                  {personalTransaction.note ? personalTransaction.note : ""}
                </Text>
              </Box>
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
              Delete Transaction
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to delete this transaction?
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
        <AddPersonalTransactionForm
          mode="edit"
          isOpen={isOpen}
          onClose={onCloseEdit}
          userId={userId}
          transactionId={transactionId}
        />
      )}
    </>
  );
}
