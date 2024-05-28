"use client";

import { Category, Transaction } from "@/types";

import fetchCategories from "@/actions/fetchCategories";
import fetchUserGroups from "@/actions/fetchUserGroups";
import fetchGroupTransactions from "@/actions/group/fetchGroupTransactions";
import fetchPersonalTransactions from "@/actions/user/fetchPersonalTransactions";

import {
  Box,
  Container,
  Heading,
  Hide,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";

import { useQueries, useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { PiMoneyLight } from "react-icons/pi";

import useCategory from "@/hooks/useCategory";
import { useState } from "react";
import ReadGroupTransactionForm from "./readGroupTransactionForm";
import ReadPersonalTransactionForm from "./readPersonalTransactionForm";

interface Group {
  id: string;
  name: string;
  theme: string;
}

interface PersonalRecordProps {
  startTime: Date;
  endTime: Date;
}

const TABLE_COLUMNS = [
  {
    key: "date",
    name: "Date",
    minWidth: "80px",
    textAlign: "center",
    maxWidth: "80px",
  },
  {
    key: "title",
    name: "Title",
    maxWidth: { base: "180px", md: "350px" },
  },
  {
    key: "amount",
    name: "Amount",
    minWidth: "60px",
    isNumeric: true,
    textAlign: "right",
  },
];

const PADDING = "8px !important";

interface UnifiedRecord {
  id: string;
  categoryId?: string;
  groupId?: string;
  title?: string;
  totalAmount?: number;
  amount?: number;
  consumptionDate: string;
  payerDetails?: Array<{ payerId: string; amount: number }>;
  splitDetails?: Array<{ sharerId: string; amount: number }>;
  payerId?: string;
  receiverId?: string;
  createdAt: string;
}

export default function PersonalRecord({
  startTime,
  endTime,
}: PersonalRecordProps) {
  const [cookies] = useCookies(["userId"]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRecord, setSelectedRecord] = useState<UnifiedRecord | null>(
    null
  );
  const [recordType, setRecordType] = useState("personal");
  const { categoryToIcon } = useCategory();

  const onRecordClick = (record: UnifiedRecord) => {
    if (!record.title) return;
    if (record.totalAmount) {
      setRecordType("group");
    } else {
      setRecordType("personal");
    }
    setSelectedRecord(record);
    onOpen();
  };

  const { data: categoryData } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const { data: personalTransactions } = useQuery<Transaction[]>({
    queryKey: ["personalTransactions", cookies.userId, startTime, endTime],
    queryFn: () =>
      fetchPersonalTransactions(cookies.userId, startTime, endTime),
  });

  const { data: userGroups, isLoading } = useQuery({
    queryKey: ["userGroups", cookies.userId],
    queryFn: () => fetchUserGroups(),
  });

  const groups = userGroups?.data;

  function fetchTransactionsForGroup(group: Group) {
    return fetchGroupTransactions(group.id, startTime, endTime).then(
      (transactions) =>
        transactions.map((transaction: Transaction) => ({
          ...transaction,
          groupId: group.id,
          groupName: group.name,
        }))
    );
  }

  const transactionQueries = useQueries<UnifiedRecord[]>({
    queries:
      groups?.map((group: Group) => ({
        queryKey: ["groupTransactions", group.id, startTime, endTime],
        queryFn: () => fetchTransactionsForGroup(group),
        enabled: groups !== undefined,
      })) || [],
  });

  const groupTransactions: UnifiedRecord[] = transactionQueries
    .filter((query) => query.isSuccess && query.data)
    .flatMap((query) => query.data as UnifiedRecord[]);

  const allRecords: UnifiedRecord[] = [
    ...(personalTransactions || []),
    ...(groupTransactions || []),
  ];

  const filteredRecords = allRecords.filter((record) => {
    if (!record.totalAmount) {
      return true;
    }
    return record.splitDetails?.some(
      (splitDetail) =>
        splitDetail.sharerId === cookies.userId && splitDetail.amount > 0
    );
  });

  const showTitle = (record: any) => {
    let title = record.title || "";
    let groupName = record.groupName || "";

    return (
      <Box display="flex">
        <Hide below="sm">
          {showCategory(record.categoryId)}
          <Box w="10px" />
        </Hide>
        {groupName ? (
          <Text textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
            {groupName} - {title}
          </Text>
        ) : (
          <Text textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
            {title}
          </Text>
        )}
      </Box>
    );
  };

  const showCategory = (categoryId: string) => {
    const category = categoryData?.find((item) => item.id === categoryId);
    if (!category) {
      return <PiMoneyLight size={20} />;
    }
    return categoryToIcon(category.name);
  };

  const getSplitAmount = (record: UnifiedRecord, userId: string) => {
    if (!record.splitDetails) {
      return -1;
    }
    const splitDetail = record.splitDetails.find(
      (splitDetail) => splitDetail.sharerId === userId
    );
    return splitDetail ? splitDetail.amount : -1;
  };

  const isSmOrLarger = useBreakpointValue({ base: false, sm: true });
  const showDate = (date: Date) => {
    return (
      <Box mb="5px">
        <Text fontSize="xs">{date.getFullYear()}</Text>
        <Text as="b">{`${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${
          isSmOrLarger ? dayToString(date.getDay()) + "." : ""
        }`}</Text>
      </Box>
    );
  };

  const dayToString = (day: number) => {
    switch (day) {
      case 0:
        return "Sun";
      case 1:
        return "Mon";
      case 2:
        return "Tue";
      case 3:
        return "Wed";
      case 4:
        return "Thu";
      case 5:
        return "Fri";
      case 6:
        return "Sat";
      default:
        return "Sun";
    }
  };

  return (
    <Container mt={5} mb={5} ml={0} mr={0} p={0} maxW="100%">
      <Heading size={{ base: "md", md: "lg" }} mb="10px">
        Personal Record
      </Heading>
      {endTime === undefined && (
        <Box mt={10}>
          <Text textAlign="center" fontSize="xl">
            Invalid date range.
          </Text>
        </Box>
      )}
      {startTime !== undefined && endTime !== undefined && (
        <TableContainer mt={5}>
          <Table size={{ base: "sm", md: "md" }} variant={"striped"}>
            <Thead>
              <Tr>
                {TABLE_COLUMNS.map((column) => (
                  <Th
                    key={column.key}
                    minW={column.minWidth}
                    maxW={column.maxWidth}
                    padding={PADDING}
                    isNumeric={column.isNumeric}
                    textAlign={(column.textAlign as any) || "left"}
                  >
                    {column.name}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {filteredRecords
                ?.sort((a, b) => {
                  const consumptionDateDifference =
                    new Date(b.consumptionDate).getTime() -
                    new Date(a.consumptionDate).getTime();

                  if (consumptionDateDifference === 0) {
                    return (
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                    );
                  } else {
                    return consumptionDateDifference;
                  }
                })
                .map((record) => (
                  <Tr
                    key={record.id}
                    _hover={{ cursor: "pointer" }}
                    onClick={() => onRecordClick(record)}
                  >
                    <Td
                      padding={PADDING}
                      minWidth={TABLE_COLUMNS[0].minWidth}
                      maxWidth={TABLE_COLUMNS[0].maxWidth}
                      textAlign={(TABLE_COLUMNS[0].textAlign as any) || "left"}
                    >
                      {showDate(new Date(record.consumptionDate))}
                    </Td>
                    <Td
                      padding={PADDING}
                      minWidth={TABLE_COLUMNS[1].minWidth}
                      maxWidth={TABLE_COLUMNS[1].maxWidth}
                      textAlign={(TABLE_COLUMNS[1].textAlign as any) || "left"}
                    >
                      {showTitle(record)}
                    </Td>
                    <Td
                      padding={PADDING}
                      minWidth={TABLE_COLUMNS[2].minWidth}
                      isNumeric
                    >
                      {record.totalAmount
                        ? `$${getSplitAmount(record, cookies.userId)}`
                        : record.amount &&
                          `$${Math.round(record.amount * 100) / 100}`}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      {startTime !== undefined &&
        endTime !== undefined &&
        filteredRecords?.length === 0 && (
          <Box mt={10}>
            <Text textAlign="center" fontSize="xl">
              Oops! No records found.
            </Text>
          </Box>
        )}
      {selectedRecord && recordType == "personal" && isOpen && (
        <ReadPersonalTransactionForm
          isOpen={isOpen}
          onClose={onClose}
          userId={cookies.userId}
          transactionId={selectedRecord?.id || ""}
        />
      )}
      {selectedRecord && recordType == "group" && isOpen && (
        <ReadGroupTransactionForm
          isOpen={isOpen}
          onClose={onClose}
          groupId={selectedRecord?.groupId || ""}
          transactionId={selectedRecord?.id || ""}
          isPersonal={true}
        />
      )}
    </Container>
  );
}
