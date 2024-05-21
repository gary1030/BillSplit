"use server";
import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";

export default async function fetchGroupSingleRepayment(
  groupId: string,
  repaymentId: string
) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const data = await httpAgent(
      `/groups/${groupId}/repayments/${repaymentId}`,
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
    throw new Error("Failed to fetch group repayment!");
  }
}
