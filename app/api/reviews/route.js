import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BACKEND_URL } from "../../../lib/config";
async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
}

export async function POST(request) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      { detail: "You must be logged in." },
      { status: 401 }
    );
  }

  const body = await request.json();

  const response = await fetch(
    `${BACKEND_URL}/api/reviews/`,
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

export async function PATCH(request) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      { detail: "You must be logged in." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const reviewId = body.id;

  const response = await fetch(
    `http://127.0.0.1:8000/api/reviews/${reviewId}/`,
    {
      method: "PATCH",
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

export async function DELETE(request) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      { detail: "You must be logged in." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get("id");

  const response = await fetch(
    `http://127.0.0.1:8000/api/reviews/${reviewId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.status === 204) {
    return new NextResponse(null, {
      status: 204,
    });
  }

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}