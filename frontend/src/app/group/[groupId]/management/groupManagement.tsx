'use client';

import fetchGroup from '@/actions/group/fetchGroup';
import { useQueries, useQuery } from '@tanstack/react-query';
import { Container } from '@chakra-ui/react';
import GroupTitle from '@/components/groupTitle';
import Loading from '@/components/loading';
import GroupInvitation from '@/components/groupInvitation';
import GroupMember from '@/components/groupMember';

interface GroupManagementProps {
  groupId: string;
}

export default function GroupManagement({ groupId }: GroupManagementProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['userGroups'],
    queryFn: () => fetchGroup(groupId),
  });

  if (isLoading) {
    return <Loading />;
  }

  console.log(data);

  return (
    <Container mt="20px" ml={0} mr={0} maxW="100%" pl={0} pr={0}>
      <GroupTitle title={data.name} />
      <GroupMember groupId={groupId} members={[]} />
      <GroupInvitation groupId={groupId} />
    </Container>
  );
}
