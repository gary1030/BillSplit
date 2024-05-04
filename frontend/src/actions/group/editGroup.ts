"use server";
import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";

export default async function editGroup(
  groupId: string,
  name: string,
  theme: string
) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const data = await httpAgent(`/groups/${groupId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: name, theme: theme }),
    });
    return data;
  } catch (error) {
    console.error("Failed to edit group:", error);
    return null;
  }
}
