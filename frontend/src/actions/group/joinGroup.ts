"use server";
import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";

export default async function joinGroup(groupId: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const data = await httpAgent(`/groups/${groupId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw new Error("Failed to join group");
  }
}
