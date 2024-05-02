'use client';

import { Heading } from '@chakra-ui/react';

interface User {
  userId: string;
  email: string;
  name: string;
}

interface GroupMemberProps {
  groupId: string;
  members: Array<User>;
}

export default function GroupMember({ groupId, members }: GroupMemberProps) {
  return (
    <>
      <Heading size="lg" mb="10px">
        Members
      </Heading>
    </>
  );
}
