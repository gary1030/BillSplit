"use client";

import {
  Box,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { GoNote } from "react-icons/go";
import { MdAttachMoney, MdCategory, MdDateRange } from "react-icons/md";

import { SingleDatepicker } from "chakra-dayzed-datepicker";

import FormHeader from "./formHeader";
import Loading from "./loading";

import fetchCategories from "@/actions/fetchCategories";
import createPersonalTransaction from "@/actions/user/createPersonalTransaction";
import editPersonalTransaction from "@/actions/user/editPersonalTransaction";
import fetchPersonalSingleTransaction from "@/actions/user/fetchPersonalTransaction";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Category {
  id: string;
  name: string;
}

interface PersonalTransactionFormProps {
  mode: "create" | "edit";
  onClose: () => void;
  isOpen: boolean;
  userId: string;
  transactionId?: string;
}

export default function AddPersonalTransactionForm({
  onClose,
  isOpen,
  mode,
  userId,
  transactionId,
}: PersonalTransactionFormProps) {
  /* Transaction Data */
  const { data: transactionData, error: transactionError } = useQuery({
    queryKey: ["personalTransaction", transactionId],
    queryFn: () =>
      mode === "edit" && transactionId !== undefined
        ? fetchPersonalSingleTransaction(userId, transactionId)
        : Promise.resolve(),
    enabled: mode === "edit" && transactionId !== undefined,
    staleTime: Infinity,
  });

  let personalTransaction = undefined;
  if (transactionData !== undefined) {
    personalTransaction = transactionData;
  }

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("");

  const [amountString, setAmountString] = useState("0");
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");

  const toast = useToast();
  const queryClient = useQueryClient();

  /* Title */
  // initialize title in edit mode
  useEffect(() => {
    if (mode === "edit" && personalTransaction !== undefined) {
      setTitle(personalTransaction.title);
    }
  }, [mode, personalTransaction]);

  /* Categories */
  // fetch categories
  const {
    data: categoryData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
    staleTime: Infinity,
  });

  // extract unique categories
  const uniqueCategoryMap = new Map<string, Category>();
  categoryData?.forEach((item: Category) => {
    if (!uniqueCategoryMap.has(item.name)) {
      uniqueCategoryMap.set(item.name, item);
    }
  });
  const uniqueCategories = Array.from(uniqueCategoryMap?.values());

  // create options for select
  const options = uniqueCategories?.map((category: Category) => ({
    value: category.id,
    label: category.name,
  }));

  // initialize category in edit mode
  useEffect(() => {
    if (mode === "edit" && personalTransaction !== undefined) {
      setCategory(personalTransaction.categoryId);
    }
  }, [mode, personalTransaction]);

  /* Amount */
  useEffect(() => {
    if (mode === "edit" && personalTransaction !== undefined) {
      setAmount(personalTransaction.amount);
      setAmountString(personalTransaction.amount.toString());
    }
  }, [mode, personalTransaction]);

  // Handle amount input change
  const handleAmountInputChange = (valueAsString: string) => {
    // If the input is empty, set the amount to 0
    if (valueAsString.trim() === "") {
      setAmountString("0");
      setAmount(0);
    }
    // If the input is a valid number, update the amount
    if (/^\d*\.?\d*$/.test(valueAsString)) {
      // Only allow digits and a single decimal point
      setAmountString(valueAsString);
      let numericValue = parseFloat(valueAsString);
      if (!isNaN(numericValue)) {
        numericValue = parseFloat(numericValue.toFixed(2));
        setAmount(numericValue);
      }
    }
  };

  // Set the precision of the amount value to two decimal places.
  const handleAmountInputBlur = () => {
    let numericValue = parseFloat(amountString) || 0;
    numericValue = parseFloat(numericValue.toFixed(2));
    setAmountString(numericValue.toString());
    setAmount(numericValue);
  };

  /* Note */
  // initialize note in edit mode
  useEffect(() => {
    if (mode === "edit" && personalTransaction !== undefined) {
      setNote(personalTransaction.note);
    }
  }, [mode, personalTransaction]);

  const { mutate: createPersonalTransactionMutation, isPending } = useMutation({
    mutationFn: () =>
      createPersonalTransaction(userId, title, date, category, amount, note),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["personalTransactions", userId],
      });
      setTitle("");
      setDate(new Date());
      setCategory("");
      setAmountString("0");
      setAmount(0);
      setNote("");
      toast({
        title: "Transaction created successfully",
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

  const { mutate: editPersonalTransactionMutation, isPending: isEditPending } =
    useMutation({
      mutationFn: () => {
        if (!transactionId) {
          throw new Error("Transaction ID is required");
        }
        return editPersonalTransaction(
          transactionId,
          userId,
          title,
          date,
          category,
          amount,
          note
        );
      },
      mutationKey: ["transaction", transactionId],
      onSuccess: () => {
        if (transactionId) {
          queryClient.invalidateQueries({
            queryKey: ["transaction", transactionId],
          });
          queryClient.invalidateQueries({
            queryKey: ["personalTransactions", userId],
          });
        }

        setTitle("");
        setDate(new Date());
        setCategory("");
        setAmountString("0");
        setAmount(0);
        setNote("");
        toast({
          title: "Transaction edited successfully",
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
      setTitle("");
      setDate(new Date());
      setCategory("");
      setAmountString("0");
      setAmount(0);
      setNote("");
    }
    onClose();
  };

  const handleAdd = () => {
    let hasErrors = false;

    if (!title || title.trim() === "") {
      hasErrors = true;
      toast({
        title: "Title is required",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    if (category === "") {
      hasErrors = true;
      toast({
        title: "Category is required",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    if (amount <= 0) {
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
        editPersonalTransactionMutation();
        onClose();
        return;
      } else if (mode == "create") {
        createPersonalTransactionMutation();
        onClose();
        return;
      }
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onModelClose}
        blockScrollOnMount={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent w="90%" maxW="700px">
          <FormHeader
            title="Add an expense"
            onClose={onModelClose}
            onSave={handleAdd}
          />
          <ModalBody>
            <Flex mt="30px" justifyContent="center" alignItems="center">
              <Box>
                <Input
                  placeholder="Title"
                  fontSize={24}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Box>
            </Flex>
            <Flex mt="20px" alignItems="center">
              <Box w="30px">
                <MdDateRange size={24} />
              </Box>
              <Box w="140px">
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  Date
                </Text>
              </Box>
              <Box>
                <SingleDatepicker
                  name="date-input"
                  date={date}
                  onDateChange={setDate}
                />
              </Box>
            </Flex>
            <Flex mt="20px" alignItems="center">
              <Box w="30px">
                <MdCategory size={24} />
              </Box>
              <Box w="140px">
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  Category
                </Text>
              </Box>
              <Box>
                <Select
                  placeholder="Select category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  width={180}
                >
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Box>
            </Flex>
            <Flex mt="20px" alignItems="center">
              <Box w="30px">
                <MdAttachMoney size={24} />
              </Box>
              <Box w="140px">
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  Amount
                </Text>
              </Box>
              <Box>
                <NumberInput
                  defaultValue={0}
                  min={0}
                  precision={2}
                  onChange={handleAmountInputChange}
                  onBlur={handleAmountInputBlur}
                  value={amountString}
                  width={150}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </Flex>
            <Box w="140px"></Box>
            <Flex mt="30px" alignItems="center">
              <Box w="30px">
                <GoNote size={24} />
              </Box>
              <Box w="140px">
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  Note
                </Text>
              </Box>
              <Box>
                <Textarea
                  placeholder="Note"
                  height={50}
                  width={["100%", "100%", "440px"]}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Box>
            </Flex>
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
