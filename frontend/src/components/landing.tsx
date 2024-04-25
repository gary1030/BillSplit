"use client";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

export default function Landing() {
  return (
    <>
      <h1 style={{ color: 'blue'}}>This is Landing Page</h1>
      <Tabs>
        <TabList>
          <Tab>One</Tab>
          <Tab>Two</Tab>
          <Tab>Three</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
