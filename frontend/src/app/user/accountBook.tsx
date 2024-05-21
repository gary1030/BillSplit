"use client";

import AddRecordButton from "@/components/addUserRecordButton";
import PersonalAnalysis from "@/components/personalAnalysis";
import PersonalRecord from "@/components/personalRecord";
import { Center, Text } from "@chakra-ui/react";
import { endOfMonth, startOfMonth } from "date-fns";
import { useState } from "react";
import { useCookies } from "react-cookie";

export default function AccountBook() {
  const [cookies] = useCookies(["userId"]);

  const [startTime, setStartTime] = useState<Date>(startOfMonth(new Date()));
  const [endTime, setEndTime] = useState<Date>(endOfMonth(new Date()));

  return (
    <>
      <Center>
        <Text fontSize={{ base: "2xl", md: "3xl" }} as="b">
          Personal Account Book
        </Text>
      </Center>
      <Text>Start Time: {startTime.toDateString()}</Text>
      <Text>End Time: {endTime.toDateString()}</Text>
      <PersonalAnalysis startTime={startTime} endTime={endTime} />
      <PersonalRecord startTime={startTime} endTime={endTime} />
      <AddRecordButton userId={cookies.userId} />
    </>
  );
}
