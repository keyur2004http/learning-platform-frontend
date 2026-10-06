import { NextResponse } from "next/server";
import { authenticatedFetch } from "../../../../lib/auth";
import { BACKEND_URL } from "../../../../lib/config";

function createResponse(data, status, refreshed, accessToken) {
  const response = NextResponse.json(data, { status });

  if (refreshed) {
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}


// GET REVIEWS
export async function GET(request, { params }) {
  const { id } = await params;

  const response = await fetch(
    `${BACKEND_URL}/api/courses/${id}/reviews/`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}


// ADD REVIEW
export async function POST(request) {
  const body = await request.json();

  const result = await authenticatedFetch(
    `${BACKEND_URL}/api/reviews/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!result.response) {
    return NextResponse.json(
      { detail: "You must be logged in." },
      { status: 401 }
    );
  }

  const data = await result.response.json();

  return createResponse(
    data,
    result.response.status,
    result.refreshed,
    result.accessToken
  );
}


// UPDATE REVIEW
export async function PATCH(request) {
  const body = await request.json();
  const reviewId = body.id;

  const result = await authenticatedFetch(
    `${BACKEND_URL}/api/reviews/${reviewId}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!result.response) {
    return NextResponse.json(
      { detail: "You must be logged in." },
      { status: 401 }
    );
  }

  const data = await result.response.json();

  return createResponse(
    data,
    result.response.status,
    result.refreshed,
    result.accessToken
  );
}


// DELETE REVIEW
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get("id");

  const result = await authenticatedFetch(
    `${BACKEND_URL}/api/reviews/${reviewId}/`,
    {
      method: "DELETE",
    }
  );

  if (!result.response) {
    return NextResponse.json(
      { detail: "You must be logged in." },
      { status: 401 }
    );
  }

  if (result.response.status === 204) {
    const response = new NextResponse(null, {
      status: 204,
    });

    if (result.refreshed) {
      response.cookies.set("access_token", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return response;
  }

  const data = await result.response.json();

  return createResponse(
    data,
    result.response.status,
    result.refreshed,
    result.accessToken
  );
}