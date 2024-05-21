"use client";

import {
  Box,
  Flex,
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Avatar,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Container,
  useToast,
} from "@chakra-ui/react";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import FormHeader from "./formHeader";
import Loading from "./loading";

import createGroupRepayment from "@/actions/group/createGroupRepayment";
import editGroupRepayment from "@/actions/group/editGroupRepayment";
import fetchGroupSingleRepayment from "@/actions/group/fetchGroupRepayment";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface GroupRepaymentFormProps {
  mode: "create" | "edit";
  onClose: () => void;
  isOpen: boolean;
  groupId: string;
  repaymentId?: string;
  payerId: string;
  payerName: string;
  payerAvatarUrl: string;
  receiverId: string;
  receiverName: string;
  receiverAvatarUrl: string;
  amount: number;
}

export default function AddGroupRepaymentForm({
  onClose,
  isOpen,
  mode,
  groupId,
  repaymentId,
  payerId,
  payerName,
  payerAvatarUrl,
  receiverId,
  receiverName,
  receiverAvatarUrl,
  amount,
}: GroupRepaymentFormProps) {
  /* Repayment Data */
  const { data: repaymentData, error: repaymentError } = useQuery({
    queryKey: ["repayment", repaymentId],
    queryFn: () =>
      mode === "edit" && repaymentId !== undefined
        ? fetchGroupSingleRepayment(groupId, repaymentId)
        : Promise.resolve(),
    enabled: mode === "edit" && repaymentId !== undefined,
    staleTime: Infinity,
  });

  let groupRepayment = undefined;
  if (repaymentData !== undefined) {
    groupRepayment = repaymentData;
  }

  const [settleAmountString, setSettleAmountString] = useState("0");
  const [settleAmount, setSettleAmount] = useState(0);

  const toast = useToast();
  const queryClient = useQueryClient();

  /* Amount */
  useEffect(() => {
    if (mode === "edit" && groupRepayment !== undefined) {
      setSettleAmount(groupRepayment.amount);
      setSettleAmountString(groupRepayment.amount.toString());
    }
    if (mode === "create") {
      setSettleAmount(amount);
      setSettleAmountString(amount.toString());
    }
  }, [mode, groupRepayment]);

  // Handle amount input change
  const handleSettleAmountInputChange = (valueAsString: string) => {
    // If the input is empty, set the amount to 0
    if (valueAsString.trim() === "") {
      setSettleAmountString("0");
      setSettleAmount(0);
    }
    // If the input is a valid number, update the amount
    if (/^\d*\.?\d*$/.test(valueAsString)) {
      // Only allow digits and a single decimal point
      setSettleAmountString(valueAsString);
      let numericValue = parseFloat(valueAsString);
      if (!isNaN(numericValue)) {
        numericValue = parseFloat(numericValue.toFixed(2));
        setSettleAmount(numericValue);
      }
    }
  };

  // Set the precision of the amount value to two decimal places.
  const handleSettleAmountInputBlur = () => {
    let numericValue = parseFloat(settleAmountString) || 0;
    numericValue = parseFloat(numericValue.toFixed(2));
    setSettleAmountString(numericValue.toString());
    setSettleAmount(numericValue);
  };

  const { mutate: createGroupRepaymentMutation, isPending } = useMutation({
    mutationFn: () =>
      createGroupRepayment(groupId, payerId, receiverId, settleAmount),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groupRepayments", groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ["groupBalance", groupId],
      });
      toast({
        title: "Repayment created successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "An error occurred",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  const { mutate: editGroupRepaymentMutation, isPending: isEditPending } =
    useMutation({
      mutationFn: () => {
        if (!repaymentId) {
          throw new Error("Repayment ID is required");
        }
        return editGroupRepayment(
          repaymentId,
          groupId,
          payerId,
          receiverId,
          settleAmount
        );
      },
      mutationKey: ["repayment", repaymentId],
      onSuccess: () => {
        if (repaymentId) {
          queryClient.invalidateQueries({
            queryKey: ["repayment", repaymentId],
          });
          queryClient.invalidateQueries({
            queryKey: ["groupRepayments", repaymentId],
          });
        }

        setSettleAmountString("0");
        setSettleAmount(0);

        toast({
          title: "Repayment edited successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        onClose();
      },
      onError: () => {
        toast({
          title: "An error occurred",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      },
    });

  const onModelClose = () => {
    if (mode === "create") {
      setSettleAmountString("0");
      setSettleAmount(0);
    }
    onClose();
  };

  const handleAdd = () => {
    let hasErrors = false;

    if (settleAmount <= 0) {
      hasErrors = true;
      toast({
        title: "Amount should be greater than 0",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }

    if (!hasErrors) {
      if (mode === "edit") {
        editGroupRepaymentMutation();
        onClose();
        return;
      } else if (mode == "create") {
        createGroupRepaymentMutation();
        onClose();
        return;
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onModelClose} blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent w="90%" maxW="700px">
          <FormHeader
            title="Add a repayment"
            onClose={onModelClose}
            onSave={handleAdd}
          />
          <ModalBody>
            <Flex
              flexDirection={"row"}
              w="full"
              marginTop="6%"
              key={payerId + "_" + receiverId + "_" + amount}
            >
              <Container flex={1} textAlign="center">
                <Avatar
                  name={payerName}
                  src={payerAvatarUrl}
                  border="2px"
                  color="black"
                />
                <Text minW="64px">{payerName}</Text>
              </Container>
              <Container flex={1} minW="fit-content" textAlign="center">
                <NumberInput
                  defaultValue={0}
                  min={0}
                  precision={2}
                  onChange={handleSettleAmountInputChange}
                  onBlur={handleSettleAmountInputBlur}
                  value={settleAmountString}
                  marginLeft={7}
                  width={120}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Flex minW="100px" h="fit-content" flexDirection="row">
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
              </Container>
              <Container flex={1} textAlign="center">
                <Avatar
                  name={receiverName}
                  src={receiverAvatarUrl}
                  border="2px"
                  color="black"
                />
                <Text minW="64px">{receiverName}</Text>
              </Container>
            </Flex>
            <Box mt="15px" w="full" marginLeft={["0", "0", "25%"]}>
              <Text
                fontSize="sm"
                as="b"
                pl={["0", "0", "10px"]}
                pr="5px"
                color="blue"
                whiteSpace="normal"
                overflowWrap="break-word"
              >
                {settleAmount > amount
                  ? "Input amount is larger than the amount payable."
                  : ""}
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Box h="10px"></Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isPending || isEditPending ? <Loading /> : null}
    </>
  );
}
