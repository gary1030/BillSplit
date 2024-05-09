"use server";
import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";

export default async function createGroupTransaction(
  groupId: string,
  title: string,
  groupName: string,
  date: Date,
  category: string,
  amount: number,
  payerDetails: { id: string; amount: number }[],
  sharerDetails: { id: string; amount: number }[],
  note: string
) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const data = await httpAgent(`/groups/${groupId}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        groupName: groupName,
        date: date,
        category: category,
        amount: amount,
        payerDetails: payerDetails,
        sharerDetails: sharerDetails,
        note: note,
      }),
    });
    return data;
  } catch (error) {
    console.error("Failed to create group transaction", error);
    return null;
  }
}
