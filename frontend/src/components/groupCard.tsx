"use client";

import {
  Box,
  Card,
  CardBody,
  Center,
  Divider,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface GroupCardProps {
  groupId: string;
  name: string;
  theme: string;
  share: number;
  balance: number;
}

export default function GroupCard({
  groupId,
  name,
  theme,
  share,
  balance,
}: GroupCardProps) {
  const router = useRouter();
  let status = "Payable";
  let bgColor = "red.300";
  if (balance === 0) {
    status = "Settled";
    bgColor = "purple.300";
  } else if (balance < 0) {
    status = "Receivable";
    bgColor = "green.300";
  }

  return (
    <>
      <Card
        align="center"
        w="220px"
        h="270px"
        onClick={() => router.push(`/group/${groupId}`)}
        _hover={{
          cursor: "pointer",
          transform: "scale(1.03)",
          transition: "all 0.1s",
        }}
        borderColor="black"
        borderWidth="2px"
        borderRadius="lg"
      >
        <CardBody padding={0}>
          <Image
            src={`../${theme}`}
            alt="Theme"
            w="full"
            borderTopLeftRadius="md"
            borderTopRightRadius="md"
          />
          <Divider
            orientation="horizontal"
            borderColor="black"
            borderWidth="1px"
            opacity={1}
            mb="10px"
          />
          <Text p="15px" fontSize="lg" as="b">
            {name}
          </Text>
          <Flex justifyContent="space-between" ml="15px" mr="15px" mt="10px">
            <Box h="55px" w="85px" bgColor="gray.200" borderRadius="lg" p="5px">
              <Center>
                <Text fontSize="sm">Your Share</Text>
              </Center>
              <Center>
                <Text fontSize="sm" as="b">
                  {`-$${share}`}
                </Text>
              </Center>
            </Box>
            <Box h="55px" w="85px" bgColor={bgColor} borderRadius="lg" p="5px">
              <Center>
                <Text fontSize="sm">{status}</Text>
              </Center>
              <Center>
                <Text fontSize="sm" as="b">
                  {balance <= 0 ? `+$${-balance}` : `-$${-balance}`}
                </Text>
              </Center>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
}
