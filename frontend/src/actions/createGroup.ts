"use server";
import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";

export default async function createGroup(name: string, theme: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const data = await httpAgent("/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: name, theme: theme }),
    });
    return data;
  } catch (error) {
    console.error("Failed to create group:", error);
    return null;
  }
}
