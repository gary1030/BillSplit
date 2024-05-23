"use client";

import { Category, Repayment, Transaction } from "@/types";

import fetchCategories from "@/actions/fetchCategories";
import fetchUserGroups from "@/actions/fetchUserGroups";
import fetchPersonalTransactions from "@/actions/user/fetchPersonalTransactions";
import fetchGroup from "@/actions/group/fetchGroup";
import fetchGroupRepayments from "@/actions/group/fetchGroupRepayments";
import fetchGroupTransactions from "@/actions/group/fetchGroupTransactions";
import fetchUserBatch from "@/actions/user/fetchUserBatch";

import {
  Container,
  Heading,
  Box,
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

import { useQuery, useQueries } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { MdOutlineRefresh } from "react-icons/md";
import { PiMoneyLight } from "react-icons/pi";

import useCategory from "@/hooks/useCategory";
import { useState } from "react";
import ReadGroupRepaymentForm from "./readGroupRepaymentForm";
import ReadGroupTransactionForm from "./readGroupTransactionForm";
import Loading from "./loading";

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
    maxWidth: { base: "95px", md: "280px" },
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

interface User {
  id: string;
  username: string;
  email: string;
}

interface MembersData {
  users: User[];
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
  const { categoryToIcon } = useCategory();

  const onRecordClick = (record: UnifiedRecord) => {
    if (!record.title) return;
    setSelectedRecord(record);
    onOpen();
  };

  const { data: categoryData } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const { data: personalTransactions } = useQuery<Transaction[]>({
    queryKey: ["personalTransactions", cookies.userId],
    queryFn: () => fetchPersonalTransactions(cookies.userId),
  });

  const { data: userGroups, isLoading } = useQuery({
    queryKey: ["userGroups", cookies.userId],
    queryFn: () => fetchUserGroups(),
  });

  const groups = userGroups?.data;

  function fetchTransactionsForGroup(group: Group) {
    return fetchGroupTransactions(group.id).then((transactions) =>
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
        queryKey: ["groupTransactions", group.id],
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

  console.log(allRecords);

  const showTitle = (record: any) => {
    let title = record.title || "";
    let groupName = record.groupName || "";

    return (
      <Box display="flex">
        <Hide below="sm">
          {showCategory(record.categoryId)}
          {groupName ? (
            <>
              <Text ml="3" mr="1">
                {groupName} -
              </Text>
            </>
          ) : (
            <Box w="10px" />
          )}
        </Hide>
        <Text textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
          {title}
        </Text>
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
    <Container mt={5} mb={5} ml={0} mr={0} p={0}>
      <Heading size={{ base: "md", md: "lg" }} mb="10px">
        Personal Record
      </Heading>
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
            {allRecords
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
                      ? `$${Math.round(record.totalAmount * 100) / 100}`
                      : record.amount &&
                        `$${Math.round(record.amount * 100) / 100}`}
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}
