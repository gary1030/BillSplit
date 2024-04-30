"use server";

import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function login(code: string) {
  try {
    const data = await httpAgent("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code }),
    });
    cookies().set("token", data.token);
    cookies().set("username", data.username);
    cookies().set("email", data.email);
    cookies().set("userId", data.id);
  } catch (error) {
    console.error("Failed to login:", error);
  }
  redirect("/group");
}
