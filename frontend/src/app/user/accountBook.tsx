"use client";

import AddUserRecordButton from "@/components/addUserRecordButton";
import PersonalAnalysis from "@/components/personalAnalysis";
import PersonalRecord from "@/components/personalRecord";
import { Center, IconButton, Text } from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import {
  addDays,
  addMonths,
  endOfMonth,
  startOfMonth,
  subDays,
} from "date-fns";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function AccountBook() {
  const [cookies] = useCookies(["userId"]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  ]);

  const handlePrevMonth = () => {
    setSelectedDates([
      startOfMonth(new Date(subDays(selectedDates[0], 1))),
      endOfMonth(new Date(subDays(selectedDates[0], 1))),
    ]);
  };

  const handleNextMonth = () => {
    if (!selectedDates[1]) {
      setSelectedDates([
        startOfMonth(new Date(addMonths(selectedDates[0], 1))),
        endOfMonth(new Date(addMonths(selectedDates[0], 1))),
      ]);
      return;
    }
    setSelectedDates([
      startOfMonth(new Date(addDays(selectedDates[1], 1))),
      endOfMonth(new Date(addDays(selectedDates[1], 1))),
    ]);
  };

  return (
    <>
      <Center mb="15px">
        <Text fontSize={{ base: "2xl", md: "3xl" }} as="b">
          Personal Account Book
        </Text>
      </Center>
      <Center>
        <IconButton
          aria-label="Previous Month"
          icon={<MdKeyboardArrowLeft size={20} />}
          mr={2}
          onClick={handlePrevMonth}
        />
        <RangeDatepicker
          selectedDates={selectedDates}
          onDateChange={setSelectedDates}
          propsConfigs={{
            dayOfMonthBtnProps: {
              defaultBtnProps: {
                borderColor: "purple.200",
                _hover: {
                  background: "purple.400",
                },
              },
              todayBtnProps: {
                background: "blue.300",
              },
            },
          }}
        />
        <IconButton
          aria-label="Next Month"
          icon={<MdKeyboardArrowRight size={20} />}
          ml={2}
          onClick={handleNextMonth}
        />
      </Center>
      <PersonalAnalysis
        startTime={selectedDates[0]}
        endTime={selectedDates[1]}
      />
      <PersonalRecord startTime={selectedDates[0]} endTime={selectedDates[1]} />
      <AddUserRecordButton
        userId={cookies.userId}
        startTime={selectedDates[0]}
        endTime={selectedDates[1]}
      />
    </>
  );
}
