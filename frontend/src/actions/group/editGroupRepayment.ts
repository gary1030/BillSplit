"use server";
import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";

export default async function editGroupTransaction(
  repaymentId: string,
  groupId: string,
  payerId: string,
  receiverId: string,
  amount: number
) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const data = await httpAgent(
      `/groups/${groupId}/repayments/${repaymentId}`,
      {
        method: "PUT",
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
      }
    );
    return data;
  } catch (error) {
    console.error("Failed to edit group repayment!", error);
    return null;
  }
}
