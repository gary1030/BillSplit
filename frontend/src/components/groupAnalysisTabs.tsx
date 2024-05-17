"use client";

import GroupAnalysisChartAndTable from "./groupAnalysisChartAndTable";
import {
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

interface GroupRecordTableProps {
  groupId: string;
}

export default function GroupBalanceAccordion({
  groupId,
}: GroupRecordTableProps) {
  return (
    <>
      <Heading size="lg" mb="10px">
        Anaiysis
      </Heading>
      <Tabs align="center" size={{ base: "sm", md: "md" }}>
        <TabList w="fit-content">
          <Tab>Group</Tab>
          <Tab>Personal</Tab>
        </TabList>
        <TabPanels>
          <TabPanel maxW="500px" p={0} mb="30px">
            <GroupAnalysisChartAndTable isPersonal={false} groupId={groupId} />
          </TabPanel>
          <TabPanel maxW="500px" p={0} mb="30px">
            <GroupAnalysisChartAndTable isPersonal={true} groupId={groupId} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
