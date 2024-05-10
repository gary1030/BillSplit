"use client";

import {
  Box,
  Flex,
  Input,
  Text,
  Textarea,
  Select,
  Switch,
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";

import { use, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { MdDateRange } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import { MdCategory } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { GoNote } from "react-icons/go";

import { SingleDatepicker } from "chakra-dayzed-datepicker";

import FormHeader from "./formHeader";
import Loading from "./loading";

import fetchCategories from "@/actions/fetchCategories";
import createGroupTransaction from "@/actions/group/createGroupTransaction";
import editGroupTransaction from "@/actions/group/editGroupTransaction";
import fetchGroupSingleTransaction from "@/actions/group/fetchGroupTransaction";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { group } from "console";

interface User {
  id: string;
  email: string;
  username: string;
}

interface Payer {
  payerId: string;
  amount: number;
}

interface Sharer {
  sharerId: string;
  amount: number;
}

interface SharerCheckBoxStates {
  [key: string]: boolean;
}

interface SharerAmounts {
  [key: string]: number;
}

interface PayerCheckBoxStates {
  [key: string]: boolean;
}

interface PayerAmounts {
  [key: string]: number;
}

interface Category {
  id: string;
  name: string;
}

interface GroupTransactionFormProps {
  mode: "create" | "edit";
  onClose: () => void;
  isOpen: boolean;
  name: string;
  members: Array<User>;
  groupId: string;
  transactionId?: string;
}

export default function EditGroupTransactionForm({
  onClose,
  isOpen,
  name,
  mode,
  members,
  groupId,
  transactionId,
}: GroupTransactionFormProps) {
  /* Transaction Data */
  let groupTransaction = undefined;
  if (mode === "edit" && transactionId !== undefined) {
    const { data: transactionData, error: transactionError } = useQuery({
      queryKey: ["transaction"],
      queryFn: () => fetchGroupSingleTransaction(groupId, transactionId),
      staleTime: Infinity,
    });
    if (transactionData !== undefined) {
      groupTransaction = transactionData.data;
    }
  }

  const [cookies, setCookie] = useCookies(["name"]);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("");

  const [amountString, setAmountString] = useState("0");
  const [amount, setAmount] = useState(0);

  const [payerCustomizeSwitchOn, setPayerCustomizeSwitchOn] = useState(false);
  const [payerCheckBoxStates, setPayerCheckBoxStates] =
    useState<PayerCheckBoxStates>({});
  const [payerNumber, setPayerNumber] = useState(0);
  const [payerAmountStrings, setPayerAmountStrings] = useState<{
    [id: string]: string;
  }>({});
  const [payerAmounts, setPayerAmounts] = useState<{ [id: string]: number }>(
    {}
  );
  const [totalPayerAmount, setTotalPayerAmount] = useState(0);

  const [sharerCustomizeSwitchOn, setSharerCustomizeSwitchOn] = useState(false);
  const [sharerCheckBoxStates, setSharerCheckBoxStates] =
    useState<SharerCheckBoxStates>({});
  const [sharerNumber, setSharerNumber] = useState(0);
  const [sharerAmountStrings, setSharerAmountStrings] = useState<{
    [id: string]: string;
  }>({});
  const [sharerAmounts, setSharerAmounts] = useState<{ [id: string]: number }>(
    {}
  );
  const [totalSharerAmount, setTotalSharerAmount] = useState(0);
  const [note, setNote] = useState("");

  const toast = useToast();

  /* Title */
  // initialize title in edit mode
  useEffect(() => {
    if (mode === "edit" && groupTransaction !== undefined) {
      setTitle(groupTransaction.title);
    }
  }, [mode, groupTransaction]);

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
  categoryData?.data.forEach((item: Category) => {
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
    if (mode === "edit" && groupTransaction !== undefined) {
      setCategory(groupTransaction.categoryId);
    }
  }, [mode, groupTransaction]);

  /* Amount */
  // Handle amount input change
  useEffect(() => {
    if (mode === "edit" && groupTransaction !== undefined) {
      setAmount(groupTransaction.totalAmount);
      setAmountString(groupTransaction.totalAmount.toString());
    }
  }, [mode, groupTransaction]);

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

  /* Switch */
  // initialize customize switches in edit mode
  useEffect(() => {
    if (mode === "edit") {
      setPayerCustomizeSwitchOn(true);
      setSharerCustomizeSwitchOn(true);
    }
  }, [mode]);

  /* Payer */
  // initialize payer total amount in edit mode
  useEffect(() => {
    if (mode === "edit" && groupTransaction !== undefined) {
      let totalAmount = 0;
      groupTransaction.payerDetails.forEach((payer: Payer) => {
        totalAmount += payer.amount;
      });
      setTotalPayerAmount(totalAmount);
    }
  }, [mode, groupTransaction]);

  // initialize payerCheckBoxStates
  useEffect(() => {
    // set the payer checkbox states to unchecked for all members
    const initialState: PayerCheckBoxStates = {};
    members.forEach((member) => {
      initialState[member.id] = false;
    });
    // create mode: set the payer checkbox state to checked for the current user
    if (mode === "create") {
      initialState[(cookies as any).userId] = true;
    }
    setPayerCheckBoxStates(initialState);

    // edit mode
    if (mode === "edit" && groupTransaction !== undefined) {
      groupTransaction.payerDetails.forEach((payer: Payer) => {
        if (payer.amount > 0) {
          // set the payer checkbox states to checked for the payers with positive amounts
          setPayerCheckBoxStates((prev) => ({
            ...prev,
            [payer.payerId]: true,
          }));
          // set the payer amount strings to the amounts of the payers with positive amounts
          setPayerAmountStrings((prev) => ({
            ...prev,
            [payer.payerId]: payer.amount.toString(),
          }));
          // set the payer amounts to the amounts of the payers with positive amounts
          setPayerAmounts((prev) => ({
            ...prev,
            [payer.payerId]: payer.amount,
          }));
        }
      });
    }
  }, [members, mode]);

  // Handle amount changes
  const handlePayerAmountInputChange = (id: string, valueAsString: string) => {
    // If the input is empty, set the amount to 0
    if (valueAsString.trim() === "") {
      setPayerAmountStrings((prev) => ({ ...prev, [id]: "0" }));
      setPayerAmounts((prev) => ({ ...prev, [id]: 0 }));
      updateTotalPayerAmount({ ...payerAmounts, [id]: 0 });
      return;
    }

    // If the input is a valid number, update the amount
    if (/^\d*\.?\d*$/.test(valueAsString)) {
      // Only allow digits and a single decimal point
      setPayerAmountStrings((prev) => ({ ...prev, [id]: valueAsString }));
      let numericValue = parseFloat(valueAsString);
      if (!isNaN(numericValue)) {
        numericValue = parseFloat(numericValue.toFixed(2));
        setPayerAmounts((prev) => ({ ...prev, [id]: numericValue }));
        updateTotalPayerAmount({ ...payerAmounts, [id]: numericValue });
      }
    }
  };

  const updateTotalPayerAmount = (newPayerAmounts: PayerAmounts) => {
    const newTotalAmount = Object.values(newPayerAmounts).reduce(
      (sum, amount) => sum + amount,
      0
    );
    setTotalPayerAmount(newTotalAmount);
  };

  // Handle checkbox change
  const handlePayerCheckboxChange = (id: string, isChecked: boolean) => {
    // Update the checkbox states
    setPayerCheckBoxStates((prev) => {
      const newStates = { ...prev, [id]: isChecked };
      return newStates;
    });

    // Adjust the payer amounts based on whether the checkbox is checked or not
    setPayerAmounts((prev) => {
      const updatedAmounts = {
        ...prev,
        [id]: isChecked ? prev[id] || 0 : 0, // Set to 0 if unchecked
      };

      // Calculate the new total payer amount
      const newTotalPayerAmount = Object.values(updatedAmounts).reduce(
        (sum, amount) => sum + amount,
        0
      );
      setTotalPayerAmount(newTotalPayerAmount);

      return updatedAmounts;
    });
  };

  // Update the payer number when the checkbox states change
  useEffect(() => {
    const newPayerNumber = Object.values(payerCheckBoxStates).filter(
      (isChecked) => isChecked
    ).length;
    setPayerNumber(newPayerNumber);
  }, [payerCheckBoxStates]);

  // Auto-distribute the amount among the checked payers if customization is off
  useEffect(() => {
    if (!payerCustomizeSwitchOn) {
      // Filter out the checked members
      const checkedMembers: User[] = members.filter(
        (member) => payerCheckBoxStates[member.id]
      );
      // Calculate the average amount per checked member
      const averageAmount: number =
        checkedMembers.length > 0
          ? parseFloat((amount / checkedMembers.length).toFixed(2))
          : 0;
      const formattedAverageAmount: string = averageAmount.toFixed(2);

      // Update the sharer amounts
      const newPayerAmounts: PayerAmounts = {};
      const newPayerAmountStrings: { [key: string]: string } = {};

      members.forEach((member) => {
        const amountForMember = payerCheckBoxStates[member.id]
          ? averageAmount
          : 0;
        newPayerAmounts[member.id] = amountForMember;
        newPayerAmountStrings[member.id] = payerCheckBoxStates[member.id]
          ? formattedAverageAmount
          : "0";
      });

      setPayerAmounts(newPayerAmounts);
      setPayerAmountStrings(newPayerAmountStrings);

      const newTotalPayerAmount: number = Object.values(newPayerAmounts).reduce(
        (sum, amount) => sum + amount,
        0
      );
      setTotalPayerAmount(newTotalPayerAmount);
    }
  }, [amount, payerCheckBoxStates, payerCustomizeSwitchOn, members]);

  /* Sharer */
  // initialize sharer total amount in edit mode
  useEffect(() => {
    if (mode === "edit" && groupTransaction !== undefined) {
      let totalAmount = 0;
      groupTransaction.splitDetails.forEach((sharer: Sharer) => {
        totalAmount += sharer.amount;
      });
      setTotalSharerAmount(totalAmount);
    }
  }, [mode, groupTransaction]);

  // initialize sharerCheckBoxStates
  useEffect(() => {
    // set the sharer checkbox states to checked for all members
    const initialState: SharerCheckBoxStates = {};
    members.forEach((member) => {
      initialState[member.id] = true;
    });
    setSharerCheckBoxStates(initialState);

    // edit mode
    if (mode === "edit" && groupTransaction !== undefined) {
      groupTransaction.splitDetails.forEach((sharer: Sharer) => {
        if (sharer.amount > 0) {
          // set the sharer amount strings to the amounts of the sharers with positive amounts
          setSharerAmountStrings((prev) => ({
            ...prev,
            [sharer.sharerId]: sharer.amount.toString(),
          }));
          // set the sharer amounts to the amounts of the sharers with positive amounts
          setSharerAmounts((prev) => ({
            ...prev,
            [sharer.sharerId]: sharer.amount,
          }));
        }
      });
    }
  }, [members, mode]);

  // Handle amount changes when the customize switch is on
  const handleSharerAmountInputChange = (id: string, valueAsString: string) => {
    // If the input is empty, set the amount to 0
    if (valueAsString.trim() === "") {
      setSharerAmountStrings((prev) => ({ ...prev, [id]: "0" }));
      setSharerAmounts((prev) => ({ ...prev, [id]: 0 }));
      updateTotalSharerAmount({ ...sharerAmounts, [id]: 0 });
      return;
    }

    // If the input is a valid number, update the amount
    if (/^\d*\.?\d*$/.test(valueAsString)) {
      // Only allow digits and a single decimal point
      setSharerAmountStrings((prev) => ({ ...prev, [id]: valueAsString }));
      let numericValue = parseFloat(valueAsString);
      if (!isNaN(numericValue)) {
        numericValue = parseFloat(numericValue.toFixed(2));
        setSharerAmounts((prev) => ({ ...prev, [id]: numericValue }));
        updateTotalSharerAmount({ ...sharerAmounts, [id]: numericValue });
      }
    }
  };

  const updateTotalSharerAmount = (newSharerAmounts: SharerAmounts) => {
    const newTotalAmount = Object.values(newSharerAmounts).reduce(
      (sum, amount) => sum + amount,
      0
    );
    setTotalSharerAmount(newTotalAmount);
  };

  // Handle checkbox change
  const handleSharerCheckboxChange = (id: string, isChecked: boolean) => {
    // Update the checkbox states
    setSharerCheckBoxStates((prev) => {
      const newStates = { ...prev, [id]: isChecked };
      return newStates;
    });

    // Adjust the sharer amounts based on whether the checkbox is checked or not
    setSharerAmounts((prev) => {
      const updatedAmounts = {
        ...prev,
        [id]: isChecked ? prev[id] || 0 : 0, // Set to 0 if unchecked
      };

      // Calculate the new total sharer amount
      const newTotalSharerAmount = Object.values(updatedAmounts).reduce(
        (sum, amount) => sum + amount,
        0
      );
      setTotalSharerAmount(newTotalSharerAmount);

      return updatedAmounts;
    });
  };

  // Update the sharer number when the checkbox states change
  useEffect(() => {
    const newSharerNumber = Object.values(sharerCheckBoxStates).filter(
      (isChecked) => isChecked
    ).length;
    setSharerNumber(newSharerNumber);
  }, [sharerCheckBoxStates]);

  // Auto-distribute the amount among the checked sharers if customization is off
  useEffect(() => {
    if (!sharerCustomizeSwitchOn) {
      // Filter out the checked members
      const checkedMembers: User[] = members.filter(
        (member) => sharerCheckBoxStates[member.id]
      );
      // Calculate the average amount per checked member
      const averageAmount: number =
        checkedMembers.length > 0
          ? parseFloat((amount / checkedMembers.length).toFixed(2))
          : 0;
      const formattedAverageAmount: string = averageAmount.toFixed(2);

      // Update the sharer amounts
      const newSharerAmounts: SharerAmounts = {};
      const newSharerAmountStrings: { [key: string]: string } = {};

      members.forEach((member) => {
        const amountForMember = sharerCheckBoxStates[member.id]
          ? averageAmount
          : 0;
        newSharerAmounts[member.id] = amountForMember;
        newSharerAmountStrings[member.id] = sharerCheckBoxStates[member.id]
          ? formattedAverageAmount
          : "0";
      });

      setSharerAmounts(newSharerAmounts);
      setSharerAmountStrings(newSharerAmountStrings);

      const newTotalSharerAmount: number = Object.values(
        newSharerAmounts
      ).reduce((sum, amount) => sum + amount, 0);
      setTotalSharerAmount(newTotalSharerAmount);
    }
  }, [amount, sharerCheckBoxStates, sharerCustomizeSwitchOn, members]);

  /* Note */
  // initialize note in edit mode
  useEffect(() => {
    if (mode === "edit" && groupTransaction !== undefined) {
      setNote(groupTransaction.note);
    }
  }, [mode, groupTransaction]);

  const { mutate: createGroupTransactionMutation, isPending } = useMutation({
    mutationFn: () =>
      createGroupTransaction(
        title,
        groupId,
        date,
        category,
        amount,
        Object.entries(payerAmounts).map(([payerId, amount]) => ({
          payerId,
          amount,
        })),
        Object.entries(sharerAmounts).map(([sharerId, amount]) => ({
          sharerId,
          amount,
        })),
        note
      ),
    onSuccess: () => {
      setTitle("");
      setDate(new Date());
      setCategory("");
      setAmountString("0");
      setAmount(0);
      setPayerCustomizeSwitchOn(false);
      const initialPayerStates: PayerCheckBoxStates = {};
      members.forEach((member) => {
        initialPayerStates[member.id] = false;
      });
      initialPayerStates[(cookies as any).userId] = true;
      setPayerCheckBoxStates(initialPayerStates);
      setPayerAmountStrings({});
      setPayerAmounts({});
      setTotalPayerAmount(0);
      setSharerCustomizeSwitchOn(false);
      const initialSharerStates: SharerCheckBoxStates = {};
      members.forEach((member) => {
        initialSharerStates[member.id] = true;
      });
      setSharerCheckBoxStates(initialSharerStates);
      setSharerAmountStrings({});
      setSharerAmounts({});
      setTotalSharerAmount(0);
      setNote("");
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

  const { mutate: editGroupTransactionMutation, isPending: isEditPending } =
    useMutation({
      mutationFn: () => {
        if (!transactionId) {
          throw new Error("Transaction ID is required");
        }
        return editGroupTransaction(
          transactionId,
          title,
          groupId,
          date,
          category,
          amount,
          Object.entries(payerAmounts).map(([payerId, amount]) => ({
            payerId,
            amount,
          })),
          Object.entries(sharerAmounts).map(([sharerId, amount]) => ({
            sharerId,
            amount,
          })),
          note
        );
      },
      onSuccess: () => {
        setTitle("");
        setDate(new Date());
        setCategory("");
        setAmountString("0");
        setAmount(0);
        setPayerCustomizeSwitchOn(false);
        const initialPayerStates: PayerCheckBoxStates = {};
        members.forEach((member) => {
          initialPayerStates[member.id] = false;
        });
        initialPayerStates[(cookies as any).userId] = true;
        setPayerCheckBoxStates(initialPayerStates);
        setPayerAmountStrings({});
        setPayerAmounts({});
        setTotalPayerAmount(0);
        setSharerCustomizeSwitchOn(false);
        const initialSharerStates: SharerCheckBoxStates = {};
        members.forEach((member) => {
          initialSharerStates[member.id] = true;
        });
        setSharerCheckBoxStates(initialSharerStates);
        setSharerAmountStrings({});
        setSharerAmounts({});
        setTotalSharerAmount(0);
        setNote("");
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
      setPayerCustomizeSwitchOn(false);
      const initialPayerStates: PayerCheckBoxStates = {};
      members.forEach((member) => {
        initialPayerStates[member.id] = false;
      });
      initialPayerStates[(cookies as any).userId] = true;
      setPayerCheckBoxStates(initialPayerStates);
      setPayerAmountStrings({});
      setPayerAmounts({});
      setTotalPayerAmount(0);
      setSharerCustomizeSwitchOn(false);
      const initialSharerStates: SharerCheckBoxStates = {};
      members.forEach((member) => {
        initialSharerStates[member.id] = true;
      });
      setSharerCheckBoxStates(initialSharerStates);
      setSharerAmountStrings({});
      setSharerAmounts({});
      setTotalSharerAmount(0);
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
    if (totalPayerAmount != amount) {
      hasErrors = true;
      toast({
        title: `The total payer amount should be equal to Amount`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    if (totalSharerAmount != amount) {
      hasErrors = true;
      toast({
        title: `The total sharer amount should be equal to Amount`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    if (Object.values(payerCheckBoxStates).every((isChecked) => !isChecked)) {
      hasErrors = true;
      toast({
        title: "Payer should be selected",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    if (Object.values(sharerCheckBoxStates).every((isChecked) => !isChecked)) {
      hasErrors = true;
      toast({
        title: "Sharer should be selected",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    if (!hasErrors) {
      if (mode === "edit") {
        editGroupTransactionMutation();
        onClose();
        return;
      } else if (mode == "create") {
        createGroupTransactionMutation();
        onClose();
        return;
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onModelClose}>
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
                  fontSize={30}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Box>
            </Flex>
            <Flex mt="30px" alignItems="center">
              <Box w="30px">
                <HiUserGroup size={24} />
              </Box>
              <Box w="140px">
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  Group
                </Text>
              </Box>
              <Box>
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  {name}
                </Text>
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
                  width={180}
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
            <Flex mt="40px" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Box w="30px">
                  <IoPerson size={24} />
                </Box>
                <Box w="140px">
                  <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                    Paid by
                  </Text>
                </Box>
                <Box display="flex" alignItems="center" marginLeft={260}>
                  <Switch
                    colorScheme="blue"
                    size="md"
                    isChecked={payerCustomizeSwitchOn}
                    onChange={(e) =>
                      setPayerCustomizeSwitchOn(e.target.checked)
                    }
                  />
                  <Text
                    fontSize="sm"
                    as="b"
                    noOfLines={1}
                    pl="10px"
                    pr="5px"
                    color={payerCustomizeSwitchOn ? "black" : "lightgray"}
                  >
                    Customize
                  </Text>
                </Box>
              </Box>
            </Flex>
            <Flex>
              <Box mt="15px" marginLeft={178}>
                {members.map((member) => (
                  <Flex key={member.id} alignItems="center" w="full" mt="2">
                    <Checkbox
                      size="md"
                      colorScheme="blue"
                      isChecked={payerCheckBoxStates[member.id]}
                      onChange={(e) =>
                        handlePayerCheckboxChange(member.id, e.target.checked)
                      }
                    />
                    <Text
                      fontSize="md"
                      as="b"
                      noOfLines={1}
                      pl="10px"
                      pr="5px"
                      flexGrow={1}
                      color={
                        payerCheckBoxStates[member.id] ? "black" : "lightgray"
                      }
                    >
                      {member.username}
                    </Text>
                    <Box marginLeft={160}>
                      <NumberInput
                        maxW="150px"
                        defaultValue={0}
                        min={0}
                        precision={2}
                        value={payerAmountStrings[member.id] || "0"}
                        onChange={(valueAsString) =>
                          handlePayerAmountInputChange(member.id, valueAsString)
                        }
                        isDisabled={
                          !payerCheckBoxStates[member.id] ||
                          !payerCustomizeSwitchOn
                        }
                        sx={{
                          "input:disabled": {
                            opacity:
                              !payerCustomizeSwitchOn &&
                              payerCheckBoxStates[member.id]
                                ? 1
                                : undefined,
                          },
                        }}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Box>
                  </Flex>
                ))}
              </Box>
            </Flex>
            <Flex>
              <Box mt="15px" marginLeft={163}>
                <Text
                  fontSize="sm"
                  as="b"
                  noOfLines={1}
                  pl="10px"
                  pr="5px"
                  color="red"
                >
                  {(!payerCustomizeSwitchOn && payerNumber) ||
                  totalPayerAmount === amount
                    ? ""
                    : `Total payer amount ($${totalPayerAmount}) is not equal to $${amount}`}
                </Text>
              </Box>
            </Flex>
            <Flex mt="40px" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Box w="30px">
                  <IoPerson size={24} />
                </Box>
                <Box w="140px">
                  <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                    For whom
                  </Text>
                </Box>
                <Box display="flex" alignItems="center" marginLeft={260}>
                  <Switch
                    colorScheme="blue"
                    size="md"
                    isChecked={sharerCustomizeSwitchOn}
                    onChange={(e) =>
                      setSharerCustomizeSwitchOn(e.target.checked)
                    }
                  />
                  <Text
                    fontSize="sm"
                    as="b"
                    noOfLines={1}
                    pl="10px"
                    pr="5px"
                    color={sharerCustomizeSwitchOn ? "black" : "lightgray"}
                  >
                    Customize
                  </Text>
                </Box>
              </Box>
            </Flex>
            <Flex>
              <Box mt="15px" marginLeft={178}>
                {members.map((member) => (
                  <Flex key={member.id} alignItems="center" w="full" mt="2">
                    <Checkbox
                      size="md"
                      colorScheme="blue"
                      isChecked={sharerCheckBoxStates[member.id]}
                      onChange={(e) =>
                        handleSharerCheckboxChange(member.id, e.target.checked)
                      }
                    />
                    <Text
                      fontSize="md"
                      as="b"
                      noOfLines={1}
                      pl="10px"
                      pr="5px"
                      flexGrow={1}
                      color={
                        sharerCheckBoxStates[member.id] ? "black" : "lightgray"
                      }
                    >
                      {member.username}
                    </Text>
                    <Box marginLeft={160}>
                      <NumberInput
                        maxW="150px"
                        defaultValue={0}
                        min={0}
                        precision={2}
                        value={sharerAmountStrings[member.id] || "0"}
                        onChange={(valueAsString) =>
                          handleSharerAmountInputChange(
                            member.id,
                            valueAsString
                          )
                        }
                        isDisabled={
                          !sharerCheckBoxStates[member.id] ||
                          !sharerCustomizeSwitchOn
                        }
                        sx={{
                          "input:disabled": {
                            opacity:
                              !sharerCustomizeSwitchOn &&
                              sharerCheckBoxStates[member.id]
                                ? 1
                                : undefined,
                          },
                        }}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Box>
                  </Flex>
                ))}
              </Box>
            </Flex>
            <Flex>
              <Box mt="15px" marginLeft={163}>
                <Text
                  fontSize="sm"
                  as="b"
                  noOfLines={1}
                  pl="10px"
                  pr="5px"
                  color="red"
                >
                  {(!sharerCustomizeSwitchOn && sharerNumber) ||
                  totalSharerAmount === amount
                    ? ""
                    : `Total sharer amount ($${totalSharerAmount}) is not equal to $${amount}`}
                </Text>
              </Box>
            </Flex>
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
                  width={440}
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
