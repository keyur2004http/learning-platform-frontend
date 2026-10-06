import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BACKEND_URL } from "../../lib/config";
export async function POST() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { detail: "No refresh token" },
      { status: 401 }
    );
  }

  const response = await fetch(
    `${BACKEND_URL}/api/token/refresh/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      data,
      { status: response.status }
    );
  }

  const nextResponse = NextResponse.json({
    message: "Access token refreshed",
  });

  nextResponse.cookies.set(
    "access_token",
    data.access,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    }
  );

  return nextResponse;
}