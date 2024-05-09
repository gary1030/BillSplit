"use server";
import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";

export default async function createGroupTransaction(
  title: string,
  groupId: string,
  consumptionDate: Date,
  categoryId: string,
  amount: number,
  payerDetails: { payerId: string; amount: number }[],
  sharerDetails: { sharerId: string; amount: number }[],
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
        groupId: groupId,
        title: title,
        consumptionDate: consumptionDate,
        categoryId: categoryId,
        totalAmount: amount,
        payerDetails: payerDetails,
        splitDetails: sharerDetails,
        note: note,
      }),
    });
    return data;
  } catch (error) {
    console.error("Failed to create group transaction", error);
    return null;
  }
}
