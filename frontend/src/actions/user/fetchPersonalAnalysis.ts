"use server";
import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";

export default async function fetchPersonalAnalysis(
  userId: string,
  startTime?: Date,
  endTime?: Date
) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const data = await httpAgent(
      `/users/${userId}/analysis?${startTime ? `startTime=${startTime}&` : ""}${
        endTime ? `endTime=${endTime}&` : ""
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw new Error("Failed to fetch personal analysis!");
  }
}
