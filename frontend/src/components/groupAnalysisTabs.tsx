"use client";

import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import GroupAnalysisChartAndTable from "./groupAnalysisChartAndTable";

interface GroupBalanceAccordionProps {
  groupId: string;
}

export default function GroupBalanceAccordion({
  groupId,
}: GroupBalanceAccordionProps) {
  return (
    <>
      <Heading size={{ base: "md", md: "lg" }} mb="10px">
        Analysis
      </Heading>
      <Tabs align="center" size={{ base: "sm", md: "md" }} isLazy>
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
