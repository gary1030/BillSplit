"use client";

import {
  Box,
  Flex,
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useToast,
  Container,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { useQuery } from "@tanstack/react-query";

import { MdDateRange } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import { MdCategory } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { GoNote } from "react-icons/go";

import FormHeader from "./formHeader";
import Loading from "./loading";

import fetchCategories from "@/actions/fetchCategories";
import fetchGroupSingleTransaction from "@/actions/group/fetchGroupTransaction";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  username: string;
}

interface Payer {
  payerId: string;
  amount: number;
}

interface Sharer {
  sharerId: string;
  amount: number;
}

interface Category {
  id: string;
  name: string;
}

interface GroupTransactionFormProps {
  onClose: () => void;
  isOpen: boolean;
  groupId: string;
  members: Array<User>;
  name: string;
  transactionId: string;
}

export default function ReadGroupTransactionForm({
  onClose,
  isOpen,
  groupId,
  name,
  members,
  transactionId,
}: GroupTransactionFormProps) {
  const toast = useToast();

  /* Fetch datas */

  /* Categories */
  const { data: categoryData, error: categoryError } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
    staleTime: Infinity,
  });

  // extract unique categories
  const uniqueCategoryMap = new Map<string, Category>();
  categoryData?.data.forEach((item: Category) => {
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
    data: transactionData,
    error: transactionError,
    isLoading,
  } = useQuery({
    queryKey: ["transaction"],
    queryFn: () => fetchGroupSingleTransaction(groupId, transactionId),
    staleTime: Infinity,
  });
  const groupTransaction = transactionData?.data;

  if (isLoading) {
    return <Loading />;
  }

  /* Data Processing */

  // Get category name
  const selectedOption = options.find(
    (option) => option.value === groupTransaction.categoryId
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onModelClose}>
        <ModalOverlay />
        <ModalContent w="90%" maxW="700px">
          <FormHeader
            title="Expense"
            onClose={onModelClose}
            onEdit={onModelClose}
            onDelete={onModelClose}
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
                  {name}
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
                <Text fontSize="md" noOfLines={1} pl="10px" pr="5px">
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
    </>
  );
}
