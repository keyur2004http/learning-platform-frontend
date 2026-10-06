import { NextResponse } from "next/server";
import { BACKEND_URL } from "../../lib/config";
export async function POST(request) {
  const body = await request.json();

  const response = await fetch(
    `${BACKEND_URL}/api/register/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  return NextResponse.json(
    data,
    { status: response.status }
  );
}