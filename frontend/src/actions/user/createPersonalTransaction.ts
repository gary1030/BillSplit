"use server";
import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";

export default async function createPersonalTransaction(
  userId: string,
  title: string,
  consumptionDate: Date,
  categoryId: string,
  amount: number,
  note: string
) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const data = await httpAgent(`/users/${userId}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        // type: "EXPENSE",
        consumptionDate: consumptionDate,
        categoryId: categoryId,
        amount: amount,
        note: note,
      }),
    });
    return data;
  } catch (error) {
    console.error("Failed to create user transaction!", error);
    return null;
  }
}
