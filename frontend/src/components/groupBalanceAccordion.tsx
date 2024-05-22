"use client";

import fetchGroup from "@/actions/group/fetchGroup";
import fetchGroupBalance from "@/actions/group/fetchGroupBalance";
import fetchUserBatch from "@/actions/user/fetchUserBatch";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useCookies } from "react-cookie";

import AddGroupRepaymentForm from "./addGroupRepaymentForm";
import Loading from "./loading";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [payerId, setPayerId] = useState<string>("");
  const [payerName, setPayerName] = useState<string>("");
  const [payerAvatarUrl, setPayerAvatarUrl] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [receiverId, setReceiverId] = useState<string>("");
  const [receiverName, setReceiverName] = useState<string>("");
  const [receiverAvatarUrl, setReceiverAvatarUrl] = useState<string>("");

  const { data: group } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroup(groupId),
  });

  const { data: membersData } = useQuery<MembersData>({
    queryKey: ["groupMembers", group?.memberIds || []],
    queryFn: () => fetchUserBatch(group.memberIds || []),
  });

  const { data: groupBalanceData, error: groupBalanceError, isLoading: isBalanceLoading } = useQuery({
    queryKey: ["groupBalance", groupId],
    queryFn: () => fetchGroupBalance(groupId),
  });

  const onRecordClick = (
    payerId: string,
    payerName: string,
    payerAvatarUrl: string,
    amount: number,
    receiverId: string,
    receiverName: string,
    receiverAvatarUrl: string
  ) => {
    setPayerId(payerId);
    setPayerName(payerName);
    setPayerAvatarUrl(payerAvatarUrl);
    setAmount(amount);
    setReceiverId(receiverId);
    setReceiverName(receiverName);
    setReceiverAvatarUrl(receiverAvatarUrl);
    onOpen();
  };

  const showStatus = (balance: number) => {
    let balanceText = `+$${balance}`;
    let textColor = "green.500";
    let status = "Payable";

    if (balance >= 0.01) {
      balanceText = `-$${Math.abs(balance)}`;
      textColor = "red.500";
      status = "Payable";
    } else if (balance <= -0.01) {
      balanceText = `+$${Math.abs(balance)}`;
      textColor = "green.500";
      status = "Receivable";
    } else {
      balanceText = "$0";
      textColor = "purple.500";
      status = "Settled";
    }

    return (
      <>
        <Text flex={1} color={textColor} textAlign="right" minW="120px" px={2}>
          {balanceText}
        </Text>
        <Text flex={1} textAlign="center" minW="95px" px={2}>
          {status}
        </Text>
      </>
    );
  };

  const showDebts = (payerId: string, receiverId: string, amount: number) => {
    const payerName =
      membersData?.users.find((user) => user.id === payerId)?.username ||
      "Unknown";
    const payerAvatarUrl = `https://api.dicebear.com/8.x/open-peeps/svg?seed=${payerName}`;

    const receiverName =
      membersData?.users.find((user) => user.id === receiverId)?.username ||
      "Unknown";
    const receiverAvatarUrl = `https://api.dicebear.com/8.x/open-peeps/svg?seed=${receiverName}`;

    return (
      <Flex
        flexDirection={"row"}
        w="min-content"
        py={4}
        key={payerId + "_" + receiverId + "_" + amount}
      >
        <Container flex={1} textAlign="center" pr={{ base: "0px", md: "16px" }}>
          <Avatar
            name={payerName}
            src={payerAvatarUrl}
            border="2px"
            color="black"
          />
          <Text minW="64px">{payerName}</Text>
        </Container>
        <Container flex={1} minW="fit-content" textAlign="center">
          <Text minW="110px" mr="15px">
            ${amount}
          </Text>
          <Flex minW="95px" h="fit-content" flexDirection="row">
            <Box mt="5px" w="full" h="2px" bg="black" float="left" />
            <Box
              mt="0px"
              w="0px"
              h="0px"
              borderTop="6px solid transparent"
              borderBottom="6px solid transparent"
              borderLeft="15px solid black"
              float="right"
            />
          </Flex>
          <Button
            size="sm"
            colorScheme="gray"
            variant="outline"
            mr="15px"
            onClick={() =>
              onRecordClick(
                payerId,
                payerName,
                payerAvatarUrl,
                amount,
                receiverId,
                receiverName,
                receiverAvatarUrl
              )
            }
          >
            Settle Up
          </Button>
        </Container>
        <Container flex={1} textAlign="center" pl={{ base: "0px", md: "16px" }}>
          <Avatar
            name={receiverName}
            src={receiverAvatarUrl}
            border="2px"
            color="black"
          />
          <Text minW="64px">{receiverName}</Text>
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
      <AccordionItem minW="350px" key={userId}>
        <AccordionButton textAlign="center" py={4} pl={1}>
          <Container flex={1} p={0}>
            <Avatar
              name={userName}
              src={avatarUrl}
              border="2px"
              color="black"
            />
            <Text minW="64px">{userName}</Text>
          </Container>
          {showStatus(balance)}
          <AccordionIcon fontSize="25px" />
        </AccordionButton>
        <AccordionPanel
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {groupBalanceData?.map(
            (userBalanceAndDebt: any) =>
              userId === userBalanceAndDebt.userId &&
              (!userBalanceAndDebt.debts ||
                userBalanceAndDebt.debts.length === 0) && (
                <Text textAlign="center" px={2} key={userId + "noDebt"}>
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
      <Heading size={{ base: "md", md: "lg" }} mb="10px">
        Balance
      </Heading>
      <Accordion allowMultiple defaultIndex={[0]} mt={5} overflow="auto">
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
      {isOpen && (
        <AddGroupRepaymentForm
          mode="create"
          isOpen={isOpen}
          onClose={onClose}
          groupId={groupId}
          payerId={payerId}
          payerName={payerName}
          payerAvatarUrl={payerAvatarUrl}
          amount={amount}
          receiverId={receiverId}
          receiverName={receiverName}
          receiverAvatarUrl={receiverAvatarUrl}
        />
      )}
      {isBalanceLoading && <Loading />}
    </>
  );
}
