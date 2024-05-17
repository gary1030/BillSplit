"use client";

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
      <Tabs align="center">
        <TabList w="fit-content">
          <Tab w="100px">Group</Tab>
          <Tab w="100px">Personal</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>GroupAnalysis</TabPanel>
          <TabPanel>PersonalAnalysis</TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
