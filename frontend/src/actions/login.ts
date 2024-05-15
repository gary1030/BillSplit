"use server";

import httpAgent from "@/agent/httpAgent";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const expiration = 60 * 60 * 24 * 7 * 2; // 2 week

export default async function login(code: string) {
  try {
    const data = await httpAgent("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code }),
    });
    cookies().set("token", data.token, { maxAge: expiration });
    cookies().set("username", data.username, { maxAge: expiration });
    cookies().set("email", data.email, { maxAge: expiration });
    cookies().set("userId", data.id, { maxAge: expiration });
  } catch (error) {
    console.error("Failed to login:", error);
  }
  redirect("/group");
}
