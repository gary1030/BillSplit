"use client";

import fetchGroup from "@/actions/group/fetchGroup";
import fetchUserBatch from "@/actions/user/fetchUserBatch";
import AddRecordButton from "@/components/addGroupRecordButton";
import GroupBalanceAccordion from "@/components/groupBalanceAccordion";
import GroupTitle from "@/components/groupTitle";
import Loading from "@/components/loading";
import { Container } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

interface GroupBalanceProps {
  groupId: string;
}

export default function GroupBalance({ groupId }: GroupBalanceProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroup(groupId),
  });

  const { data: membersData, error: memberError } = useQuery({
    queryKey: ["groupMembers", data?.memberIds || []],
    queryFn: () => fetchUserBatch(data.memberIds || []),
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Container mt="10px" ml={0} mr={0} maxW="100%" pl={0} pr={0}>
        <GroupTitle title={data.name} theme={data.theme} canEdit={false} />
        <GroupBalanceAccordion groupId={groupId} />
      </Container>
      <AddRecordButton groupId={groupId} />
    </>
  );
}
