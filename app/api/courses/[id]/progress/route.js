import { NextResponse } from "next/server";
import { authenticatedFetch } from "../../../../lib/auth";
import { BACKEND_URL } from "../../../../lib/config";
export async function GET(request, { params }) {
  const { id } = await params;

  const result = await authenticatedFetch(
    `${BACKEND_URL}/api/courses/${id}/progress/`
  );

  if (!result.response) {
    return NextResponse.json(
      { detail: "You must be logged in." },
      { status: 401 }
    );
  }

  const data = await result.response.json();

  const nextResponse = NextResponse.json(data, {
    status: result.response.status,
  });

  if (result.refreshed) {
    nextResponse.cookies.set(
      "access_token",
      result.accessToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      }
    );
  }

  return nextResponse;
}