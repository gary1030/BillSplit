"use client";

import { Category } from "@/types";

import fetchCategories from "@/actions/fetchCategories";
import fetchGroupAnalysis from "@/actions/group/fetchGroupAnalysis";
import fetchGroupPersonalAnalysis from "@/actions/group/fetchGroupPersonalAnalysis";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Hide,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FaShoppingCart } from "react-icons/fa";
import { GiHealthNormal } from "react-icons/gi";
import { ImSpoonKnife } from "react-icons/im";
import {
  MdEmojiTransportation,
  MdHome,
  MdOutlineCastForEducation,
  MdOutlineSportsEsports,
} from "react-icons/md";
import { PiMoneyLight } from "react-icons/pi";
import { TbMoneybag } from "react-icons/tb";

interface GroupAnalysisChartAndTableProps {
  isPersonal: boolean;
  groupId: string;
}

const TABLE_COLUMNS = [
  {
    key: "category",
    name: "Category",
    textAlign: "left",
  },
  {
    key: "amount",
    name: "Amount",
    isNumeric: true,
    textAlign: "right",
  },
  {
    key: "ratio",
    name: "Ratio",
    isNumeric: true,
    textAlign: "right",
  },
];

const PADDING = "8px !important";

export default function GroupAnalysisChartAndTable({
  isPersonal,
  groupId,
}: GroupAnalysisChartAndTableProps) {
  const { data: categoryData } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  let analysisData;
  if (!isPersonal) {
    const queryResult = useQuery({
      queryKey: ["groupAnalysis", groupId],
      queryFn: () => fetchGroupAnalysis(groupId),
    });
    analysisData = queryResult.data;
  } else {
    const queryResult = useQuery({
      queryKey: ["groupPersonalAnalysis", groupId],
      queryFn: () => fetchGroupPersonalAnalysis(groupId),
    });
    analysisData = queryResult.data;
  }

  const categoryToIcon = (categoryName: string) => {
    switch (categoryName) {
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

  const showCategory = (categoryId: string) => {
    const categoryName = categoryData?.find((item) => item.id === categoryId);

    return (
      <Box display="flex">
        <Hide below="sm">
          {categoryToIcon(categoryName?.name || "")}
          <Box w="10px" />
        </Hide>
        <Text textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
          {categoryName?.name}
        </Text>
      </Box>
    );
  };

  return (
    <>
      <TableContainer>
        <Table size={{ base: "sm", md: "md" }} variant={"striped"}>
          <Thead>
            <Tr>
              {TABLE_COLUMNS.map((column) => (
                <Th
                  key={column.key}
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
            {analysisData &&
              Object.entries<{ [key: string]: number }>(analysisData.analysis)
                .sort((a, b) => Number(b[1]) - Number(a[1]))
                .map(([categoryId, amount]) => {
                  if (Number(amount) > 0) {
                    return (
                      <Tr key={categoryId}>
                        <Td
                          padding={PADDING}
                          textAlign={
                            (TABLE_COLUMNS[0].textAlign as any) || "left"
                          }
                        >
                          {showCategory(categoryId)}
                        </Td>
                        <Td padding={PADDING} isNumeric>
                          ${Math.round(Number(amount) * 100) / 100}
                        </Td>
                        <Td padding={PADDING} isNumeric>
                          {Math.round(
                            (Number(amount) / analysisData.total) * 100 * 100
                          ) / 100}
                          %
                        </Td>
                      </Tr>
                    );
                  }
                })}
          </Tbody>
          <Tfoot fontWeight="bold">
            <Tr>
              <Td padding={PADDING} textAlign="right">
                Total
              </Td>
              <Td padding={PADDING} isNumeric>
                ${Math.round(analysisData?.total * 100) / 100}
              </Td>
              <Td />
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
      {analysisData && analysisData.total === 0 && (
        <Box mt={10}>
          <Text textAlign="center" fontSize="xl">
            Oops! No analyses found.
          </Text>
        </Box>
      )}
    </>
  );
}
