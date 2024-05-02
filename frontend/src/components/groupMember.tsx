"use client";

import {
  Container,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

interface User {
  id: string;
  email: string;
  username: string;
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
      <Container maxW="500px" p={0} mb="30px">
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>NAME</Th>
                <Th>EMAIL</Th>
              </Tr>
            </Thead>
            <Tbody>
              {members.map((member) => (
                <Tr key={member.id}>
                  <Td>{member.username}</Td>
                  <Td>{member.email}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
