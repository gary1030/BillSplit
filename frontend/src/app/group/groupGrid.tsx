"use client";
import fetchUserGroups from "@/actions/fetchUserGroups";
import fetchGroupPersonalStat from "@/actions/group/fetchGroupPersonalStat";
import AddGroupCard from "@/components/addGroupCard";
import GroupCard from "@/components/groupCard";
import { Box, Center, SimpleGrid, Spinner } from "@chakra-ui/react";
import { useQueries, useQuery } from "@tanstack/react-query";

interface GroupPersonalStat {
  group_id: string;
  balance: number;
  share: number;
}

export default function GroupGrid() {
  const {
    data: groupsData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["userGroups"],
    queryFn: () => fetchUserGroups(),
  });

  const groupStatsQueries = useQueries({
    queries:
      groupsData?.data?.map((group: any) => ({
        queryKey: ["groupPersonalStat", group.id],
        queryFn: () => fetchGroupPersonalStat(group.id),
        enabled: !!groupsData, // Only run these queries if groupsData is available
        staleTime: 1000 * 60,
      })) || [],
  });

  const combinedStats = groupStatsQueries.reduce<{
    [key: string]: GroupPersonalStat;
  }>((acc, query) => {
    if (query.isLoading) {
      return acc;
    }
    if (query.data) {
      const data = query.data as GroupPersonalStat;
      acc[data.group_id] = data;
    }
    return acc;
  }, {});

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <SimpleGrid minChildWidth="220px" spacing="30px" columnGap="30px">
      {groupsData?.data?.map((group: any) => {
        const personalStat = combinedStats[group.id];

        return (
          <Box key={group.id}>
            <Center>
              <GroupCard
                groupId={group.id}
                name={group.name}
                theme={group.theme}
                share={personalStat?.share || 0}
                balance={personalStat?.balance || 0}
              />
            </Center>
          </Box>
        );
      })}
      <Box>
        <Center>
          <AddGroupCard />
        </Center>
      </Box>
    </SimpleGrid>
  );
}
