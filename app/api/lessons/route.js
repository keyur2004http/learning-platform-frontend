import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BACKEND_URL } from "../../lib/config";
export async function POST(request) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { detail: "You must be logged in." },
      { status: 401 }
    );
  }

  const body = await request.json();

  const response = await fetch(
    `${BACKEND_URL}/api/lessons/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}