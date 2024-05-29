"use client";
import fetchUserGroups from "@/actions/fetchUserGroups";
import fetchAllGroupPersonalStats from "@/actions/group/fetchAllGroupPersonalStat";
import AddGroupCard from "@/components/addGroupCard";
import GroupCard from "@/components/groupCard";
import Loading from "@/components/loading";
import { Box, Center, SimpleGrid } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

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

  const groupIds = groupsData?.data?.map((group: any) => group.id) || [];
  const { data: groupStatsQueries } = useQuery({
    queryKey: ["allGroupPersonalStats", groupIds],
    queryFn: () => fetchAllGroupPersonalStats(groupIds),
    enabled: !!groupIds.length,
    staleTime: 1000 * 60,
  });

  const combinedStats = groupStatsQueries?.reduce<{
    [key: string]: GroupPersonalStat;
  }>((acc, query) => {
    acc[query.group_id] = query;
    return acc;
  }, {});

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SimpleGrid minChildWidth="220px" spacing="30px" columnGap="30px">
      {groupsData?.data
        ?.sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt))
        .map((group: any) => {
          const personalStat = combinedStats
            ? combinedStats[group.id]
            : undefined;

          return (
            <Box key={group.id}>
              <Center>
                <GroupCard
                  groupId={group.id}
                  name={group.name}
                  theme={group.theme}
                  share={personalStat?.share || 0}
                  balance={personalStat?.balance || 0}
                  isLoading={personalStat === undefined}
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
