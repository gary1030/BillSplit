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

import { SingleDatepicker } from "chakra-dayzed-datepicker";

import FormHeader from "./formHeader";
import Loading from "./loading";

import createGroup from "@/actions/group/createGroup";
import editGroup from "@/actions/group/editGroup";

import fetchGroup from "@/actions/group/fetchGroup";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface GroupTransactionFormProps {
  // mode: "create" | "edit";
  onClose: () => void;
  isOpen: boolean;
  defaultTitle?: string;
  defaultGroupName?: string;
  // defaultTheme?: string;
  groupId: string;
}

// const imagePaths = [
//   "images/food.jpg",
//   "images/mountain.jpg",
//   "images/party.jpg",
//   "images/tokyo.jpg",
// ];

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
  defaultGroupName,
  // defaultTheme,
  groupId,
}: GroupTransactionFormProps) {
  const [groupName, setGroupName] = useState(defaultGroupName || "");
  const [title, setTitle] = useState(defaultTitle || "");
  // const [selectedTheme, setSelectedTheme] = useState(
  //   defaultTheme || imagePaths[0]
  // );
  const [date, setDate] = useState(new Date());
  const [customizeSwitchOn, setCustomizeSwitchOn] = useState(false);
  const [amount, setAmount] = useState(0);

  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroup(groupId),
  });
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
                  {data ? data.name : "Loading..."}
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
                <Select placeholder="Select category">
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
                <NumberInput defaultValue={0} min={0}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </Flex>
            <Box w="140px"></Box>
            <Flex mt="20px" alignItems="center">
              <Box w="30px">
                <IoPerson size={24} />
              </Box>
              <Box w="140px">
                <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                  Paid by
                </Text>
              </Box>
              {/* <Box>
                <Input
                  placeholder="Group Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Box> */}
            </Flex>
            <Flex mt="20px" justifyContent="center" alignItems="center">
              <Box>
                <HiPlusCircle size={24} color="lightgray" />
              </Box>
            </Flex>
            <Flex mt="20px" alignItems="center" justifyContent="space-between">
              <Flex>
                <Box display="flex" alignItems="center">
                  <Box w="30px">
                    <IoPerson size={24} />
                  </Box>
                  <Box w="140px">
                    <Text fontSize="md" as="b" noOfLines={1} pl="10px" pr="5px">
                      For whom
                    </Text>
                  </Box>
                </Box>
              </Flex>
              <Flex>
                <Box display="flex" alignItems="center">
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
              </Flex>
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
                  //   value={name}
                  //   onChange={(e) => setName(e.target.value)}
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
