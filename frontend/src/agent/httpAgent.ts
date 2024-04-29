"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function httpAgent(url: string, options: RequestInit) {
  const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
  const response = await fetch(fullUrl, options);

  // if unauthorized, clear cookies and redirect to login page
  if (response.status === 401) {
    const cookieStore = cookies();
    cookieStore.delete("token");
    redirect("/");
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export default httpAgent;
