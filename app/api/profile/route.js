import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BACKEND_URL } from "../../lib/config";
export async function GET() {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json(
      { detail: "Not authenticated" },
      { status: 401 }
    );
  }

  let response = await fetch(
    `${BACKEND_URL}/api/profile/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (response.status !== 401) {
    const data = await response.json();

    return NextResponse.json(
      data,
      { status: response.status }
    );
  }

  if (!refreshToken) {
    return NextResponse.json(
      { detail: "Session expired. Please login again." },
      { status: 401 }
    );
  }

  const refreshResponse = await fetch(
    `${BACKEND_URL}/api/token/refresh/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
      cache: "no-store",
    }
  );

  if (!refreshResponse.ok) {
    return NextResponse.json(
      { detail: "Session expired. Please login again." },
      { status: 401 }
    );
  }

  const refreshData = await refreshResponse.json();

  accessToken = refreshData.access;

  response = await fetch(
    `${BACKEND_URL}/api/profile/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  const nextResponse = NextResponse.json(
    data,
    { status: response.status }
  );

  nextResponse.cookies.set(
    "access_token",
    accessToken,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    }
  );

  return nextResponse;
}