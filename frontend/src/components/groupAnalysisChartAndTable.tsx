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
    flex: 3,
    minWidth: "115px",
  },
  {
    key: "amount",
    name: "Amount",
    isNumeric: true,
    textAlign: "right",
    flex: 2,
    minWidth: "100px",
  },
  {
    key: "ratio",
    name: "Ratio",
    isNumeric: true,
    textAlign: "right",
    flex: 2,
    minWidth: "80px",
  },
];

const PADDINGX = "8px !important";

export default function GroupAnalysisChartAndTable({
  isPersonal,
  groupId,
}: GroupAnalysisChartAndTableProps) {
  const { data: categoryData } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const { data: analysisData } = useQuery({
    queryKey: isPersonal
      ? ["groupPersonalAnalysis", groupId]
      : ["groupAnalysis", groupId],
    queryFn: isPersonal
      ? () => fetchGroupPersonalAnalysis(groupId)
      : () => fetchGroupAnalysis(groupId),
  });

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
      <TableContainer mt={5}>
        <Table size={{ base: "sm", md: "md" }} variant="striped">
          <Thead>
            <Tr display="flex">
              {TABLE_COLUMNS.map((column) => (
                <Th
                  key={column.key}
                  px={PADDINGX}
                  isNumeric={column.isNumeric}
                  textAlign={(column.textAlign as any) || "left"}
                  flex={column.flex}
                  minW={column.minWidth}
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
                      <Tr key={categoryId} display="flex">
                        <Td
                          px={PADDINGX}
                          textAlign={
                            (TABLE_COLUMNS[0].textAlign as any) || "left"
                          }
                          flex={TABLE_COLUMNS[0].flex}
                          minW={TABLE_COLUMNS[0].minWidth}
                        >
                          {showCategory(categoryId)}
                        </Td>
                        <Td
                          px={PADDINGX}
                          flex={TABLE_COLUMNS[1].flex}
                          minW={TABLE_COLUMNS[1].minWidth}
                          isNumeric
                        >
                          ${Math.round(Number(amount) * 100) / 100}
                        </Td>
                        <Td
                          px={PADDINGX}
                          flex={TABLE_COLUMNS[2].flex}
                          minW={TABLE_COLUMNS[2].minWidth}
                          isNumeric
                        >
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
            <Tr display="flex">
              <Td
                px={PADDINGX}
                textAlign="right"
                flex={TABLE_COLUMNS[0].flex}
                minW={TABLE_COLUMNS[0].minWidth}
              >
                Total
              </Td>
              <Td
                px={PADDINGX}
                flex={TABLE_COLUMNS[1].flex}
                minW={TABLE_COLUMNS[1].minWidth}
                isNumeric
              >
                ${Math.round(analysisData?.total * 100) / 100}
              </Td>
              <Td
                px={PADDINGX}
                flex={TABLE_COLUMNS[2].flex}
                minW={TABLE_COLUMNS[2].minWidth}
              />
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
