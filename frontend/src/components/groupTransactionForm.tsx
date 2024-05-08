"use client";

import {
  Box,
  Flex,
  Input,
  Textarea,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  SimpleGrid,
  Text,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Switch,
  Checkbox,
  CheckboxGroup,
  IconButton,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { MdDateRange } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import { MdCategory } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";
import { HiPlusCircle } from "react-icons/hi";
import { IoPerson } from "react-icons/io5";
import { GoNote } from "react-icons/go";
import { BsFillTrashFill } from "react-icons/bs";

import { SingleDatepicker } from "chakra-dayzed-datepicker";

import FormHeader from "./formHeader";
import Loading from "./loading";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  username: string;
}

interface CheckboxStates {
  [key: string]: boolean;
}

interface AmountStates {
  [key: string]: number;
}

// interface Amounts {
//   [key: string]: number;
// }

interface GroupTransactionFormProps {
  // mode: "create" | "edit";
  onClose: () => void;
  isOpen: boolean;
  defaultTitle?: string;
  // defaultGroupName?: string;
  // defaultTheme?: string;
  name: string;
  members: Array<User>;
}

// const imagePaths = [
//   "images/food.jpg",
//   "images/mountain.jpg",
//   "images/party.jpg",
//   "images/tokyo.jpg",
// ];

