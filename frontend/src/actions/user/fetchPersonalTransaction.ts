"use server";
import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";

export default async function fetchPersonalSingleTransaction(
  userId: string,
  transactionId: string
) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const data = await httpAgent(
      `/users/${userId}/transactions/${transactionId}`,
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
    throw new Error("Failed to fetch personal transaction!");
  }
}
