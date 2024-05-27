"use client";

import { Category } from "@/types";

import fetchCategories from "@/actions/fetchCategories";
import fetchGroupAnalysis from "@/actions/group/fetchGroupAnalysis";
import fetchGroupPersonalAnalysis from "@/actions/group/fetchGroupPersonalAnalysis";
import {
  Box,
  Container,
  Hide,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import useCategory from "@/hooks/useCategory";
import { Chart } from "react-google-charts";
import Loading from "./loading";

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
  const { categoryToIcon } = useCategory();

  const { data: categoryData } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const { data: analysisData, isLoading } = useQuery({
    queryKey: isPersonal
      ? ["groupPersonalAnalysis", groupId]
      : ["groupAnalysis", groupId],
    queryFn: isPersonal
      ? () => fetchGroupPersonalAnalysis(groupId)
      : () => fetchGroupAnalysis(groupId),
  });

  const pieChartData = [
    ["Category", "Amount"],
    ...Object.entries(analysisData?.analysis || {})
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .map(([categoryId, amount]) => {
        const categoryName = categoryData?.find(
          (item) => item.id === categoryId
        );
        return [categoryName?.name, Math.round(Number(amount) * 100) / 100];
      }),
  ];

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

  const chartColors = [
    "#FC8181", // red.300
    "#F6AD55", // orange.300
    "#F6E05E", // yellow.300
    "#68D391", // green.300
    "#63B3ED", // blue.300
    "#76E4F7", // cyan.300
    "#B794F4", // purple.300
    "#E2E8F0", // gray.200
    "#A0AEC0", // gray.400
  ];

  return (
    <Container>
      {pieChartData.length > 1 && (
        <Chart
          chartType="PieChart"
          data={pieChartData}
          options={{
            is3D: true,
            backgroundColor: "transparent",
            chartArea: {
              width: "95%",
              height: "95%",
            },
            legend: {
              position: "right",
              alignment: "center",
              textStyle: {
                color: "black",
                fontSize: 14,
              },
            },
            pieSliceTextStyle: {
              color: "black",
              fontSize: 16,
              bold: true,
            },
            tooltip: { trigger: "selection" },
            colors: chartColors,
            sliceVisibilityThreshold: 0,
          }}
        />
      )}
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
          {analysisData?.total > 0 && (
            <>
              <Tbody>
                {Object.entries(analysisData.analysis)
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
            </>
          )}
        </Table>
      </TableContainer>
      {(!analysisData || analysisData?.total === 0) && (
        <Box mt={10}>
          <Text textAlign="center" fontSize="xl">
            Oops! No analyses found.
          </Text>
        </Box>
      )}
      {isLoading && <Loading />}
    </Container>
  );
}
