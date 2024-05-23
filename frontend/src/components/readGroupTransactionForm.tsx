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

import AddGroupTransactionForm from "./addGroupTransactionForm";

import fetchGroup from "@/actions/group/fetchGroup";
import fetchUserBatch from "@/actions/user/fetchUserBatch";

import fetchCategories from "@/actions/fetchCategories";
import deleteGroupSingleTransaction from "@/actions/group/deleteGroupTransaction";
import fetchGroupSingleTransaction from "@/actions/group/fetchGroupTransaction";

import { Category, Transaction } from "@/types";

interface Payer {
  payerId: string;
  amount: number;
}

interface Sharer {
  sharerId: string;
  amount: number;
}

interface MembersData {
  users: User[];
}

interface GroupTransactionFormProps {
  onClose: () => void;
  isOpen: boolean;
  groupId: string;
  transactionId: string;
}

export default function ReadGroupTransactionForm({
  onClose,
  isOpen,
  groupId,
  transactionId,
}: GroupTransactionFormProps) {
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

  const { mutate: deleteGroupTransactionMutation, isPending } = useMutation({
    mutationFn: () => deleteGroupSingleTransaction(groupId, transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transaction", transactionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["groupTransactions", groupId],
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
  /*Members data*/
  const { data: group } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroup(groupId),
  });

  const { data: membersData } = useQuery<MembersData>({
    queryKey: ["groupMembers", group?.memberIds || []],
    queryFn: () => fetchUserBatch(group.memberIds || []),
  });

  const groupName = group?.name;
  const members = membersData?.users || [];

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
    data: groupTransaction,
    error: transactionError,
    isLoading,
  } = useQuery<Transaction>({
    queryKey: ["transaction", transactionId],
    queryFn: () => fetchGroupSingleTransaction(groupId, transactionId),
  });

  if (isLoading || !groupTransaction) {
    return <Loading />;
  }

  /* Data Processing */

  // Get category name
  const selectedOption = options.find(
    (option) => option.value === groupTransaction?.categoryId
  );
  const categoryName = selectedOption?.label;

  // Get date
  const date = new Date(groupTransaction.consumptionDate);
  date.setHours(date.getHours() + 8);
  const formattedDate = date.toISOString().substring(0, 10);

  // Get payer details
  const payerDetails: {
    id: string;
    name: string | undefined;
    amount: number;
  }[] = [];
  groupTransaction.payerDetails.forEach((payer: Payer) => {
    if (payer.amount !== 0) {
      const member = members.find((member) => member.id === payer.payerId);
      payerDetails.push({
        id: payer.payerId,
        name: member?.username,
        amount: payer.amount,
      });
    }
  });

  // Get sharer details
  const sharerDetails: {
    id: string;
    name: string | undefined;
    amount: number;
  }[] = [];
  groupTransaction.splitDetails.forEach((sharer: Sharer) => {
    if (sharer.amount !== 0) {
      const member = members.find((member) => member.id === sharer.sharerId);
      sharerDetails.push({
        id: sharer.sharerId,
        name: member?.username,
        amount: sharer.amount,
      });
    }
  });

  const onModelClose = () => {
    onClose();
  };

  const handleOpenDeleteDialog = () => {
    onOpenDelete();
  };

  const handleConfirmDelete = () => {
    deleteGroupTransactionMutation();
    onCloseDelete();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onModelClose}
        blockScrollOnMount={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent w="90%" maxW="700px" mt="65px">
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
                  {groupTransaction.title}
                </Text>
              </Box>
            </Flex>
            <Flex mt="20px" alignItems="center">
              <Box w="30px">
                <HiUserGroup size={24} />
              </Box>
              <Box w="140px">
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  Group
                </Text>
              </Box>
              <Box>
                <Text fontSize="md" noOfLines={1} pl="10px" pr="5px">
                  {groupName}
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
                  ${groupTransaction.totalAmount}
                </Text>
              </Box>
            </Flex>
            <Flex mt="30px" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Box w="30px">
                  <IoPerson size={24} />
                </Box>
                <Box w="140px">
                  <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                    Paid by
                  </Text>
                </Box>
              </Box>
            </Flex>
            <Flex mt="2px" alignItems="center">
              <Container maxW="320px" p={0} mb="30px">
                <TableContainer>
                  <Table
                    size={"sm"}
                    style={{
                      borderCollapse: "separate",
                      borderSpacing: "0 0.6em",
                      width: "280px",
                    }}
                  >
                    <Thead>
                      <Tr bgColor={"#e6e6e6"}>
                        <Th>Name</Th>
                        <Th>Amount</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {payerDetails.map((payer) => (
                        <Tr key={payer.id}>
                          <Td
                            style={{ width: "150px", wordWrap: "break-word" }}
                          >
                            {payer.name}
                          </Td>
                          <Td style={{ textAlign: "left", width: "150px" }}>
                            ${payer.amount}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Container>
            </Flex>
            <Flex mt="30px" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Box w="30px">
                  <IoPerson size={24} />
                </Box>
                <Box w="140px">
                  <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                    For whom
                  </Text>
                </Box>
              </Box>
            </Flex>
            <Flex mt="2px" alignItems="center">
              <Container maxW="320px" p={0} mb="30px">
                <TableContainer>
                  <Table
                    size={"sm"}
                    style={{
                      borderCollapse: "separate",
                      borderSpacing: "0 0.6em",
                      width: "280px",
                    }}
                  >
                    <Thead>
                      <Tr bgColor={"#e6e6e6"}>
                        <Th>Name</Th>
                        <Th>Amount</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {sharerDetails.map((sharer) => (
                        <Tr key={sharer.id}>
                          <Td
                            style={{ width: "150px", wordWrap: "break-word" }}
                          >
                            {sharer.name}
                          </Td>
                          <Td style={{ textAlign: "left", width: "150px" }}>
                            ${sharer.amount}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Container>
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
                  {groupTransaction.note ? groupTransaction.note : ""}
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
        <AddGroupTransactionForm
          mode="edit"
          isOpen={isOpen}
          onClose={onCloseEdit}
          groupId={groupId}
          transactionId={transactionId}
        />
      )}
    </>
  );
}
