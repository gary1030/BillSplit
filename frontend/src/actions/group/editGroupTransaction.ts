"use server";
import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";

export default async function editGroupTransaction(
  transactionId: string,
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
    const data = await httpAgent(
      `/groups/${groupId}/transactions/${transactionId}`,
      {
        method: "PUT",
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
      }
    );
    return data;
  } catch (error) {
    console.error("Failed to edit group transaction!", error);
    return null;
  }
}