const BOX_WIDTH = 200;
const BOX_HEIGHT = 50;

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export default function GroupTransactionForm({
  onClose,
  isOpen,
  // mode,
  defaultTitle,
  // defaultGroupName,
  // defaultTheme,
  name,
  members,
}: GroupTransactionFormProps) {
  // const [groupName, setGroupName] = useState(defaultGroupName || "");
  const [title, setTitle] = useState(defaultTitle || "");
  // const [selectedTheme, setSelectedTheme] = useState(
  //   defaultTheme || imagePaths[0]
  // );
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState(options[0].value);
  const [amount, setAmount] = useState(0);

  const [payerSelects, setPayerSelects] = useState([{ id: "", amount: 0 }]);
  const [payerAmounts, setPayerAmounts] = useState<{ [id: string]: number }>(
    {}
  );
  const [totalPayerAmount, setTotalPayerAmount] = useState(0);

  const [customizeSwitchOn, setCustomizeSwitchOn] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState<CheckboxStates>({});
  const [sharerAmounts, setSharerAmounts] = useState<{ [id: string]: number }>(
    {}
  );
  const [totalSharerAmount, setTotalSharerAmount] = useState(0);
  const [note, setNote] = useState("");

  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const initialPayerAmounts: { [id: string]: number } = {};
    // const initialSharerAmounts: { [id: string]: number } = {};
    members.forEach((member) => {
      initialPayerAmounts[member.id] = 0;
      // initialSharerAmounts[member.id] = 0;
    });
    setPayerAmounts(initialPayerAmounts);
    // setSharerAmounts(initialSharerAmounts);
  }, [members]);

  useEffect(() => {
    const initialState: CheckboxStates = {};
    members.forEach((member) => {
      initialState[member.id] = true;
    });
    setCheckboxStates(initialState);
  }, [members]);

  // useEffect(() => {
  //   const checkedCount = Object.values(checkboxStates).filter(Boolean).length;
  //   const averageAmount = checkedCount > 0 ? amount / checkedCount : 0;

  //   if (customizeSwitchOn) {
  //     const newAmounts = members.reduce((acc, member) => {
  //       acc[member.id] = checkboxStates[member.id] ? averageAmount : 0;
  //       return acc;
  //     }, {} as AmountStates); // Ensure the initial object is of type AmountStates
  //     setSharerAmounts(newAmounts);
  //   }
  // }, [amount, checkboxStates, customizeSwitchOn, members]);

  // useEffect(() => {
  //   if (customizeSwitchOn) {
  //     const checkedCount = Object.values(checkboxStates).filter(Boolean).length;
  //     const averageAmount = checkedCount > 0 ? amount / checkedCount : 0;

  //     const newAmounts = members.reduce((acc, member) => {
  //       // 只有當 checkbox 被勾選時才設置平均數
  //       if (checkboxStates[member.id]) {
  //         acc[member.id] = averageAmount;
  //       }
  //       return acc;
  //     }, {} as AmountStates);
  //     setSharerAmounts(newAmounts);
  //   }
  //   // 只在 customizeSwitchOn 變為 true 時觸發，或者相關依賴發生變化時（不包括手動更改數值）
  // }, [amount, checkboxStates, customizeSwitchOn, members]);

  useEffect(() => {
    // Only auto-distribute if customization is off
    if (!customizeSwitchOn) {
      const checkedMembers: User[] = members.filter(
        (member) => checkboxStates[member.id]
      );
      const averageAmount: number =
        checkedMembers.length > 0 ? amount / checkedMembers.length : 0;

      const newSharerAmounts: AmountStates = members.reduce<AmountStates>(
        (acc, member) => {
          acc[member.id] = checkboxStates[member.id] ? averageAmount : 0;
          return acc;
        },
        {}
      );

      setSharerAmounts(newSharerAmounts);
      const newTotalSharerAmount: number = Object.values(
        newSharerAmounts
      ).reduce((sum, amount) => sum + amount, 0);
      setTotalSharerAmount(newTotalSharerAmount);
      console.log(
        `Updated sharer amounts based on new total amount: ${amount}`
      );
    }
  }, [amount, checkboxStates, customizeSwitchOn, members]);

  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["group", groupId],
  //   queryFn: () => fetchGroup(groupId),
  // });

  // const { data: membersData, error: memberError } = useQuery({
  //   queryKey: ["groupMembers", data?.memberIds || []],
  //   queryFn: () => fetchUserBatch(data.memberIds || []),
  // });
  // const { mutate: editGroupMutation, isPending: isEditPending } = useMutation({
  // mutationFn: () => {
  //   if (!groupId) {
  //     throw new Error("Group ID is required for editing");
  //   }
  //   return editGroup(groupId, name, selectedTheme);
  // },
  // mutationKey: ["group", groupId],
  // onSuccess: () => {
  //   if (groupId) {
  //     queryClient.invalidateQueries({
  //       queryKey: ["group", groupId],
  //     });
  //   }
  //   onClose();
  // },
  //   onError: () => {
  //     toast({
  //       title: "An error occurred",
  //       status: "error",
  //       duration: 2000,
  //       isClosable: true,
  //     });
  //   },
  // });

  // const { mutate: createGroupMutation, isPending } = useMutation({
  //   mutationFn: () => createGroup(name, selectedTheme),
  //   onSuccess: (newGroup) => {
  //     setGroupName("");
  //     router.push(`/group/${newGroup.id}/management`);
  //     onClose();
  //   },
  //   onError: () => {
  //     toast({
  //       title: "An error occurred",
  //       status: "error",
  //       duration: 2000,
  //       isClosable: true,
  //     });
  //   },
  // });

  const handleAmountChange = (valueAsString: string, valueAsNumber: number) => {
    console.log("Amount changed to:", valueAsNumber);
    if (isNaN(valueAsNumber)) {
      setAmount(0);
    } else {
      setAmount(valueAsNumber);
    }
  };
  // Function to handle payer amount changes
  const handlePayerAmountChange = (
    index: number,
    valueAsString: string,
    valueAsNumber: number
  ) => {
    // Check if the number is NaN and set it to 0
    const validAmount = isNaN(valueAsNumber) ? 0 : valueAsNumber;

    console.log(
      `Payer amount changed for ID ${payerSelects[index].id}: ${validAmount}`
    );

    // Update the payer amounts in the payerSelects array
    const newSelects = payerSelects.map((select, idx) => {
      if (idx === index) {
        return { ...select, amount: validAmount };
      }
      return select;
    });

    // Update payerSelects state
    setPayerSelects(newSelects);

    // Recalculate and update total payer amount
    const newTotalAmount = newSelects.reduce(
      (sum, cur) => sum + (cur.amount || 0),
      0
    );
    setTotalPayerAmount(newTotalAmount);
    console.log(`Total of all payer amounts: ${newTotalAmount}`);
  };

  // // Function to handle payer amount changes
  // const handlePayerAmountChange = (index: number, valueAsNumber: number) => {
  //   // Logging the change along with the member's ID
  //   console.log(
  //     `Payer amount changed for ID ${payerSelects[index].id}: ${valueAsNumber}`
  //   );

  //   // Update the payer amounts in the payerSelects array
  //   const newSelects = payerSelects.map((select, idx) => {
  //     if (idx === index) {
  //       return { ...select, amount: valueAsNumber };
  //     }
  //     return select;
  //   });

  //   // Update payerSelects state
  //   setPayerSelects(newSelects);

  //   // Recalculate and update total payer amount
  //   const newTotalAmount = newSelects.reduce(
  //     (sum, cur) => sum + (cur.amount || 0),
  //     0
  //   );
  //   setTotalPayerAmount(newTotalAmount);
  //   console.log(`Total of all payer amounts: ${newTotalAmount}`);
  // };

  const addPayerSelect = () => {
    setPayerSelects([...payerSelects, { id: "", amount: 0 }]);
  };

  // const removePayerSelect = (index: number) => {
  //   setPayerSelects((prevSelects) => prevSelects.filter((_, i) => i !== index));
  // };
  const removePayerSelect = (index: number) => {
    const filteredSelects = payerSelects.filter((_, idx) => idx !== index);
    setPayerSelects(filteredSelects);

    const newTotalAmount = filteredSelects.reduce(
      (sum, cur) => sum + (cur.amount || 0),
      0
    );
    setTotalPayerAmount(newTotalAmount);
    console.log(`Total of all payer amounts: ${newTotalAmount}`);
  };
  const handleCheckboxAndSharerAmountChange = (
    id: string,
    isChecked: boolean,
    valueAsNumber: number = 0
  ) => {
    // Update checkbox states
    setCheckboxStates((prev) => ({
      ...prev,
      [id]: isChecked,
    }));

    // Update the sharer amounts, setting the amount to 0 if checkbox is unchecked
    setSharerAmounts((prev) => {
      const newAmounts = {
        ...prev,
        [id]: isChecked ? valueAsNumber : 0,
      };

      // Calculate new total amount
      const newTotalAmount = Object.values(newAmounts).reduce(
        (sum, amount) => sum + amount,
        0
      );

      // Optionally, you can set total sharer amount state if you need to use it elsewhere in your component
      setTotalSharerAmount(newTotalAmount);

      console.log(`Total of all sharer amounts: ${newTotalAmount}`);

      return newAmounts;
    });
  };

  // // To handle changes in NumberInput
  // const handleSharerAmountChange = (
  //   id: string,
  //   valueAsString: string,
  //   valueAsNumber: number
  // ) => {
  //   // Only update amounts if the checkbox is checked
  //   if (checkboxStates[id]) {
  //     handleCheckboxAndSharerAmountChange(id, true, valueAsNumber);
  //     console.log(`Sharer amount changed for ID ${id}: ${valueAsNumber}`);
  //   }
  // };
  // // Handle changes in NumberInput only if customize switch is ON and allow manual edits
  // const handleSharerAmountChange = (
  //   id: string,
  //   valueAsString: string,
  //   valueAsNumber: number
  // ) => {
  //   // Only allow changes if customizeSwitchOn is OFF to maintain manual edits
  //   if (customizeSwitchOn) {
  //     console.log(`Sharer amount changed for ID ${id}: ${valueAsNumber}`);
  //     setSharerAmounts((prev) => ({
  //       ...prev,
  //       [id]: valueAsNumber,
  //     }));
  //   }
  // };

  const handleSharerAmountChange = (
    id: string,
    valueAsString: string,
    valueAsNumber: number
  ) => {
    // Only allow changes if customizeSwitchOn is OFF to maintain manual edits
    if (customizeSwitchOn) {
      setSharerAmounts((prev) => {
        const newAmounts = { ...prev, [id]: valueAsNumber };
        console.log(`Sharer amount changed for ID ${id}: ${valueAsNumber}`);

        // Calculate the new total amount after the change
        const newTotalAmount = Object.values(newAmounts).reduce(
          (sum, amount) => sum + amount,
          0
        );
        setTotalSharerAmount(newTotalAmount); // Update the state with the new total
        console.log(`New Total Sharer Amount: ${newTotalAmount}`);

        return newAmounts;
      });
    }
  };

  // // To handle changes in Checkbox
  // const handleCheckboxChange = (id: string, isChecked: boolean) => {
  //   // Pass the current amount or 0 if unchecking
  //   const amount = isChecked ? sharerAmounts[id] : 0;
  //   handleCheckboxAndSharerAmountChange(id, isChecked, amount);
  // };
  // const handleCheckboxChange = (id: string, isChecked: boolean) => {
  //   if (!customizeSwitchOn) {
  //     setCheckboxStates((prev) => ({
  //       ...prev,
  //       [id]: isChecked,
  //     }));

  //     setSharerAmounts((prev) => ({
  //       ...prev,
  //       [id]: isChecked ? prev[id] || 0 : 0,
  //     }));
  //   }
  // };
  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    // Update the checkbox states
    setCheckboxStates((prev) => ({
      ...prev,
      [id]: isChecked,
    }));

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
      setTotalSharerAmount(newTotalSharerAmount); // Update the total amount state

      // Log the change if the checkbox is unchecked
      if (!isChecked) {
        console.log(`Amount for ${id} updated to 0 due to uncheck.`);
      }

      return updatedAmounts;
    });
  };

  // const handlePayerAmountChange = (
  //   id: string,
  //   valueAsString: string,
  //   valueAsNumber: number
  // ) => {
  //   setPayerAmounts({
  //     ...payerAmounts,
  //     [id]: valueAsNumber,
  //   });
  // };

  const onModelClose = () => {
    // setName(defaultName || "");
    // setSelectedTheme(defaultTheme || imagePaths[0]);
    onClose();
  };

  const handleAdd = () => {
    // if (!name || name.trim() === "") {
    //   toast({
    //     title: "Name is required",
    //     status: "error",
    //     duration: 2000,
    //     isClosable: true,
    //   });
    onClose();
    return;
  };

  //   createGroupMutation();
  // };

  // useEffect(() => {
  //   setName(defaultName || "");
  //   setSelectedTheme(defaultTheme || imagePaths[0]);
  // }, [defaultName, defaultTheme]);

  return (
    <>
      {/* <Modal isOpen={isOpen} onClose={onModelClose}> */}
      <Modal isOpen={isOpen} onClose={onModelClose}>
        <ModalOverlay />
        <ModalContent w="90%" maxW="800px">
          <FormHeader
            title="Add an expense"
            onClose={onModelClose}
            onSave={handleAdd}
          />
          {/* {mode === "edit" ? (
            <FormHeader
              title="Expense"
              onClose={onModelClose}
              onSave={editGroupMutation}
            />
          ) : (
            <FormHeader
              title="Add an expense"
              onClose={onModelClose}
              onSave={handleAdd}
            />
          )} */}
          <ModalBody>
            <Flex mt="10px" justifyContent="center" alignItems="center">
              <Box>
                <Input
                  placeholder="Title"
                  fontSize={30}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Box>
            </Flex>
            <Flex mt="20px" alignItems="center">
              <Box w="30px">
                <HiUserGroup size={24} />
              </Box>
              <Box w="140px">
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  Group
                </Text>
              </Box>
              <Box>
                {/* <Input
                  placeholder="Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                /> */}
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
                  width={BOX_WIDTH}
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
                  onChange={handleAmountChange}
                  value={amount}
                  width={BOX_WIDTH}
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
            <Flex mt="20px">
              <Box w="30px">
                <IoPerson size={24} />
              </Box>
              <Box w="140px">
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  Paid by
                </Text>
              </Box>
            </Flex>

            <Flex alignItems="center">
              <Box marginLeft={190}>
                {payerSelects.map((select, index) => (
                  <Flex
                    key={index}
                    alignItems="center"
                    mt="2"
                    justifyContent="flex-start"
                  >
                    <Select
                      value={select.id}
                      onChange={(e) => {
                        const newSelects = [...payerSelects];
                        newSelects[index].id = e.target.value;
                        setPayerSelects(newSelects);
                      }}
                      width={BOX_WIDTH}
                    >
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.username}
                        </option>
                      ))}
                    </Select>
                    <NumberInput
                      size="sm"
                      maxW="100px"
                      value={select.amount}
                      min={0}
                      precision={2}
                      onChange={(valueAsString, valueAsNumber) =>
                        handlePayerAmountChange(
                          index,
                          valueAsString,
                          valueAsNumber
                        )
                      }
                      ml="20px"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <IconButton
                      aria-label="Remove payer"
                      icon={<BsFillTrashFill />}
                      onClick={() => removePayerSelect(index)}
                      ml="10px"
                    />
                  </Flex>
                ))}
              </Box>
            </Flex>
            <Flex mt="20px" justifyContent="center" alignItems="center">
              <Box onClick={addPayerSelect} cursor="pointer">
                <HiPlusCircle size={24} color="lightgray" />
              </Box>
            </Flex>
            <Flex>
              <Box mt="15px" marginLeft={200}>
                <Text
                  fontSize="md"
                  as="b"
                  noOfLines={1}
                  pl="10px"
                  pr="5px"
                  color="red"
                >
                  {totalPayerAmount == amount
                    ? ""
                    : `Error message: The total amount should be $${amount}`}
                </Text>
              </Box>
            </Flex>
            <Flex mt="30px" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Box w="30px">
                  <IoPerson size={24} />
                </Box>
                <Box w="140px">
                  <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                    For whom
                  </Text>
                </Box>
                <Box display="flex" alignItems="center" marginLeft={350}>
                  <Switch
                    colorScheme="blue"
                    size="md"
                    isChecked={customizeSwitchOn}
                    onChange={(e) => setCustomizeSwitchOn(e.target.checked)}
                  />
                  <Text
                    fontSize="sm"
                    as="b"
                    noOfLines={1}
                    pl="10px"
                    pr="5px"
                    color={customizeSwitchOn ? "black" : "lightgray"}
                  >
                    Customize
                  </Text>
                </Box>
              </Box>
            </Flex>
            <Flex>
              <Box mt="15px" marginLeft={200}>
                {/* {members.map((member) => (
                  <Flex key={member.id} alignItems="center" w="full" mt="2">
                    <Checkbox
                      size="md"
                      colorScheme="blue"
                      isChecked={checkboxStates[member.id]}
                      onChange={(e) =>
                        handleCheckboxChange(member.id, e.target.checked)
                      }
                    />
                    <Text
                      fontSize="md"
                      as="b"
                      noOfLines={1}
                      pl="10px"
                      pr="5px"
                      flexGrow={1}
                      color={checkboxStates[member.id] ? "black" : "lightgray"}
                    >
                      {member.username}
                    </Text>
                    <Box marginLeft={250}>
                      <NumberInput
                        size="sm"
                        maxW="100px"
                        defaultValue={0}
                        min={0}
                        precision={2}
                        value={sharerAmounts[member.id] || 0}
                        onChange={(valueAsString, valueAsNumber) =>
                          handleSharerAmountChange(
                            member.id,
                            valueAsString,
                            valueAsNumber
                          )
                        }
                        isDisabled={!checkboxStates[member.id]}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Box>
                  </Flex>
                ))} */}
                {/* {members.map((member) => (
                  <Flex key={member.id} alignItems="center" w="full" mt="2">
                    <Checkbox
                      size="md"
                      colorScheme="blue"
                      isChecked={checkboxStates[member.id]}
                      onChange={(e) =>
                        handleCheckboxChange(member.id, e.target.checked)
                      }
                    />
                    <Text
                      fontSize="md"
                      as="b"
                      noOfLines={1}
                      pl="10px"
                      pr="5px"
                      flexGrow={1}
                      color={checkboxStates[member.id] ? "black" : "lightgray"}
                    >
                      {member.username}
                    </Text>
                    <Box marginLeft={250}>
                      <NumberInput
                        size="sm"
                        maxW="100px"
                        defaultValue={0}
                        min={0}
                        precision={2}
                        value={sharerAmounts[member.id] || 0}
                        onChange={(valueAsString, valueAsNumber) =>
                          handleSharerAmountChange(
                            member.id,
                            valueAsString,
                            valueAsNumber
                          )
                        }
                        isDisabled={
                          !checkboxStates[member.id] || !customizeSwitchOn
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Box>
                  </Flex>
                ))} */}
                {members.map((member) => (
                  <Flex key={member.id} alignItems="center" w="full" mt="2">
                    <Checkbox
                      size="md"
                      colorScheme="blue"
                      isChecked={checkboxStates[member.id]}
                      onChange={(e) =>
                        handleCheckboxChange(member.id, e.target.checked)
                      }
                    />
                    <Text
                      fontSize="md"
                      as="b"
                      noOfLines={1}
                      pl="10px"
                      pr="5px"
                      flexGrow={1}
                      color={checkboxStates[member.id] ? "black" : "lightgray"}
                    >
                      {member.username}
                    </Text>
                    <Box marginLeft={250}>
                      <NumberInput
                        size="sm"
                        maxW="100px"
                        defaultValue={0}
                        min={0}
                        precision={2}
                        value={sharerAmounts[member.id] || 0}
                        onChange={(valueAsString, valueAsNumber) =>
                          handleSharerAmountChange(
                            member.id,
                            valueAsString,
                            valueAsNumber
                          )
                        }
                        isDisabled={
                          !checkboxStates[member.id] || !customizeSwitchOn
                        }
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
              <Box mt="15px" marginLeft={200}>
                <Text
                  fontSize="md"
                  as="b"
                  noOfLines={1}
                  pl="10px"
                  pr="5px"
                  color="red"
                >
                  {totalSharerAmount == amount
                    ? ""
                    : `Error message: The total amount should be $${amount}`}
                </Text>
              </Box>
            </Flex>
            <Flex mt="20px" alignItems="center">
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
                  height={200}
                  width={400}
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
      {/* {isPending || isEditPending ? <Loading /> : null} */}
    </>
  );
}
