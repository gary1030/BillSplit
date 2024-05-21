"use client";

import PersonalAnalysis from "@/components/personalAnalysis";
import PersonalRecord from "@/components/personalRecord";
import AddRecordButton from "@/components/addUserRecordButton";
import { Center, Text } from "@chakra-ui/react";
import { endOfMonth, startOfMonth } from "date-fns";
import { useState } from "react";

interface AccountBookProps {
  userId: string;
}

export default function AccountBook({ userId }: AccountBookProps) {
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
      <AddRecordButton userId={userId} />
    </>
  );
}
