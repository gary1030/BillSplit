"use client";

import fetchGroup from "@/actions/group/fetchGroup";
import fetchUserBatch from "@/actions/user/fetchUserBatch";
import AddRecordButton from "@/components/addGroupRecordButton";
import GroupInvitation from "@/components/groupInvitation";
import GroupMember from "@/components/groupMember";
import GroupTitle from "@/components/groupTitle";
import ImageCard from "@/components/imageCard";
import Loading from "@/components/loading";
import { Container } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

interface GroupManagementProps {
  groupId: string;
}

export default function GroupManagement({ groupId }: GroupManagementProps) {
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
      <ImageCard width="100%" height="30vh" path={`/${data.theme}`} />
      <Container mt="20px" ml={0} mr={0} maxW="100%" pl={0} pr={0}>
        <GroupTitle title={data.name} theme={data.theme} canEdit={true} />
        <GroupMember groupId={groupId} members={membersData?.users || []} />
        <GroupInvitation groupId={groupId} />
      </Container>
      <AddRecordButton groupId={groupId} />
    </>
  );
}
