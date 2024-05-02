"use server";
import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";

export default async function fetchUserBatch(ids: string[]) {
  if (ids.length === 0) {
    return [];
  }

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const data = await httpAgent(
      `/users/batch?${new URLSearchParams({ ids: ids.join(",") })}`,
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
    console.error("Failed to fetch user batch:", error);
    throw new Error("Failed to fetch user batch");
  }
}
