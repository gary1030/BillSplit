"use client";

import fetchGroup from "@/actions/group/fetchGroup";
import fetchUserBatch from "@/actions/user/fetchUserBatch";
import fetchGroupBalance from "@/actions/group/fetchGroupBalance";
import {
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

interface GroupRecordTableProps {
  groupId: string;
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface MembersData {
  users: User[];
}

export default function GroupBalanceAccordion({
  groupId,
}: GroupRecordTableProps) {
  const [cookies] = useCookies(["userId"]);

  const { data: group } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroup(groupId),
  });

  const { data: membersData } = useQuery<MembersData>({
    queryKey: ["groupMembers", group?.memberIds || []],
    queryFn: () => fetchUserBatch(group.memberIds || []),
  });

  const { data: groupBalanceData, error: groupBalanceError } = useQuery({
    queryKey: ["groupBalance", groupId],
    queryFn: () => fetchGroupBalance(groupId),
  });

  const showStatus = (balance: number) => {
    let balanceText = `+$${balance}`;
    let textColor = "green.500";
    let status = "Payable";

    if (balance > 0) {
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
      <>
        <Text flex={1} color={textColor} textAlign="right" minW="80px" mx={2}>
          {balanceText}
        </Text>
        <Text flex={1} textAlign="center" minW="80px" mx={2}>
          {status}
        </Text>
      </>
    );
  };

  const showBalance = (userId: string, balance: number) => {
    const userName = membersData?.users.find(
      (user) => user.id === userId
    )?.username;
    const avatarUrl = `https://api.dicebear.com/8.x/open-peeps/svg?seed=${userName}`;

    return (
      <AccordionItem minW="fit-content">
        <AccordionButton>
          <Box flex={1} minW="75px" mx={2}>
            <Avatar name={userName} src={avatarUrl} border="2px" />
            <Text>{userName}</Text>
          </Box>
          {showStatus(balance)}
          <AccordionIcon mx={2} />
        </AccordionButton>
        <AccordionPanel pb={4}>TODO</AccordionPanel>
      </AccordionItem>
    );
  };

  return (
    <>
      <Heading size="lg" mb="10px">
        Balance
      </Heading>
      <Accordion
        allowMultiple
        defaultIndex={[0]}
        mt={5}
        size={"md"}
        overflow="auto"
      >
        {groupBalanceData?.map(
          (userBalanceAndDebt: any) =>
            cookies.userId === userBalanceAndDebt.userId &&
            showBalance(userBalanceAndDebt.userId, userBalanceAndDebt.balance)
        )}
        {groupBalanceData?.map(
          (userBalanceAndDebt: any) =>
            cookies.userId !== userBalanceAndDebt.userId &&
            showBalance(userBalanceAndDebt.userId, userBalanceAndDebt.balance)
        )}
      </Accordion>
    </>
  );
}
