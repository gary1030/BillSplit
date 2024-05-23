"use server";
import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";

export default async function fetchGroupTransactions(
  groupId: string,
  startTime?: Date,
  endTime?: Date
) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const data = await httpAgent(
      `/groups/${groupId}/transactions?${
        startTime ? `startTime=${startTime}` : ""
      }${endTime ? `&endTime=${endTime}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.data;
  } catch (error) {
    throw new Error("Failed to fetch group transactions!");
  }
}
