"use server";
import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";

export default async function createGroupRepayment(
  groupId: string,
  payerId: string,
  receiverId: string,
  amount: number
) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const data = await httpAgent(`/groups/${groupId}/repayments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        groupId: groupId,
        payerId: payerId,
        receiverId: receiverId,
        amount: amount,
      }),
    });
    return data;
  } catch (error) {
    console.error("Failed to create group repayment!", error);
    return null;
  }
}
