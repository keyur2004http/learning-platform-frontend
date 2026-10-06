import { NextResponse } from "next/server";
import { BACKEND_URL } from "../../../../lib/config";

export async function GET(request, { params }) {
  const { id } = await params;

  const response = await fetch(
    `${BACKEND_URL}/api/courses/${id}/rating/`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}