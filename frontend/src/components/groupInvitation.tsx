"use client";

import {
  Box,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";

import { MdContentCopy } from "react-icons/md";

interface GroupInvitationProps {
  groupId: string;
}

export default function GroupInvitation({ groupId }: GroupInvitationProps) {
  const inviteLink = `${window.location.origin}/invite/${groupId}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  return (
    <>
      <Heading size="lg" mb="10px">
        Invitation
      </Heading>
      <Stack direction={["column", "row"]} spacing="15px">
        <Box minW="240px" maxW="240px" lineHeight="40px">
          <Text as="b">Invite friends through this link:</Text>
        </Box>
        <Box flex="1">
          <InputGroup size="md">
            <Input pr="3rem" isReadOnly={true} value={inviteLink} />
            <InputRightElement width="3.5rem">
              <IconButton
                aria-label="Copy Link"
                icon={<MdContentCopy />}
                h="2rem"
                w="2rem"
                onClick={onCopy}
              />
            </InputRightElement>
          </InputGroup>
        </Box>
      </Stack>
    </>
  );
}
