"use client";

import fetchGroup from "@/actions/group/fetchGroup";
import AddRecordButton from "@/components/addGroupRecordButton";
import GroupRecordTable from "@/components/groupRecordTable";
import GroupTitle from "@/components/groupTitle";
import Loading from "@/components/loading";
import { Container } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

interface GroupRecordProps {
  groupId: string;
}

export default function GroupRecord({ groupId }: GroupRecordProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroup(groupId),
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Container mt="10px" ml={0} mr={0} maxW="100%" pl={0} pr={0}>
        <GroupTitle title={data.name} theme={data.theme} canEdit={false} />
        <GroupRecordTable groupId={groupId} />
      </Container>
      <AddRecordButton groupId={groupId} />
    </>
  );
}
