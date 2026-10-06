import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BACKEND_URL } from "../../../lib/config";
export async function GET(request, { params }) {
  const { id } = await params;

  const response = await fetch(
    `${BACKEND_URL}/api/courses/${id}/`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}

export async function PATCH(request, { params }) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { detail: "You must be logged in." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await request.json();

  const response = await fetch(
    `http://127.0.0.1:8000/api/courses/${id}/`,
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

export async function DELETE(request, { params }) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { detail: "You must be logged in." },
      { status: 401 }
    );
  }

  const { id } = await params;

  const response = await fetch(
    `http://127.0.0.1:8000/api/courses/${id}/`,
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