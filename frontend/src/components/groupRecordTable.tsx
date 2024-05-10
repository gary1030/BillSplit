"use client";

import { Category, Transaction } from "@/types";

import fetchCategories from "@/actions/fetchCategories";
import fetchGroupTransactions from "@/actions/group/fetchGroupTransactions";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { FaShoppingCart } from "react-icons/fa";
import { GiHealthNormal } from "react-icons/gi";
import { ImSpoonKnife } from "react-icons/im";
import {
  MdEmojiTransportation,
  MdHome,
  MdOutlineCastForEducation,
  MdOutlineRefresh,
  MdOutlineSportsEsports,
} from "react-icons/md";
import { PiMoneyLight } from "react-icons/pi";
import { TbMoneybag } from "react-icons/tb";

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
  { key: "title", name: "Title" },
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

const PADDING = "8px";

export default function GroupRecordTable({ groupId }: GroupRecordTableProps) {
  const [cookies] = useCookies(["userId"]);

  const { data: categoryData } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const { data: records } = useQuery<Transaction[]>({
    queryKey: ["groupTransactions", groupId],
    queryFn: () => fetchGroupTransactions(groupId),
  });

  const categoryToIcon = (categoryId: string) => {
    if (categoryId === "Repayment") {
      return <MdOutlineRefresh size={20} />;
    }
    const category = categoryData?.find((item) => item.id === categoryId);
    if (!category) {
      return <PiMoneyLight size={20} />;
    }

    switch (category.name) {
      case "Food":
        return <ImSpoonKnife size={20} />;
      case "Transportation":
        return <MdEmojiTransportation size={20} />;
      case "Entertainment":
        return <MdOutlineSportsEsports size={20} />;
      case "Shopping":
        return <FaShoppingCart size={20} />;
      case "Health":
        return <GiHealthNormal size={20} />;
      case "Education":
        return <MdOutlineCastForEducation size={20} />;
      case "Life":
        return <MdHome size={20} />;
      case "Investment":
        return <TbMoneybag size={20} />;
      default:
        return <PiMoneyLight size={20} />;
    }
  };

  const showStatus = (record: any) => {
    let balance = 0;
    let textColor = "green.500";
    let balanceText = `+$${balance}`;
    let status = "Payable";

    if (record.payerDetails) {
      record.payerDetails.forEach((payer: any) => {
        if (payer.payerId === cookies.userId) {
          balance += payer.amount;
        }
      });
    }

    if (record.splitDetails) {
      record.splitDetails.forEach((sharer: any) => {
        if (sharer.sharerId === cookies.userId) {
          balance -= sharer.amount;
        }
      });
    }

    if (balance < 0) {
      balanceText = `-$${Math.abs(balance)}`;
      textColor = "red.500";
      status = "Payable";
    } else if (balance === 0) {
      balanceText = "$0";
      textColor = "purple.500";
      status = "Settled";
    } else {
      balanceText = `+$${Math.abs(balance)}`;
      textColor = "green.500";
      status = "Receivable";
    }

    return (
      <Box>
        <Text color={textColor}>{balanceText}</Text>
        <Text fontSize="sm">{status}</Text>
      </Box>
    );
  };

  const showDate = (date: Date) => {
    return (
      <Box mb="5px">
        <Text fontSize="xs">{date.getFullYear()}</Text>
        <Text as="b">{`${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date
          .getDate()
          .toString()
          .padStart(2, "0")} ${dayToString(date.getDay())}.`}</Text>
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
    <TableContainer mt={5}>
      <Table size={"md"} variant={"striped"}>
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
          {records
            ?.sort(
              (a, b) =>
                new Date(b.consumptionDate).getTime() -
                new Date(a.consumptionDate).getTime()
            )
            .map((record) => (
              <Tr
                key={record.id}
                _hover={{ cursor: "pointer" }}
                onClick={() => console.log(record.id)}
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
                  textAlign={(TABLE_COLUMNS[1].textAlign as any) || "left"}
                >
                  <Box display="flex">
                    {categoryToIcon(record.categoryId)}
                    <Text ml={2}>{record.title}</Text>
                  </Box>
                </Td>
                <Td
                  padding={PADDING}
                  minWidth={TABLE_COLUMNS[2].minWidth}
                  isNumeric
                >
                  {`$${record.totalAmount}`}
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
  );
}
