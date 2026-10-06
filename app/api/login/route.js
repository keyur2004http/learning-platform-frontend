import { NextResponse } from "next/server";
import { BACKEND_URL } from "../../lib/config";
export async function POST(request) {
  const body = await request.json();

  const response = await fetch(
    `${BACKEND_URL}/api/login/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
    message: "Login successful"
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

  nextResponse.cookies.set(
    "refresh_token",
    data.refresh,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    }
  );

  return nextResponse;
}