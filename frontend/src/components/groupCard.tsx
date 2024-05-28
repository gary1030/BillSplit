"use client";

import {
  Box,
  Card,
  CardBody,
  Center,
  Divider,
  Flex,
  Image,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface GroupCardProps {
  groupId: string;
  name: string;
  theme: string;
  share: number;
  balance: number;
  isLoading: boolean;
}

export default function GroupCard({
  groupId,
  name,
  theme,
  share,
  balance,
  isLoading,
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
        <CardBody padding={0} w="216px">
          <Skeleton
            isLoaded={!isLoading}
            borderTopLeftRadius="md"
            borderTopRightRadius="md"
          >
            <Box h="145px">
              <Image
                src={`../${theme}`}
                alt="Theme"
                w="full"
                minH="145px"
                borderTopLeftRadius="md"
                borderTopRightRadius="md"
              />
            </Box>
          </Skeleton>
          <Divider
            orientation="horizontal"
            borderColor="black"
            borderWidth="1px"
            opacity={1}
          />
          <Text
            pl="15px"
            pr="15px"
            pt="12px"
            pb="12px"
            fontSize="lg"
            as="b"
            isTruncated
            display={"block"}
          >
            {name}
          </Text>
          <Flex justifyContent="space-between" ml="15px" mr="15px">
            <Skeleton isLoaded={!isLoading} borderRadius="lg">
              <Box
                h="55px"
                w="85px"
                bgColor="gray.200"
                borderRadius="lg"
                p="5px"
              >
                <Center>
                  <Text fontSize="sm">Your Share</Text>
                </Center>
                <Center>
                  <Text fontSize="sm" as="b">
                    {`-$${Math.round(share)}`}
                  </Text>
                </Center>
              </Box>
            </Skeleton>
            <Skeleton isLoaded={!isLoading} borderRadius="lg">
              <Box
                h="55px"
                w="85px"
                bgColor={bgColor}
                borderRadius="lg"
                p="5px"
              >
                <Center>
                  <Text fontSize="sm">{status}</Text>
                </Center>
                <Center>
                  <Text fontSize="sm" as="b">
                    {balance === 0
                      ? `$0`
                      : balance < 0
                      ? `+$${-Math.round(balance)}`
                      : `-$${Math.round(balance)}`}
                  </Text>
                </Center>
              </Box>
            </Skeleton>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
}
