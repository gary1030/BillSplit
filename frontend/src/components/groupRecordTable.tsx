"use client";

import { Category, Repayment, Transaction } from "@/types";

import fetchCategories from "@/actions/fetchCategories";
import fetchGroup from "@/actions/group/fetchGroup";
import fetchGroupRepayments from "@/actions/group/fetchGroupRepayments";
import fetchGroupTransactions from "@/actions/group/fetchGroupTransactions";
import fetchUserBatch from "@/actions/user/fetchUserBatch";
import Loading from "@/components/loading";
import useCategory from "@/hooks/useCategory";
import {
  Box,
  Hide,
  SkeletonText,
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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { MdOutlineRefresh } from "react-icons/md";
import { PiMoneyLight } from "react-icons/pi";
import ReadGroupRepaymentForm from "./readGroupRepaymentForm";
import ReadGroupTransactionForm from "./readGroupTransactionForm";

interface GroupRecordTableProps {
  groupId: string;
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
  {
    key: "status",
    name: "Status",
    minWidth: "70px",
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

export default function GroupRecordTable({ groupId }: GroupRecordTableProps) {
  const [cookies] = useCookies(["userId"]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRecord, setSelectedRecord] = useState<UnifiedRecord | null>(
    null
  );
  const [recordType, setRecordType] = useState("transaction");
  const { categoryToIcon } = useCategory();

  const onRecordClick = (record: UnifiedRecord) => {
    if (record.title) {
      setRecordType("transaction");
    }
    if (record.payerId) {
      setRecordType("repayment");
    }
    setSelectedRecord(record);
    onOpen();
  };

  const { data: group } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroup(groupId),
  });

  const { data: membersData, isLoading: isMemberLoading } =
    useQuery<MembersData>({
      queryKey: ["groupMembers", group?.memberIds || []],
      queryFn: () => fetchUserBatch(group.memberIds || []),
    });

  const { data: categoryData } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const { data: records, isLoading: isTransactionLoading } = useQuery<
    Transaction[]
  >({
    queryKey: ["groupTransactions", groupId],
    queryFn: () => fetchGroupTransactions(groupId),
  });

  const { data: repayments, isLoading: isRepaymentLoading } = useQuery<
    Repayment[]
  >({
    queryKey: ["groupRepayments", groupId],
    queryFn: () => fetchGroupRepayments(groupId),
  });

  const repaymentsWithDate = repayments?.map((repayment) => ({
    ...repayment,
    consumptionDate: repayment.createdAt,
  }));
  const allRecords: UnifiedRecord[] = [
    ...(records || []),
    ...(repaymentsWithDate || []),
  ];

  const showTitle = (record: any) => {
    let title = record.title || "";
    if (record.receiverId && record.payerId) {
      const receiver = membersData?.users.find(
        (user) => user.id === record.receiverId
      );
      const payer = membersData?.users.find(
        (user) => user.id === record.payerId
      );
      title = `${payer?.username} repaid ${receiver?.username}`;
    }

    return (
      <Box display="flex">
        <Hide below="sm">
          {showCategory(record.categoryId || "Repayment")}
          <Box w="10px" />
        </Hide>
        {!record.title && isMemberLoading ? (
          <SkeletonText>...</SkeletonText>
        ) : (
          <Text textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
            {title}
          </Text>
        )}
      </Box>
    );
  };

  const showCategory = (categoryId: string) => {
    if (categoryId === "Repayment") {
      return <MdOutlineRefresh size={20} />;
    }
    const category = categoryData?.find((item) => item.id === categoryId);
    if (!category) {
      return <PiMoneyLight size={20} />;
    }
    return categoryToIcon(category.name);
  };

  const showStatus = (record: any) => {
    if (!record.payerDetails || !record.splitDetails) {
      return <Text>--</Text>;
    }

    let balance = 0;
    let textColor = "purple.500";
    let balanceText = `$${balance}`;
    let status = "Not joined";
    let inRecord = false;

    if (record.payerDetails) {
      record.payerDetails.forEach((payer: any) => {
        if (payer.payerId === cookies.userId) {
          balance += payer.amount;
          if (payer.amount !== 0) {
            inRecord = true;
          }
        }
      });
    }

    if (record.splitDetails) {
      record.splitDetails.forEach((sharer: any) => {
        if (sharer.sharerId === cookies.userId) {
          balance -= sharer.amount;
          if (sharer.amount !== 0) {
            inRecord = true;
          }
        }
      });
    }

    if (balance < 0) {
      balanceText = `$${Math.round(Math.abs(balance) * 100) / 100}`;
      textColor = "red.500";
      status = "Borrowed";
    } else if (balance === 0 && inRecord) {
      balanceText = "$0";
      textColor = "purple.500";
      status = "Balanced";
    } else if (balance > 0) {
      balanceText = `$${Math.round(Math.abs(balance) * 100) / 100}`;
      textColor = "green.500";
      status = "Lent";
    }

    return (
      <Box>
        <Text color={textColor}>{balanceText}</Text>
        <Text fontSize="sm">{status}</Text>
      </Box>
    );
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
    <>
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
                  <Td
                    padding={PADDING}
                    minWidth={TABLE_COLUMNS[3].minWidth}
                    isNumeric
                  >
                    {showStatus(record)}
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      {selectedRecord && recordType == "transaction" && isOpen && (
        <ReadGroupTransactionForm
          isOpen={isOpen}
          onClose={onClose}
          groupId={groupId}
          transactionId={selectedRecord?.id || ""}
        />
      )}
      {selectedRecord && recordType == "repayment" && isOpen && (
        <ReadGroupRepaymentForm
          isOpen={isOpen}
          onClose={onClose}
          groupId={groupId}
          repaymentId={selectedRecord?.id || ""}
        />
      )}
      {allRecords?.length === 0 && (
        <Box mt={10}>
          <Text textAlign="center" fontSize="xl">
            Oops! No records found.
          </Text>
        </Box>
      )}
      {(isTransactionLoading || isRepaymentLoading) && <Loading />}
    </>
  );
}
