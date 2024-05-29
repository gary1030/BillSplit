"use server";
import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";

export default async function fetchAllGroupPersonalStats(groupIds: string[]) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const data = await Promise.all(
      groupIds.map((groupId) =>
        httpAgent(`/groups/${groupId}/personal-stat`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      )
    );
    return data;
  } catch (error) {
    throw new Error("Failed to fetch group personal stats");
  }
}
