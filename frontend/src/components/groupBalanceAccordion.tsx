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
  Container,
  Avatar,
  Text,
  Flex,
  Box,
  Button,
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
        <Text flex={2} color={textColor} textAlign="right" minW="80px" mx={2}>
          {balanceText}
        </Text>
        <Text flex={1} textAlign="center" minW="80px" mx={2}>
          {status}
        </Text>
      </>
    );
  };

  const showDebts = (payerId: string, receiverId: string, amount: number) => {
    const payerName = membersData?.users.find(
      (user) => user.id === payerId
    )?.username;
    const payerAvatarUrl = `https://api.dicebear.com/8.x/open-peeps/svg?seed=${payerName}`;

    const receiverName = membersData?.users.find(
      (user) => user.id === receiverId
    )?.username;
    const receiverAvatarUrl = `https://api.dicebear.com/8.x/open-peeps/svg?seed=${receiverName}`;

    return (
      <Flex
        flexDirection={"row"}
        display="flex"
        mb={4}
        key={payerId + "_" + receiverId + "_" + amount}
      >
        <Container flex={1} minW="80px" mx={2} textAlign="center">
          <Avatar
            name={payerName}
            src={payerAvatarUrl}
            border="2px"
            color="black"
          />
          <Text>{payerName}</Text>
        </Container>
        <Container flex={1} minW="75px" mx={2} textAlign="center">
          <Text mr="15px" minW="75px">
            ${amount}
          </Text>
          <Flex minW="90px" h="fit-content" flexDirection="row">
            <Box mt="5px" w="full" h="2px" bg="black" float="left" />
            <Box
              mt="0px"
              w="0px"
              h="0px"
              float="right"
              borderTop="6px solid transparent"
              borderBottom="6px solid transparent"
              borderLeft="15px solid black"
            />
          </Flex>
          <Button size="xs" colorScheme="gray" variant="outline" mr="15px">
            Settle Up
          </Button>
        </Container>
        <Container flex={1} minW="80px" mx={2} textAlign="center">
          <Avatar
            name={receiverName}
            src={receiverAvatarUrl}
            border="2px"
            color="black"
          />
          <Text>{receiverName}</Text>
        </Container>
      </Flex>
    );
  };

  const showBalance = (userId: string, balance: number) => {
    const userName = membersData?.users.find(
      (user) => user.id === userId
    )?.username;
    const avatarUrl = `https://api.dicebear.com/8.x/open-peeps/svg?seed=${userName}`;

    return (
      <AccordionItem minW="fit-content" key={userId}>
        <AccordionButton>
          <Container flex={1} minW="80px" mx={2} textAlign="center">
            <Avatar
              name={userName}
              src={avatarUrl}
              border="2px"
              color="black"
            />
            <Text>{userName}</Text>
          </Container>
          {showStatus(balance)}
          <AccordionIcon mx={2} fontSize="30px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          {groupBalanceData?.map(
            (userBalanceAndDebt: any) =>
              userId === userBalanceAndDebt.userId &&
              (!userBalanceAndDebt.debts ||
                userBalanceAndDebt.debts.length === 0) && (
                <Text textAlign="center" key={userId + "noDebt"}>
                  No debts to pay or receive.
                </Text>
              )
          )}
          {groupBalanceData?.map(
            (userBalanceAndDebt: any) =>
              userId === userBalanceAndDebt.userId &&
              userBalanceAndDebt.debts?.map((debt: any) =>
                showDebts(debt.payerId, debt.receiverId, debt.amount)
              )
          )}
        </AccordionPanel>
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
